"use strict";

let scene, camera, light, renderer, xVelocity, yVelocity, onetimeExecution = 0;
let totalscore = 0;
let timeOfResize;
const playerSphere = new THREE.Mesh(SPHERE_GEOMETRY,
                                    new THREE.MeshStandardMaterial({
                                        color: BALL_COLOR
                                       }));

playerSphere.scale.set(...PLAYER_DIMENSIONS);

const DEATH_ZONE = new THREE.Mesh(CUBE_GEOMETRY, new THREE.MeshStandardMaterial({color: "red", transparent: true, opacity: 0.0}));
DEATH_ZONE.scale.set(18,0.5,1);

let currentTable = null;
playerSphere.geometry.computeBoundingBox();
var playerSphereBoundingBox = playerSphere.geometry.boundingBox.clone();
function switchToTable(newTable) {
    if (currentTable)
        scene.remove(currentTable.sceneNode);

    currentTable = newTable;
    playerSphere.position.set(...newTable.initialPlayerPosition);
    DEATH_ZONE.position.set(...newTable.deathZone);
    scene.add(newTable.sceneNode);

    camera.position.set(newTable.width / 2,
                        newTable.height / 2,
                        newTable.cameraDistance);
    camera.lookAt(newTable.width / 2,
                  newTable.height / 2,
                  0);

    light.position.set(newTable.width / 2,
                       newTable.height / 2,
                       newTable.cameraDistance);
}

function switchToNextTable() {
    if (tables.indexOf(currentTable) == tables.length - 1) {
        return false;
    }
    switchToTable(tables[tables.indexOf(currentTable) + 1]);
    return true;
}

function addscore(value){
    totalscore+=value;
    document.getElementById("texto").innerHTML = totalscore;
}

let lastTime = 0;
function updateScene(timeS) {
    let time = timeS / 1000;
    let deltaTime = time - lastTime;
    lastTime = time;
    yVelocity -= GRAVITY*deltaTime;
    xVelocity  = xVelocity *(1 - GRAVITY/100 * deltaTime);
    if (yVelocity > MAX_SPEED){
        yVelocity = MAX_SPEED
    }
    if (yVelocity < -MAX_SPEED){
        yVelocity = -MAX_SPEED
    }

    if (xVelocity > MAX_SPEED){
        xVelocity = MAX_SPEED
    }
    if (xVelocity < -MAX_SPEED){
        xVelocity = -MAX_SPEED
    }
    currentTable.update(time);
    
    updateSpherePosition(playerSphere, deltaTime,
                         currentTable);
                         
    if(currentTable.playerHasStarted == 1){
        playerSphere.position.y += yVelocity * deltaTime;
        playerSphere.updateMatrixWorld( true );
        playerSphereBoundingBox.copy( playerSphere.geometry.boundingBox ).applyMatrix4( playerSphere.matrixWorld );
        if(playerSphere.position.y > 27.5 - 0.5) {
            //playerSphere.position.y = levelHeight - 0.5;
            xVelocity = -10
            currentTable.playerHasStarted = 2    
            console.log("Phase 2!")
        }

    }
    if(currentTable.playerHasStarted == 2){
        playerSphere.position.y += yVelocity * deltaTime;
        playerSphere.position.x += xVelocity * deltaTime;
        if(playerSphere.position.y > levelHeight - 0.5) {
            playerSphere.position.y = levelHeight - 0.5;
            yVelocity = -yVelocity  
        }
        if(playerSphere.position.y > 27.5) {
            playerSphere.position.y = 27.5; 
            yVelocity = -yVelocity   
        }
        currentTable.playerHasStarted = 3;
        playerSphere.updateMatrixWorld( true );
        playerSphereBoundingBox.copy( playerSphere.geometry.boundingBox ).applyMatrix4( playerSphere.matrixWorld );
    }
    if(currentTable.playerHasStarted == 3){

        if(time - timeOfResize > 5){
            playerSphere.material.color.set("white");
            playerSphere.scale.set(0.4,0.4,0.4)
        }

        playerSphere.position.y += yVelocity * deltaTime;
        playerSphere.position.x += xVelocity * deltaTime;
        playerSphere.updateMatrixWorld( true );
        playerSphereBoundingBox.copy( playerSphere.geometry.boundingBox ).applyMatrix4( playerSphere.matrixWorld );


        if(playerSphere.position.y < 0.5) {
            playerSphere.position.y = 0.5;
            yVelocity = -yVelocity * 0.9
            playerSphere.updateMatrixWorld( true );
            playerSphereBoundingBox.copy( playerSphere.geometry.boundingBox ).applyMatrix4( playerSphere.matrixWorld );
    
        }
        
        
        if(playerSphere.position.y > levelHeight - 0.5) {
            yVelocity = -yVelocity * 0.9
            playerSphere.position.y = levelHeight - 0.5;
            playerSphere.updateMatrixWorld( true );
            playerSphereBoundingBox.copy( playerSphere.geometry.boundingBox ).applyMatrix4( playerSphere.matrixWorld );
     }

        if(playerSphere.position.x < 0.5) {
            xVelocity = -xVelocity * 0.9
            playerSphere.position.x = 0.5; 
            playerSphere.updateMatrixWorld( true );
            playerSphereBoundingBox.copy( playerSphere.geometry.boundingBox ).applyMatrix4( playerSphere.matrixWorld );
    }
                
        if(playerSphere.position.x > levelWidth - 0.5) {
            xVelocity = -xVelocity * 0.9
            playerSphere.position.x = levelWidth - 0.5;
        
            playerSphere.updateMatrixWorld( true );
            playerSphereBoundingBox.copy( playerSphere.geometry.boundingBox ).applyMatrix4( playerSphere.matrixWorld );
    }
        //console.log(currentTable.bottomRightbb, playerSphereBoundingBox)
        
        if(currentTable.bottomLeftbb.intersectsBox(playerSphereBoundingBox)){
            yVelocity = -yVelocity*0.8;
            //console.log("as bounding boxes estão colidindo!")
            playerSphere.position.y = playerSphere.position.y + 0.5
            playerSphere.updateMatrixWorld( true );
            playerSphereBoundingBox.copy( playerSphere.geometry.boundingBox ).applyMatrix4( playerSphere.matrixWorld );
    
        }
        if(currentTable.bottomRightbb.intersectsBox(playerSphereBoundingBox)){
            yVelocity = -yVelocity*0.8;
            console.log("as bounding boxes estão colidindo!")
            playerSphere.position.y = playerSphere.position.y + 0.5
            playerSphere.updateMatrixWorld( true );
            playerSphereBoundingBox.copy( playerSphere.geometry.boundingBox ).applyMatrix4( playerSphere.matrixWorld );
    
        }

        if(currentTable.rightWallTwobb.intersectsBox(playerSphereBoundingBox)){
            xVelocity = -xVelocity*0.8;
            console.log("as bounding boxes estão colidindo!")
            playerSphere.position.x = playerSphere.position.x - 0.5
            playerSphere.updateMatrixWorld( true );
            playerSphereBoundingBox.copy( playerSphere.geometry.boundingBox ).applyMatrix4( playerSphere.matrixWorld );
    
        }

        if(currentTable.leftBooster3bb.intersectsBox(playerSphereBoundingBox)){
            xVelocity = -xVelocity*1.1
            yVelocity = -yVelocity * 1.1
            addscore(10);
            console.log("player encostou no booster esquerdo")
            playerSphere.updateMatrixWorld( true );
            playerSphereBoundingBox.copy( playerSphere.geometry.boundingBox ).applyMatrix4( playerSphere.matrixWorld );
    
        }

        if(currentTable.rightBoosterbb.intersectsBox(playerSphereBoundingBox)){
            xVelocity = -xVelocity*1.1
            yVelocity = -yVelocity * 1.1
            addscore(10);
            console.log("player encostou no booster direito")
            playerSphere.updateMatrixWorld( true );
            playerSphereBoundingBox.copy( playerSphere.geometry.boundingBox ).applyMatrix4( playerSphere.matrixWorld );
    
        }
        //console.log(playerSphere.position.x ,currentTable.width-1.5 )
        if(playerSphere.position.x < currentTable.width - 3 && onetimeExecution == 0){
            currentTable.rightWallTwo.scale.set(1, currentTable.height, 1);
            currentTable.rightWallTwo.position.set(currentTable.width - 1.5, currentTable.height / 2, 0.5);

            currentTable.rightWallTwo.updateMatrixWorld(true);
            currentTable.rightWallTwobb.copy( currentTable.rightWallTwo.geometry.boundingBox ).applyMatrix4(currentTable.rightWallTwo.matrixWorld );
            onetimeExecution = 1;
        }
        for (let x = 0; x < 7; x++){
            if(currentTable.orangecircles[x].meshbb.intersectsBox(playerSphereBoundingBox)){
                document.getElementById('ping').play();
                addscore(10);
                console.log("player encostou no objeto laranja")
                playerSphere.updateMatrixWorld( true );
                playerSphereBoundingBox.copy( playerSphere.geometry.boundingBox ).applyMatrix4( playerSphere.matrixWorld );
        
            }
        }

        if(currentTable.greencircle.meshbb.intersectsBox(playerSphereBoundingBox)){
            document.getElementById('ping').play();
            addscore(100);
            playerSphere.material.color.set("green");
            timeOfResize = time;
            playerSphere.scale.set(0.2,0.2,0.4)
            console.log("player encostou no objeto verde")
            playerSphere.updateMatrixWorld( true );
            playerSphereBoundingBox.copy( playerSphere.geometry.boundingBox ).applyMatrix4( playerSphere.matrixWorld );
    
        }

        if(currentTable.purplecircle.meshbb.intersectsBox(playerSphereBoundingBox)){
            document.getElementById('ping').play();
            addscore(300);
            timeOfResize = time;
            playerSphere.material.color.set("purple");
            playerSphere.scale.set(0.8,0.8,0.8)
            document.getElementById('powerup').play();
            console.log("player encostou no objeto roxo")
            playerSphere.updateMatrixWorld( true );
            playerSphereBoundingBox.copy( playerSphere.geometry.boundingBox ).applyMatrix4( playerSphere.matrixWorld );
    
        }
        playerSphere.updateMatrixWorld( true );
        playerSphereBoundingBox.copy( playerSphere.geometry.boundingBox ).applyMatrix4( playerSphere.matrixWorld );


    }

    
    renderer.render(scene, camera);
    
    if (lookForDeathCollision(playerSphere, DEATH_ZONE)) {
        document.getElementById('fail').play();
        if (confirm("Game Over. Try Again?\nYour score was " + totalscore)) {
            document.getElementById('fail').play();
            location.reload();
            endGame();
        }
        else {
            return;    
        }
    }

    

    
    requestAnimationFrame(updateScene);
}

function init() {
    const canvasDiv = document.querySelector("#canvas-div");

    scene = new THREE.Scene();

    scene.background = new THREE.Color(BACKGROUND_COLOR);

    camera = new THREE.PerspectiveCamera(
        FIELD_OF_VIEW,
        canvasDiv.clientWidth / canvasDiv.clientHeight,
        0.1,     // near-clipping-plane distance
        100      // far-clipping-plane distance
    );

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(canvasDiv.clientWidth, canvasDiv.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    // Add the created canvas element to the page.
    canvasDiv.appendChild(renderer.domElement);

    light = new THREE.PointLight(0xffffff, LIGHT_INTENSITY);
    scene.add(light);

    

    switchToTable(tables[0]);

    scene.add(DEATH_ZONE);
    scene.add(playerSphere);

    requestAnimationFrame(updateScene);
}

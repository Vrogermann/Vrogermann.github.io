const SPHERE_GEOMETRY = new THREE.SphereBufferGeometry(1, 25, 25);
const SQUARE_GEOMETRY = new THREE.PlaneBufferGeometry();
const CUBE_GEOMETRY = new THREE.BoxBufferGeometry();

class Table {
    constructor(initialPlayerPosition, width, height, cameraDistance,
                backgroundColor, wallColor, objectsToBeUpdated, deathZone) {
        this.sceneNode = new THREE.Group();
        this.initialPlayerPosition = initialPlayerPosition;
        this.width = width;
        this.height = height;
        this.cameraDistance = cameraDistance;
        this.deathZone = deathZone;
        this.playerHasStarted = 0;

        let backgroundWall = new THREE.Mesh(SQUARE_GEOMETRY,
                                            new THREE.MeshStandardMaterial({
                                                color: backgroundColor
                                            }));
        backgroundWall.scale.set(width, height, 1);
        backgroundWall.position.set(width / 2, height / 2, 0);
        this.sceneNode.add(backgroundWall);
        
    
        let lowerWall= new THREE.Mesh(SQUARE_GEOMETRY,
                                       new THREE.MeshStandardMaterial({
                                           color: wallColor
                                       }));
        lowerWall.scale.set(width, 1, 1);
        lowerWall.position.set(width / 2, 0, 0.5);
        lowerWall.rotation.x = -Math.PI / 2;
        this.sceneNode.add(lowerWall);
        lowerWall.geometry.computeBoundingBox();
        //console.log(lowerWall)
        this.lowerWallbb = lowerWall.geometry.boundingBox.clone();
        let upperWall = new THREE.Mesh(SQUARE_GEOMETRY,
                                       new THREE.MeshStandardMaterial({
                                           color: wallColor
                                       }));
        upperWall.scale.set(width, 1, 1);
        upperWall.position.set(width / 2, height, 0.5);
        upperWall.rotation.x = Math.PI / 2;

        this.sceneNode.add(upperWall);
        upperWall.geometry.computeBoundingBox();
        this.upperWallbb = upperWall.geometry.boundingBox.clone();

        // Criar a parede inclinada na direita e em cima.
        let upperRight = new THREE.Mesh(
            new THREE.PlaneBufferGeometry(3,0.5,0.5),
            new THREE.MeshStandardMaterial({
                color: wallColor
            }));
        upperRight.position.set(19, 29, 0.5);
        //upperRight.position.set(5, 5, 0.5);
        upperRight.rotation.z = -0.8;
        //console.log(upperRight.rotation.y)
        this.sceneNode.add(upperRight);
        upperRight.geometry.computeBoundingBox();
        this.upperRightbb = upperRight.geometry.boundingBox.clone();

        let leftWall = new THREE.Mesh(SQUARE_GEOMETRY,
                                      new THREE.MeshStandardMaterial({
                                          color: wallColor
                                      }));
        leftWall.scale.set(1, height, 1);
        leftWall.position.set(0, height / 2, 0.5);
        leftWall.rotation.y = Math.PI / 2;
        this.sceneNode.add(leftWall);
        leftWall.geometry.computeBoundingBox();
        this.leftWallbb = leftWall.geometry.boundingBox.clone();

        let rightWall = new THREE.Mesh(SQUARE_GEOMETRY,
                                       new THREE.MeshStandardMaterial({
                                           color: wallColor
                                       }));
        rightWall.scale.set(1, height, 1);
        rightWall.position.set(width, height / 2, 0.5);
        rightWall.rotation.y = -Math.PI / 2;
        this.sceneNode.add(rightWall);
        rightWall.geometry.computeBoundingBox();
        this.rightWallbb = rightWall.geometry.boundingBox.clone();
        
        

        this.rightWallTwo = new THREE.Mesh(SQUARE_GEOMETRY,
                                       new THREE.MeshStandardMaterial({
                                           color: wallColor
                                       }));
        this.rightWallTwo.scale.set(1, height - 5, 1);
        this.rightWallTwo.position.set(width - 1.5, height / 2-2.4, 0.5);
        this.rightWallTwo.rotation.y = -Math.PI / 2;
        this.sceneNode.add(this.rightWallTwo);


        
        this.rightWallTwo.geometry.computeBoundingBox();
        this.rightWallTwobb = this.rightWallTwo.geometry.boundingBox.clone();
        this.rightWallTwo.updateMatrixWorld(true);
        this.rightWallTwobb.copy( this.rightWallTwo.geometry.boundingBox ).applyMatrix4(this.rightWallTwo.matrixWorld );


        //parede na esquerda do flipper
        let bottomLeft = new THREE.Mesh(SQUARE_GEOMETRY,
            new THREE.MeshStandardMaterial({
                color: "red"
            }));
        bottomLeft.scale.set(width/3, 0.5, 1);
        bottomLeft.position.set(3.52, 3 , 0.5);
        bottomLeft.rotation.y = 0;
        this.sceneNode.add(bottomLeft);

        bottomLeft.geometry.computeBoundingBox();
        this.bottomLeftbb = bottomLeft.geometry.boundingBox.clone();
        bottomLeft.updateMatrixWorld(true);
        this.bottomLeftbb.copy( bottomLeft.geometry.boundingBox ).applyMatrix4(bottomLeft.matrixWorld );

        //parede na direita do flipper
        let bottomRight = new THREE.Mesh(SQUARE_GEOMETRY,
            new THREE.MeshStandardMaterial({
                color: "red"
            }));
        bottomRight.scale.set(width/3-1.5, 0.5, 1);
        bottomRight.position.set(15.8, 3 , 0.5);
        bottomRight.rotation.y = 0;
        this.sceneNode.add(bottomRight);

        bottomRight.geometry.computeBoundingBox();
        this.bottomRightbb = bottomRight.geometry.boundingBox.clone();
        bottomRight.updateMatrixWorld(true);
        this.bottomRightbb.copy( bottomRight.geometry.boundingBox ).applyMatrix4(bottomRight.matrixWorld );
        


        let leftBooster3 =  new THREE.Mesh(new THREE.PlaneBufferGeometry(4,2,0.5), new THREE.MeshStandardMaterial({color: "blue"}));
        leftBooster3.position.set(1.7,10, 0.5);
        leftBooster3.rotation.z = -Math.PI/2.15
        this.sceneNode.add(leftBooster3);

        leftBooster3.geometry.computeBoundingBox();
        this.leftBooster3bb = leftBooster3.geometry.boundingBox.clone();
        leftBooster3.updateMatrixWorld(true);
        this.leftBooster3bb.copy( leftBooster3.geometry.boundingBox ).applyMatrix4(leftBooster3.matrixWorld );

        let rightBooster =  new THREE.Mesh(new THREE.PlaneBufferGeometry(4,2,0.5), new THREE.MeshStandardMaterial({color: "blue"}));
        rightBooster.position.set(16.8,10, 0.5);
        rightBooster.rotation.z = Math.PI/2.15
        this.sceneNode.add(rightBooster);

        rightBooster.geometry.computeBoundingBox();
        this.rightBoosterbb = rightBooster.geometry.boundingBox.clone();
        rightBooster.updateMatrixWorld(true);
        this.rightBoosterbb.copy( rightBooster.geometry.boundingBox ).applyMatrix4(rightBooster.matrixWorld );

        this.orangecircles = [
        new interactibleCircle(1,[1 + Math.floor(Math.random() * (width-2)),1 + Math.floor(Math.random() * (height-2)) ,0.15],"orange", this.sceneNode),
        new interactibleCircle(1,[1 + Math.floor(Math.random() * (width-2)),1 + Math.floor(Math.random() * (height-2)) ,0.15],"orange", this.sceneNode),
        new interactibleCircle(1,[1 + Math.floor(Math.random() * (width-2)),1 + Math.floor(Math.random() * (height-2)) ,0.15],"orange", this.sceneNode),
        new interactibleCircle(1,[1 + Math.floor(Math.random() * (width-2)),1 + Math.floor(Math.random() * (height-2)) ,0.15],"orange", this.sceneNode),
        new interactibleCircle(1,[1 + Math.floor(Math.random() * (width-2)),1 + Math.floor(Math.random() * (height-2)) ,0.15],"orange", this.sceneNode),
        new interactibleCircle(1,[1 + Math.floor(Math.random() * (width-2)),1 + Math.floor(Math.random() * (height-2)) ,0.15],"orange", this.sceneNode),
        new interactibleCircle(1,[1 + Math.floor(Math.random() * (width-2)),1 + Math.floor(Math.random() * (height-2)) ,0.15],"orange", this.sceneNode),
        ];
        //console.log(this.orangecircles)
        this.greencircle = new interactibleCircle(1,[1 + Math.floor(Math.random() * (width-2)),1 + Math.floor(Math.random() * (height-2)) ,0.15],"green", this.sceneNode)
        
        this.purplecircle = new interactibleCircle(1,[1 + Math.floor(Math.random() * (width-2)),1 + Math.floor(Math.random() * (height-2)) ,0.15],"purple", this.sceneNode)
        

        this.objectsToBeUpdated = objectsToBeUpdated;
        let Table = this;
        objectsToBeUpdated.forEach(function(obstacle) {
            Table.sceneNode.add(obstacle.node);
        })
    }

    /* update atualiza o estado interno dos objetos do nível.
     * Deve ser chamado antes de cada redraw enquanto somos o nível corrente.
     */
    update(time) {
        this.objectsToBeUpdated.forEach(function(obstacle) {
            obstacle.update(time);
        })
    }
}
class interactibleCircle{
    constructor(radius, position, color, scene){
        this.radius = radius
        this.position = position;
        this.color = color;
        this.scene = scene;

        this.mesh =  new THREE.Mesh(new THREE.CircleBufferGeometry(radius,32), new THREE.MeshStandardMaterial({color: this.color}));
        this.mesh.position.set(...position);
        this.scene.add(this.mesh);

        this.mesh.geometry.computeBoundingBox();
        this.meshbb = this.mesh.geometry.boundingBox.clone();
        this.mesh.updateMatrixWorld(true);
        this.meshbb.copy( this.mesh.geometry.boundingBox ).applyMatrix4(this.mesh.matrixWorld );

               
    }

}

class LeftFlipper {
    constructor(orbitCenter, orbitRadius, color) {
        this.speed = 10;

        this.mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(2.6,0.5,0.5), new THREE.MeshStandardMaterial({color: color}));
        this.mesh.position.x = 1.5;

        this.orbitCenterNode = new THREE.Group();
        this.orbitCenterNode.position.set(...orbitCenter);
        this.orbitCenterNode.add(this.mesh);

        this.node = this.orbitCenterNode;
        this.rotation = -Math.PI/6
        this.lastframetime = 0
        this.mesh.geometry.computeBoundingBox();
        this.boundingBox = this.mesh.geometry.boundingBox.clone();
        this.lastBoundingBoxColision = 0
    }

    update(time) {
        let deltatime = time - this.lastframetime;
        //console.log(deltatime)
        this.lastframetime = time
        if(isPressingLeft){
            this.rotation = this.rotation + deltatime * this.speed;
            //console.log(this.rotation);
            if(this.rotation > Math.PI/4){
                this.rotation = Math.PI/4;
            }
        }
        else{
            this.rotation = this.rotation - (deltatime * this.speed);
            if(this.rotation < -Math.PI/6){
                this.rotation = -Math.PI/6;
            }   
        }
        this.orbitCenterNode.updateMatrixWorld(true);
        this.orbitCenterNode.rotation.z = this.rotation
        this.mesh.updateMatrixWorld( true );

        playerSphere.updateMatrixWorld( true );
        playerSphereBoundingBox.copy( playerSphere.geometry.boundingBox ).applyMatrix4( playerSphere.matrixWorld );
            

        this.boundingBox.copy( this.mesh.geometry.boundingBox).applyMatrix4( this.mesh.matrixWorld );
        //console.log(playerSphereBoundingBox, this.boundingBox);
        if(this.boundingBox.intersectsBox(playerSphereBoundingBox) &&  time - this.lastBoundingBoxColision > 0.3 ){
            yVelocity = -yVelocity*1.2;
            xVelocity = xVelocity*1.2
            this.lastBoundingBoxColision = time;
            console.log("bateu em um flipper esquerdo")
        }
        //console.log(this.orbitCenterNode.children[0])
        //console.log(this.lastBoundingBoxColision, time)
    }
}

class RightFlipper {
    constructor(orbitCenter, orbitRadius, color) {
        this.speed = 10;

        this.mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(2.6,0.5,0.5), new THREE.MeshStandardMaterial({color: color}));
        this.mesh.position.x = -1.5;

        this.orbitCenterNode = new THREE.Group();
        this.orbitCenterNode.position.set(...orbitCenter);
        this.orbitCenterNode.add(this.mesh);

        this.node = this.orbitCenterNode;
        this.rotation = Math.PI/6
        this.lastframetime = 0
        this.mesh.geometry.computeBoundingBox();
        this.boundingBox = this.mesh.geometry.boundingBox.clone();
        this.lastBoundingBoxColision = 0
    }

    update(time) {
        let deltatime = time - this.lastframetime;
        //console.log(deltatime)
        this.lastframetime = time
        if(isPressingRight){
            this.rotation = this.rotation - deltatime * this.speed;
            //console.log(this.rotation);
            if(this.rotation < -Math.PI/4){
                this.rotation = -Math.PI/4;
            }
        }
        else{
            this.rotation = this.rotation + (deltatime * this.speed);
            if(this.rotation > Math.PI/6){
                this.rotation = Math.PI/6;
            }   
        }
        this.orbitCenterNode.updateMatrixWorld(true);
        this.orbitCenterNode.rotation.z = this.rotation
        this.mesh.updateMatrixWorld( true );

        playerSphere.updateMatrixWorld( true );

        this.boundingBox.copy( this.mesh.geometry.boundingBox ).applyMatrix4( this.mesh.matrixWorld );

        if(this.boundingBox.intersectsBox(playerSphereBoundingBox) && time - this.lastBoundingBoxColision > 0.3 ){
            yVelocity = -yVelocity*1.2;
            xVelocity = xVelocity*1.2
            this.lastBoundingBoxColision = time;
            console.log("bateu em um flipper direito")
        }
    }
}

let tables = [
    new Table(
        [19.25, 1, 0.5],
        20,
        30,
        30,
        "white",
        "black",
        [
            new LeftFlipper( [7-.5, 3, 0.5], 3, "yellow"),
            new LeftFlipper( [-0.1, 19, 0.5], 3, "yellow"),
            new RightFlipper( [14-.5, 3, 0.5], 3, "yellow")
        ],
        [9, 0.5, 0.5])
];

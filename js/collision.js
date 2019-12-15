function lookForCollision(sphere, obstacles) {
    
    for (let i = 0; i < obstacles.length; i++) {
        if (sphere.position.distanceTo(obstacles[i].mesh.position) <= 1) {
            //console.log("bam!");
            return true;
        }
    }
    
    return false;
}

function lookForDeathCollision(sphere, deathZone) {
    if (sphere.position.x <= (deathZone.position.x + deathZone.scale.x/2) 
        && sphere.position.x >= (deathZone.position.x - deathZone.scale.x/2)
        && sphere.position.y <= (deathZone.position.y + deathZone.scale.y/2)
        && sphere.position.y >= (deathZone.position.y - deathZone.scale.y/2)
        ){
            return true;
    }
    //console.log(sphere.position, deathZone.position)
    return false;
}

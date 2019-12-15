let isPressingLeft = false;
let isPressingRight = false;
let isPressingEnter = false;
window.addEventListener("keydown", function (event) {
  if (event.defaultPrevented) {
    return; // Do nothing if the event was already processed
  }

  switch (event.key) {
    case "ArrowLeft":
          if (!isPressingLeft){
              document.getElementById('click1').play();
          }
          isPressingLeft = true;
          
          break;
    case "ArrowRight":
          if (!isPressingRight){
              document.getElementById('click2').play();
          }
          isPressingRight = true;
          
          break;
    case "Enter":
          isPressingEnter = true;
          break;
    default:
      return;
  }

  event.preventDefault();
}, true);


window.addEventListener("keyup", function (event) {
  if (event.defaultPrevented) {
    return; // Do nothing if the event was already processed
  }

  switch (event.key) {
    case "ArrowLeft":
          isPressingLeft = false;
          break;
    case "ArrowRight":
          isPressingRight = false;
          break;
    case "Enter":
          isPressingEnter = false;
          break;
    default:
      return;
  }
  event.preventDefault();
}, true);


function updateSpherePosition(sphere, deltaTime, currentTable) {
    levelHeight = currentTable.height;
    levelWidth = currentTable.width;
    if(isPressingEnter &&  currentTable.playerHasStarted == 0) {
        console.log("begin!");
        currentTable.playerHasStarted = 1 ;
        yVelocity = 30;
        document.getElementById('sfxlaunch').play();
        document.getElementById('soundtrack').play();

    }
  }
  


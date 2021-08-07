// getting canvas id and saying the canvas is 2d
const canvas = document.getElementById("snakeGame");
const gameContext = canvas.getContext("2d");

// gamestart false to show menu
let gameStart = false;
// set speed, tilecount, canvas size and tilesize
let gameSpeed = 8;
let tileCount = 20;
let tileBlockSize = canvas.width / tileCount;
let tileSize = tileBlockSize - 2;

// head of snake
headX = 10;
headY = 10;
// snake head and body parts stored here
const snakeComponents = [];
// default snake tail length
let snakeTailLength = 2;

// default velocity of snake (still)
let velocityX = 0;
let velocityY = 0;

// default spawn of the obstacle to eat
let obstacleX = 5;
let obstacleY = 5;

// initializing score
let score = 0;

// initialize local storage
const localStorage = window.localStorage;
// getting the item "score" from local storage
const endScore = localStorage.getItem("score");
// if score is empty set to 0
if (!endScore) {
  localStorage.setItem("score", 0);
}

// the snake constructor
class snake {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

// gamepad connection and debugging
window.addEventListener("gamepadconnected", function (e) {
  // get all gamepads in index (index goes from 0-3)
  var gp = navigator.getGamepads()[e.gamepad.index];
  console.log(
    // logs where gamepad is connected, and some extra information
    "Gamepad connected at index %d: %s. %d buttons, %d axes.",
    gp.index,
    gp.id,
    gp.buttons.length,
    gp.axes.length
  );
  console.log(navigator.getGamepads());
});

// game loop, this happens X times a second.
function drawGame() {
  //function that links head movement to velocity
  changeSnakePosition();
//checking if gameover true   
  let result = isGameOver();
  if (result == true) {
    // if it is true, clear the screen, add score to local storage and reload the document
    clearScreen();
    localStorage.setItem("score", score);
    document.location.reload();
    return;
  }
//if gamestart is false, draw the main menu, and initialize gamepad input intake  
  if (gameStart == false) {
    drawMenu();
    updateGamePad();
  } else {
    //if gameStart is true, clear the screen to get rid of menu
    clearScreen();
    // function to see if obstacle has collided with snake head
    obstacleCollision();
    // function to draw the obstacle
    drawObstacle();
// function to draw snake
    drawSnake();
//  function to update gamepad input
    updateGamePad();
//  function to update and output score
    outputScore();
  }
//   if score higher than X, make snake go faster by increasing gamespeed
  if (score > 10) {
    gameSpeed = 12;
  }
  if (score > 20) {
    gamespeed = 14;
  }
  if (score > 30) {
    gameSpeed = 16;
  }
  // updates the screen X times a second as default (using gameSpeed variable)
  setTimeout(drawGame, 1000 / gameSpeed);
}

// change the snake position by adding velocity to the head
function changeSnakePosition() {
  headX = headX + velocityX;
  headY = headY + velocityY;
}

function isGameOver() {
  let gameOver = false;
  // check to see if game  has started by looking at velocity
  if (velocityX == 0 && velocityY == 0) {
    return false;
  }

  // if head of snake hits any edges
  if (headX < 0 || headX == tileCount || headY < 0 || headY == tileCount) {
    gameOver = true;
  }

  // if snake hits itself
  for (let i = 0; i < snakeComponents.length; i++) {
    let part = snakeComponents[i];
    if (part.x === headX && part.y === headY) {
      gameOver = true;
      break;
    }
  }
  return gameOver;
}


function outputScore() {
  gameContext.fillStyle = "white";
  gameContext.font = "20px courier new";
//adds the variable score, to the text in the corner of the screen   
  gameContext.fillText("Score: " + score, canvas.width - 150, 20);
}

// clear screen to default black
function clearScreen() {
  gameContext.fillStyle = "black";
  gameContext.fillRect(0, 0, canvas.width, canvas.height);
}

// checking collision of head to obstacle along with spawning another one once hit
function obstacleCollision() {
  if (obstacleX === headX && obstacleY === headY) {
    //   if obstacle X/Y are the same as head X/Y, move the obstacle someone where random
        obstacleX = Math.floor(Math.random() * tileCount);
        obstacleY = Math.floor(Math.random() * tileCount);
        // add 1 to the snake tail length and also 1 to score
    snakeTailLength += 1;
    score += 1;
}
}

// drawing the obstacle to the screen
function drawObstacle() {
  gameContext.fillStyle = "red";
  gameContext.fillRect(
    obstacleX * tileBlockSize,
    obstacleY * tileBlockSize,
    tileSize,
    tileSize
  );
}

// drawing the snake body on the screen
function drawSnake() {
  gameContext.fillStyle = "green";

//   adds an extra square for each component in the array
  for (let i = 0; i < snakeComponents.length; i++) {
    let part = snakeComponents[i];
    gameContext.fillRect(
      part.x * tileBlockSize,
      part.y * tileBlockSize,
      tileSize,
      tileSize
    );
  }

  // adds new snake component to where the head used to be, instead of where the head is, making use of the snake constructor.
  snakeComponents.push(new snake(headX, headY));
  if (snakeComponents.length > snakeTailLength) {
    snakeComponents.shift();
  }

  gameContext.fillStyle = "orange";
  gameContext.fillRect(
    headX * tileBlockSize,
    headY * tileBlockSize,
    tileSize,
    tileSize
  );
}


// mousetrap library
// binding the directional buttons to a function that starts the game, and checks attributes
Mousetrap.bind("up", function () {
  gameStart = true;
//   if the velocity is already making the snake go up, do not allow the snake to go back
  if (velocityY == 1) return;
  velocityX = 0;
  velocityY = -1;
});

Mousetrap.bind("down", function () {
    // if velocity lets snake go down, do not let snake go up
  gameStart = true;
  if (velocityY == -1) return;
  velocityX = 0;
  velocityY = 1;
});

Mousetrap.bind("left", function () {
    // if snake is going left, do not let it go right
  gameStart = true;
  if (velocityX == 1) return;
  velocityX = -1;
  velocityY = 0;
});

Mousetrap.bind("right", function () {
    // if snake is going right, do not let snake go left
  gameStart = true;
  if (velocityX == -1) return;
  velocityX = 1;
  velocityY = 0;
});

// gamepad function to take input
function updateGamePad() {
    // tells browser you are going to do an animation so it wants to call update gamepad
  requestAnimationFrame(updateGamePad);
//   loop through the array of gamepads (0-3) so that you can play the game with any of the connected gamepads, no matter which array number they are at
  for (i = 0; i < navigator.getGamepads().length; i++) {
    const gamepad = navigator.getGamepads()[i];
    if (!gamepad) return;

    // button 12 is up on 'dpad'
    if (gamepad.buttons[12].pressed) {
      gameStart = true;
      if (velocityY == 1) return;
      velocityX = 0;
      velocityY = -1;
    }
    // 13 is down 
    if (gamepad.buttons[13].pressed) {
      gameStart = true;
      if (velocityY == -1) return;
      velocityX = 0;
      velocityY = 1;
    }
    // 14 is left
    if (gamepad.buttons[14].pressed) {
      gameStart = true;
      if (velocityX == 1) return;
      velocityX = -1;
      velocityY = 0;
    }
    // 15 is right
    if (gamepad.buttons[15].pressed) {
      gameStart = true;
      if (velocityX == -1) return;
      velocityX = 1;
      velocityY = 0;
    }
  }
}

// main menu
function drawMenu() {
  gameContext.fillStyle = "black";
  gameContext.fillRect(0, 0, canvas.width, canvas.height);
  gameContext.fillStyle = "yellow";
  gameContext.font = "20px bold courier new";
  gameContext.fillText(
    "Hit a directional button on your controller/ keyboard to start!",
    canvas.width / 12,
    canvas.height / 2.5
  );
  gameContext.fillStyle = "green";
  gameContext.font = "30px bold courier new";
  gameContext.fillText(
    "Prior Score: " + endScore,
    canvas.width / 3,
    canvas.height / 3
  );
}

drawGame();

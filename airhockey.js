document.addEventListener("DOMContentLoaded", createGame);

// issue with conversion from cartesan <-> polar coordinates

let table;
let tableContext;
let tableWidth;
let tableHeight;
let tableCenterX;
let ableCenterY;
let controllers = [];
let goal;
let goalHeight;
let goalPosTop;
let score = [];

let controller;
let controllerTwo;
let puck;

// function postLoad() {
//     play();
//     // messageBoard = document.querySelector(".message-board");
//     // let startButton = document.querySelector(".start");

//     // startButton.addEventListener("click", startGame)
//     startGame();
// }

// function startGame(){
//     // event.preventDefault();
//     // messageBoard.style.visibility = "hidden";

//     context = document.querySelector("#canvas").getContext('2d')

function createVaribles(){
    table = document.getElementById("canvas");
    tableContext = table.getContext('2d');
    tableWidth = 30;
    tableHeight = 60;
    tableCenterX = tableWidth / 2;
    tableCenterY = tableHeight / 2;
    goal = document.getElementsByClassName('goal-crease');
    goalWidth = goal[0].clientTop * 2;
    goalPosRight = (tableWidth - goalWidth) / 2;

    table.width = tableWidth;
    table.height = tableHeight;

    table.focus();
}

function Mallet(){
    this.startingPosX = tableCenterX;
    this.startingPosY = tableCenterY;
    this.x = this.startingPosX;
    this.y = this.startingPosY;
    this.radius = 3;
    this.mass = 50;
    this.velocityX = 0;
    this.velocityY = 0;
    this.maxSpeed = 5;
    this.frictionX = 0.997;
    this.frictionY = 0.997;
    this.acceleration = 1;
    this.color = '#000000';

    this.containController = keepControllerInTable
    this.draw = drawMallet;
    this.move = moveMallet;
    this.keepPuckInTable = puckyPuck;

    this.malletCollision = hit;
}

function drawMallet(){
    tableContext.shadowColor = 'rgba(50, 50, 50, 0.25)';
        tableContext.shadowOffsetX = 0;
        tableContext.shadowOffsetY = 1;
        tableContext.shadowBlur = .5;
    
        tableContext.beginPath();
        tableContext.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
        tableContext.fillStyle = this.color;
        tableContext.fill();
}

function moveMallet(){
    this.velocityX *= this.frictionX;
    this.velocityY *= this.frictionY;

    this.x += this.velocityX;
    this.y += this.velocityY;
}

function keepControllerInTable(){
    if (this.x > (tableWidth - this.radius) || this.x < this.radius) {
        if (this.x < this.radius) {
                  this.velocityX = 1;
            } else {
                    this.velocityX = -1;
            }
    };
    if (this.y > (tableHeight - this.radius) || this.y < this.radius) {
            if (this.y < this.radius) {
                  this.velocityY = 1;
            } else {
                    this.velocityY = -1;
            }
    };
    if (controller.y > (tableCenterY - controller.radius) && controller.y < tableCenterY) {
            controller.velocityY = -2;
    };
    if (controllerTwo.y < tableCenterY && controllerTwo.y > (tableCenterY - (controllerTwo.radius / 2))) {
        controllerTwo.velocityY = +2;
    };
}

function puckyPuck() {
    if (this.x > (tableWidth - this.radius) || this.x < this.radius) {

        if (this.x > (tableWidth - this.radius)) {
                this.x = tableWidth - this.radius;
        } else {
                this.x = this.radius;
        }
        this.velocityX = -this.velocityX;
    }

    if (this.y > (tableHeight - this.radius) || this.y < this.radius) {

        if (this.y > (tableHeight - this.radius)) {
                this.y = tableHeight - this.radius;
        } else {
                this.y = this.radius;
        }
            
        if (this.x > (goalPosRight + puck.radius) && this.x < (goalPosRight + goalWidth) - puck.radius) {
            puck = new Mallet(tableCenterX, tableCenterY);
            console.log("scored")
        } else {
            this.velocityY = -this.velocityY;
        }
    }
}

function hit() {
    // Loop over two controllers to see if puck has come in contact
    for (var i = 0; i < controllers.length; i++) {
            
        // Minus the x pos of one disc from the x pos of the other disc
        var distanceX = this.x - controllers[i].x;
                // Minus the y pos of one disc from the y pos of the other disc
        var distanceY = this.y - controllers[i].y;
                // Multiply each of the distances by this
                // Squareroot that number, which gives you the distance between the two disc's
        var distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
                // Add the two disc radius together
        var addedRadius = this.radius + controllers[i].radius;

        // Check to see if the distance between the two circles is smaller than the added radius
        // If it is then we know the circles are overlapping								
        if (distance < addedRadius) {
                
                // Had help from Reddit user Kraft_Punk on the below collision math
            
                //calculate angle, sine, and cosine
                var angle = Math.atan2(distanceY, distanceX);
                var sin = Math.sin(angle);
                var cos = Math.cos(angle);
                        //rotate controllers[i]'s position
                var pos0 = {
                                x: 0,
                                y: 0
                        };
                        //rotate this's position
                var pos1 = rotate(distanceX, distanceY, sin, cos, true);
                        //rotate controllers[i]'s velocity
                var vel0 = rotate(controllers[i].velocityX, controllers[i].velocityY, sin, cos, true);
                        //rotate this's velocity
                var vel1 = rotate(this.velocityX, this.velocityY, sin, cos, true);
                        //collision reaction
                var velocityXTotal = vel0.x - vel1.x;

                vel0.x = ((controllers[i].mass - this.mass) * vel0.x + 2 * this.mass * vel1.x) /
                        (controllers[i].mass + this.mass);
                vel1.x = velocityXTotal + vel0.x;

                //update position - to avoid objects becoming stuck together
                var absV = Math.abs(vel0.x) + Math.abs(vel1.x),
                        overlap = (controllers[i].radius + this.radius) - Math.abs(pos0.x - pos1.x);

                pos0.x += vel0.x / absV * overlap;
                pos1.x += vel1.x / absV * overlap;

                //rotate positions back
                var pos0F = rotate(pos0.x, pos0.y, sin, cos, false),
                        pos1F = rotate(pos1.x, pos1.y, sin, cos, false);

                //adjust positions to actual screen positions
                this.x = controllers[i].x + pos1F.x;
                this.y = controllers[i].y + pos1F.y;
                controllers[i].x = controllers[i].x + pos0F.x;
                controllers[i].y = controllers[i].y + pos0F.y;

                //rotate velocities back
                var vel0F = rotate(vel0.x, vel0.y, sin, cos, false),
                        vel1F = rotate(vel1.x, vel1.y, sin, cos, false);

                controllers[i].velocityX = vel0F.x;
                controllers[i].velocityY = vel0F.y;

                this.velocityX = vel1F.x;
                this.velocityY = vel1F.y;

        }
    }
}

function createPlayers(){
    puck = new Mallet();

    controller = new Mallet();
    controller.color = 'rgb(127, 33, 204)';
    controller.radius += 2;
    controller.acceleration = 0.2;
    controller.startingPosY = 5;
    controller.mass = 50;
    controller.y = controller.startingPosY;

    controllerTwo = new Mallet();
    controllerTwo.color = 'rgb(33, 204, 119)';
    controllerTwo.radius += 2;
    controllerTwo.mass = 50;
    controllerTwo.startingPosY = (tableHeight - 5);
    controllerTwo.acceleration = 0.2;
    controllerTwo.y = controllerTwo.startingPosY;

    controllers.push(controller, controllerTwo);
}

function createGame(){
    createVaribles();
    createPlayers();
    playGame();
} 

function playGame(){

    tableContext.clearRect(0, 0, tableWidth, tableHeight);

    puck.draw();
    puck.move();
	puck.malletCollision();
    puck.keepPuckInTable();
        
		// Controllers
    controller.draw();
    controller.move();
    controller.containController();
    
    controllerTwo.draw();
		// controllerTwo.computerPlayer();
    controllerTwo.move();
	controllerTwo.containController();

    requestAnimationFrame(playGame);
}

document.addEventListener("keydown", function(e) {
    moveController(e.keyCode);
});

function moveController(key) {
    if (key === 38 && controller.velocityY < controller.maxSpeed) {
            controller.velocityY -= controller.acceleration;
    }
    if (key === 40 && controller.velocityY < controller.maxSpeed) {
            controller.velocityY += controller.acceleration;
    }
    if (key === 39 && controller.velocityX < controller.maxSpeed) {
            controller.velocityX += controller.acceleration;
    }
    if (key === 37 && controller.acceleration < controller.maxSpeed) {
            controller.velocityX -= controller.acceleration;
    }
}

function rotate(x, y, sin, cos, reverse) {
    return {
            x: (reverse) ? (x * cos + y * sin) : (x * cos - y * sin),
            y: (reverse) ? (y * cos - x * sin) : (y * cos + x * sin)
    };
}
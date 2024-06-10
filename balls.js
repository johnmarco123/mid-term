// empty the balls array, and remove each of those balls from the world
function destroyAllBalls() {
    while(balls.length > 0) {
        removeFromWorld(balls.pop());
    }
}

// resets the gamemode and initializes all balls off the snooker table
function setupBalls() {
    score = 0;
    // any portals from previous rounds get destroyed before we setup the balls
    destroyAllPortals(); 
    // any balls from previous rounds get destroyed before we setup new balls
    destroyAllBalls();
    // first we set up the 15 red balls
    let x = -500;
    let y = -500;
    for (let i = 0; i < 15; i++) {
        setupBall(x + (i * 30), y, BALLDIAMETER, color(255, 0, 0), "red", 1);
    }
    
    // then we set up the colored balls
    setupBall(-1000, y, BALLDIAMETER, color(0), "color", 7);// the black ball
    setupBall(-1030, y, BALLDIAMETER, color(255, 182, 193), "color", 6);// the pink ball
    setupBall(-1060, y, BALLDIAMETER, color(0, 0, 255), "color", 5); // the blue ball
    setupBall(-1090, y, BALLDIAMETER, color(42, 88, 72), "color", 3); // the green ball
    setupBall(-1020, y, BALLDIAMETER, color(200, 200, 0), "color", 2); // the yellow ball
    setupBall(-1050, y, BALLDIAMETER, color(160, 82, 45), "color", 4); // the brown ball

}

// places a ball in a random valid position
function placeBallRandomly(ballIdx) {
    let x, y;
    let validSpot = false;
    // ALGORITHM:
    // 1.) Try to place a ball at a random x, y coordinate
    // 2.) If there is a ball that is closer then the radius of both balls
    // added together (or the diameter of one ball since they have the same
    // radius) then try step one again
    // 3.) Otherwise, we place the ball there
    //
    //      VALID PLACEMENT AREA
    //
    // (50, 50)=============(850, 50)
    //    || o   |    o       o ||
    //    ||    -|              ||
    //    ||   / |              ||
    //    ||  |  |              ||
    //    ||   \ |              ||
    //    ||    -|              ||
    //    || o   |    o       o ||
    // (50, 400)=============(850, 400)
    //
    //
    while (!validSpot) {
        x = random(50, 850);
        y = random(50, 400);
        validSpot = balls.every(ball => dist(ball.position.x, ball.position.y, x, y) > BALLDIAMETER);
        if (validSpot) {
            Body.setPosition(balls[ballIdx], {x: x, y: y});
            break;
        }
    }
}


// we draw each ball in the ball array with their respective color 
function drawBalls() {
    for (const ball of balls) {
        fill(ball.color);
        drawVertices(ball.vertices);
    }
}

// initializes a ball with the given parameters,
// ensure that colorValue is an array of the following format:
// [0-255, 0-255, 0-255]
function setupBall(x, y, diameter, color, colorName, colorValue) {
    const options = {
        friction: 0.8,
        restitution: 0.8,
        label:colorName,
    }
    const radius = diameter / 2
    const ball = Bodies.circle(x, y , radius, options);
    ball.value = colorValue;
    ball.color = color;
    balls.push(ball);
    World.add(engine.world, [ball]);
    return ball;
}

// In snooker there are ways to foul which means we do not allow the user to
// score points. If a foul occurs, this function returns true and sets the
// variable messageBeingDisplayed to an error message to show the user
function checkIfBallCausesFoul(ball) {
    if (lastPocketedBall === null) {
        // if the first pocketed ball is not red
        if (ball.label != "red") {
            messageBeingDisplayed = "Your first pocketed ball must be a red ball!";
            displayMessage();
            return true;
        }
        // if the user pockets two red balls in a row
    } else if (lastPocketedBall.label == "red") {
        if (ball.label == "red") {
            messageBeingDisplayed = 'You must pocket a colored ball after you pocket a red ball!';
            displayMessage();
            return true;
        }
        // if the user pockets two colored balls in a row
    } else if (lastPocketedBall.label == "color") {
        if (ball.label != "red") {
            messageBeingDisplayed = 'You must pocket a red ball after you pocket a colored ball!';
            displayMessage();
            return true;
        }
    }
    // if no fouls occur, we return false to indicate that the shot was legal
    return false;
}

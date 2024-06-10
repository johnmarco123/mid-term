let {
    Composite,
    Engine,
    Render,
    World,
    Bodies,
    Body,
    Constraint,
    Mouse,
    MouseConstraint,
    Events
} = Matter;

let canvas;
let engine = Engine.create();  // create an engine
// We set our table object, which is responsible for the table pockets,
// and the table cushions
let table = {
    x: 0,
    y: 0,
    width: 900,
    height: 450,
    pockets: [],
    cushions: [],
};
// as stated in the assignment, "ball diameter = table width / 36"
const BALLDIAMETER = table.width / 36;
let score = 0; // the score for each snooker game that gets shown to the user

let balls = []; // the snooker balls get stored here

// any balls that have been pocketed whilst the cue ball is still in movement
// get temporarily stored here. Once the cue ball stops moving, we place the
// pocketed Color balls back in their specific starting position
let pocketedColorBalls = []; 

// the last pocketed ball get stored here, this is used to detect when the
// user commits a foul by pocketing two red balls in a row, or two color balls
// in a row, or pocketing a color ball as their first ball.
let lastPocketedBall = null;

// here we store the portal bodies used for game mode 4
let portals = [];
// the time that it takes for the portals to flicker their color
let portalColorChangeSpeed = 2;
// this number must be between 100 and 255, this is the initial opacity of
// all portals
let portalColors = 100;

// the cue body, cue Ball body and dZone location
let cue, cueBall, dZone;
// the bool that controls whether or not the cue Ball is currently being placed
// in the d zone
let cueBallBeingPlacedInDZone = true;
// the angle used to determine how to rotate the cue around the cue ball
let angle = 0;
// when set to true, all non Cue balls are static (unable to be moved)
let allBallsAreStatic = false;

// whether or not the user has the space bar currently down
let spaceBarIsDown = false

// the message currently being displayed to the user (undefined if none)
let messageBeingDisplayed = undefined;
function setup() {
    canvas = createCanvas(900, 600);

    engine.world.gravity.y = 0; // shut off gravity

    // here we setup all bodies needed
    setupTable();
    setupCueBall(170, 220, BALLDIAMETER);
    setupBalls();
    setupCue();
    setupDZone();
}
////////////////////////////////////////////////////////////
function draw() {
    background(0);
    Engine.update(engine);

    // We draw each body here in the draw loop
    drawTable();
    drawCueBall();
    drawBalls();
    drawPortals();
    drawScore();
    drawGameInformation();
    // if the cue ball is not being placed in the Dzone, we allow the cue to
    // be drawn, this also allows shooting of the cue ball.
    if (!cueBallBeingPlacedInDZone) {
        drawCue();
    } else {
        // otherwise, we force the user to place the cue ball 
        setCueBallInDZone();
    }

    // only when we give a value to messageBeingDisplayed do we actually show
    // the user a message
    if (messageBeingDisplayed !== undefined) {
        displayMessage();
    }
}

function keyPressed() {
    switch(keyCode) {
        case 49: // number 1
            ballPosition1(); 
            break;
        case 50: // number 2
            ballPosition2();
            break;
        case 51: // number 3
            ballPosition3();
            break;
        case 52: // number 4
            ballPosition4();
            break;
    }
    // if the user clicks space bar and the cue Ball is not moving, we register
    // that the space bar is being pressed
    // HANDLE THIS CODE WITH CAUTION! IF WE ALLOW SPACEBAR TO BE PRESSED WHEN
    // THE BALL IS MOVING THE USER CAN HIT THE BALL MULTIPLE TIMES BEFORE THE
    // BALL STOPS MOVING!
    if (keyCode == 32 && !cueBall.isMoving) {
        spaceBarIsDown = true;
    }
}

function keyReleased() {
    if (keyCode == 32) { // when spacebar is released we shoot the cue ball
        shootCueBall();
        spaceBarIsDown = false;
        // now that we shot the cue ball, the cue ball is now in motion
        cueBall.isMoving = true; 
    }
}

// removes the body passed to the function from the world
function removeFromWorld(body) {
    World.remove(engine.world, body);
}

// draws the vertices of a body, typically used like so:
// drawVertices(mario.vertices)
// if mario was a body, this would draw marios vertices.
function drawVertices(vertices) {
    beginShape();
    for (var i = 0; i < vertices.length; i++) {
        vertex(vertices[i].x, vertices[i].y);
    }
    endShape(CLOSE);
}

// This code responsible for all collisions in the game
Events.on(engine, 'collisionStart', function(event) {
    // when a collision occurs we recieve the collider with event.pairs
    let pairs = event.pairs;

    pairs.forEach(function(pair) {
        let {bodyA, bodyB} = pair; // the BODY of each collider
        // the label we assigned to each body
        let a = bodyA.label 
        let b = bodyB.label

        // log any time the cue ball hits anything
        if (a == "cue" || b == "cue") {
            console.log("cue-" + (a == "cue" ? b : a));
            // if we pocket the cue ball, we allow the user to choose
            // its position in the d zone
            if (collided(a, b, "cue", "pocket")) {
                // as long as we are moving the cue ball,
                // no other ball should be moveable
                cueBallBeingPlacedInDZone = true;
            }

            // a collision occured between a red ball and the pocket,
        } else if (collided(a, b, "red", "pocket")) {
            for (let i = 0; i < balls.length; i++) {
                if (balls[i] == bodyA || balls[i] == bodyB) {
                    const ballCausedFoul = checkIfBallCausesFoul(balls[i]);
                    if (ballCausedFoul) {
                        // we don't count a point if a foul was caused
                    } else {
                        // if the user pocketed the red ball without a foul, we
                        // give them a point
                        score += balls[i].value;
                    }
                    // we save the last pocketed ball, so we can check for
                    // fouls later on
                    lastPocketedBall = balls[i];
                    balls.splice(i, 1); // remove the ball from the balls array
                    break;
                }
            }
            // a collision occured between a colored ball and the pocket
        } else if (collided(a, b, "color", "pocket")) {
            for (const ball of balls) {
                const body = (bodyA == ball) ? bodyA : bodyB == ball ? bodyB : null;
                if (body !== null) {
                    const ballCausedFoul = checkIfBallCausesFoul(body);
                    if (ballCausedFoul) {
                        // we don't count a point if the shot caused a foul
                    } else {
                        // if the shot did not cause a foul, we add points to
                        // the score based on the colored balls value
                        score += body.value;
                    }
                    lastPocketedBall = body;
                    pocketedColorBalls.push(body);
                    // we stop the velocity of the pocketed color ball and
                    // remove it from the board until the cue ball has stopped
                    // moving.
                    Body.setPosition(body, {x: -1000, y: -1000});
                    Body.setVelocity(body, {x: 0, y: 0});
                }
            }

            // if any ball hits a portal it gets teleported to the "outLocation"
            // of its "linkedTo" portal
        }

        if (a == "portal" || b == "portal") {
            const nonPortal = (a == "portal") ? bodyB : bodyA;
            const portal = (a == "portal") ? bodyA : bodyB;
            Body.setPosition(nonPortal, portal.linkedTo.outLocation);
        }
    });
});

// we check if bodyA = optionA, or optionB, and that bodyB equals the one that
// bodyA is not
function collided(bodyA, bodyB, optionA, optionB) {
    return (bodyA == optionA && bodyB == optionB) || 
           (bodyA == optionB && bodyB == optionA);
}


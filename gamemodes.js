// gamemode 1 = regular snooker
function ballPosition1() {
    // destroy and respawn all bodies required for setting ball position
    setupBalls(); 
    // since we repositioned the balls, we are now placing the cue ball in the
    // d zone
    cueBallBeingPlacedInDZone = true; 
    // here we manually position each ball in the correct snooker position
    // THE FIFTEEN RED BALLS
    Body.setPosition(balls[0], {x: 600, y: 220});

    Body.setPosition(balls[1], {x: 623, y: 207});
    Body.setPosition(balls[2], {x: 623, y: 233});

    Body.setPosition(balls[3], {x: 646, y: 220});
    Body.setPosition(balls[4], {x: 646, y: 195});
    Body.setPosition(balls[5], {x: 646, y: 245});

    Body.setPosition(balls[6], {x: 669, y: 208});
    Body.setPosition(balls[7], {x: 669, y: 183});
    Body.setPosition(balls[8], {x: 669, y: 233});
    Body.setPosition(balls[9], {x: 669, y: 260});

    Body.setPosition(balls[10], {x: 692, y: 172});
    Body.setPosition(balls[11], {x: 692, y: 197});
    Body.setPosition(balls[12], {x: 692, y: 222});
    Body.setPosition(balls[13], {x: 692, y: 247});
    Body.setPosition(balls[14], {x: 692, y: 273});

    // THE COLOR BALLS. We also set their start position, so when they are
    // pocketed we can return them to their corresponding position
    const black = {x: 800, y: 220}
    Body.setPosition(balls[15], black);
    balls[15].startPosition = black;

    const pink = {x: 570, y: 220}
    Body.setPosition(balls[16], pink);
    balls[16].startPosition = pink;

    const blue = {x: 450, y: 220}
    Body.setPosition(balls[17], blue);
    balls[17].startPosition = blue;

    const green = {x: 200, y: 145}
    Body.setPosition(balls[18], green);
    balls[18].startPosition = green;

    const yellow = {x: 200, y: 295}
    Body.setPosition(balls[19], yellow);
    balls[19].startPosition = yellow;

    const brown = {x: 200, y: 220}
    Body.setPosition(balls[20], brown);
    balls[20].startPosition = brown;
}

// gamemode 2 = random red ball positions
function ballPosition2() {
    ballPosition1(); // first we move all the balls to their correct spot
    // then we randomize red ball location
    for (let i = 0; i < 15; i++) {
        // first we move all red balls off the pool table
        Body.setPosition(balls[i], {x: i * 100, y: -1000});
    }
    // then we place each ball in random valid locations on the board
    for (let i = 0; i < 15; i++) {
        placeBallRandomly(i)
    }
}

// gamemode 3 = random red ball and color ball positioning.
function ballPosition3() {
    // we randomize the red ball positioning
    ballPosition2();
    // we then randomize the other balls positioning
    for (let i = 15; i < balls.length; i++) {
        placeBallRandomly(i);
    }
}

// gamemode 4 = regular snooker with portal that teleport any ball that touches
// them!
function ballPosition4() {
    ballPosition1();
    setupPortals();
}

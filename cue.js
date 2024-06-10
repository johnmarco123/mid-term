// we initialize the cue
function setupCue() {
    cue = createVector(0, 0); // the cue's position
    cue.maxCharge = 40; // how strong of a shot we allow at max charge
    cue.chargeRate = 1; // how fast the cue charges
    cue.charge = 0; // the cue's current charge
}

// we draw the cue, and all cue animations.
function drawCue() {
    // how far away from the ball does the cue orbit
    let orbitRadius = BALLDIAMETER / 2; 

    cue.x = cueBall.position.x + orbitRadius * cos(angle)
    cue.y = cueBall.position.y + orbitRadius * sin(angle)

    // if the cue ball is not moving, then we can draw the cue
    if (!cueBall.isMoving) {
        let charge = cue.charge * 2;
        push();
        translate(cue.x, cue.y);
        rotate(angle + PI / 2); // rotate the cue so it faces the cue ball
        fill(139,69,19);
        noStroke();
        rectMode(CENTER);
        push();
        // the blue tip of the cue
        fill(0, 0, 255)
        ellipse(0, -8 - charge, 6);

        // the black end of the cue
        fill(0)
        ellipse(0, -310 - charge, 12);

        pop();
        // the pool cue shaft
        quad(-6, -310 - charge, 6, -310 - charge, 3, -10 - charge, -3, -10 - charge);
        push();
            //  the white part at the front of the cue
            fill(255);
            quad(-3, -20 - charge, 3, -20 - charge, 3, -10 - charge, -3, -10 - charge);

            // the lines indicating where the ball will go when shot
            fill(255, 255, 255, 100);
            for (let i = 0; i < 35; i++) {
                rect(0, 50 + (i * 30), 3, 15);
            }
        pop();
        pop();
        // if the space bar is being pressed, we play the cue charging animation
        if (spaceBarIsDown) {
            chargeCue();
        }
    }
    handleMovementOfCue();
}


// this function is what allows the cue to be moved with the arrow keys
function handleMovementOfCue() {
    // if the cue Ball is moving slow enough, we make it stop entely
    // by settings its velocity to zero
    if (cueBall.speed < 0.08) { 
        Body.setVelocity(cueBall, {x: 0, y: 0});
        // any colored balls that were pocketed get placed in their designated
        // starting position when the cue ball stops moving
        for (const ball of pocketedColorBalls) {
            Body.setPosition(ball, ball.startPosition);
        }
        cueBall.isMoving = false;
    }

    if (keyIsDown(LEFT_ARROW)) {
        angle+=0.02;
    }

    if (keyIsDown(RIGHT_ARROW)) {
        angle-=0.02;
    }
}

// we charge the alternating between maxCharge and 0
function chargeCue() {
    cue.charge += cue.chargeRate;
    if (cue.charge > cue.maxCharge || cue.charge <= 0) {
        cue.chargeRate *= -1;
    }
}

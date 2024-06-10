// initialization of the cue ball
function setupCueBall(x, y, diameter) {
    const options = { frictionAir: 0.01, restitution: 0.8, friction: 0.5, label: 'cue'};
    cueBall = Bodies.circle(x, y, diameter/2, options);
    World.add(engine.world, [cueBall]);
}

// we draw the cue ball
function drawCueBall() {
    fill(255);
    drawVertices(cueBall.vertices);
    resetCueBallIfOutOfBounds();
}

// if the cue ball ever flies out of bounds somehow, it will be considered the
// same as if it was pocketed, and we will allow the user to place it in the d
// zone
function resetCueBallIfOutOfBounds() {
    if (cueBall.position.x < 0 || cueBall.position.x > table.width ||
        cueBall.position.y < 0 || cueBall.position.y > height) {
        cueBallBeingPlacedInDZone = true;
    } 
}

// when the cue ball is being placed in the d zone, this function gets
// repeatedly called in the main draw loop
function setCueBallInDZone() {
    // we ensure all balls aren't moveable when placing the cue ball down
    for (const ball of balls) { 
        if (!ball.isStatic) {
            Body.setStatic(ball, true);
        }
    }

    // if the ball has been placed
    if (mouseIsPressed && mouseButton === LEFT && cueBallBeingPlacedInDZone) {
        // since we've placed the cue ball the balls are now moveable
        for (const ball of balls) { 
            if (ball.isStatic) {
                Body.setStatic(ball, false);
            }
        }
        Body.setVelocity(cueBall, {x: 0, y: 0}); // we set its velocity to zero
         // and we are no longer placing the ball in the dzone
        cueBallBeingPlacedInDZone = false; 
    }
    // we place the ball at the current mouseX and mouseY x, y coords
    Body.setPosition(cueBall, {x: mouseX, y: mouseY});

    const dx = cueBall.position.x - dZone.x
    const dy = cueBall.position.y - dZone.y
    const distance = dist(cueBall.position.x, cueBall.position.y, dZone.x, dZone.y);
    const maxDist = dZone.diameter/2 
    push();
    fill(255)
    textSize(30)
    text('Left click in the D zone to place the cue ball', dZone.x, dZone.y);
    pop();
    // if the cue ball location would be outside of the dzone, we do not want
    // to allow this. We want the cue ball to only be placeable inside of the 
    // d zone, so we only allow it to move within that area
    if (distance > maxDist || cueBall.position.x > dZone.x) {

        // the angle between the d zone center and the cue ball
        const angle = atan2(dy, dx); 
        // the new x and y location (after being clipped if it goes past the
        // dzone circle)
        let newX = dZone.x + cos(angle) * maxDist;

        const newY = dZone.y + sin(angle) * maxDist;
        // if the new x position crosses the d zone line we clip it back to the
        // left side of the line
        newX = Math.min(newX, dZone.x); 
        // we then set the cueBalls position to the clipped coordinates
        Body.setPosition(cueBall, {x: newX, y: newY});
    }

}


// this function is responsible for applying the force to the cue ball from the
// cue
function shootCueBall() {
    // only if the cue ball is not moving do we allow force to be applied
    if (!cueBall.isMoving) {
        const cuePos = {x: cue.x, y: cue.y}
        // the angle the cue ball should travel after being hit by the cue
        const targetAngle = Matter.Vector.angle(cueBall.position, cuePos);
        // we map the force to an appropriate amount, be very careful editing 
        // this code because these numbers are very sensetive
        const force = map(cue.charge, 0, cue.maxCharge, 0.001, 0.05);
        Body.applyForce(cueBall, cueBall.position, {
            x: cos(targetAngle) * -force,
            y: sin(targetAngle) * -force
        });
        cue.charge = 0;
        // we reset the charge rate, so it is not negative, which can result
        // in shooting the ball backwards
        cue.chargeRate = Math.abs(cue.chargeRate);
    } 
}

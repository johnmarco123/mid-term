// when messageBeingDisplayed has a value, this function gets called and
// displays that message to the user
function displayMessage() {
    // the message gets shown for this timeouts duration, when the timeout
    // gets resolved, the message will no longer be shown (as it gets set
    // to undefined)
    setTimeout(() => messageBeingDisplayed = undefined, 3000);
    push();
    fill(255);
    textSize(25);
    text(messageBeingDisplayed, dZone.x, dZone.y);
    pop();
}

// draws the players score
function drawScore() {
    push();
    fill(255, 0, 0);
    textSize(25);
    text(`Score: ${score}`, 20, height - 15);
    pop();
}

// all the game info at the bottom of the screen gets shown from here
function drawGameInformation() {
    push();
    fill(255)
    textSize(20)
    text("Game modes:", 150, height - 125);
    text("1 = normal snooker", 20, height - 100);
    text("2 = randomized red ball positions", 20, height - 80);
    text("3 = all ball positions randomized except cue ball", 20, height - 60);
    text("4 = normal snooker with portals that teleport balls", 20, height - 40);
    text("Controls:", 640, height - 125);
    text("Use the left and right arrow keys to aim.", 500, height - 100);
    text("Hold the space bar to charge the cue,", 500, height - 80);
    text("release the space bar to hit the cue ball", 500, height - 60);
    pop();
}

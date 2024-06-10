// initializes each pocket, with the parameters provided
function setupPocket(x, y, diameter) {
    const options = {
        friction: 1,
        restitution: 0,
        isStatic: true,
        isSensor: true,
        label: 'pocket'
    }
    const radius = diameter / 2
    const pocket = Bodies.circle(x, y , radius, options);
    table.pockets.push(pocket);
    World.add(engine.world, [pocket]);
    return pocket
}

// initializes each cushion, with the parameters provided
function setupCushion(x, y, w, h, slope) {
    const options = {friction: 0.1, restitution: 1, isStatic: true, label: "cushion"}
    const cushion = Bodies.trapezoid(x, y, w, h, slope, options);
    table.cushions.push(cushion);
    World.add(engine.world, [cushion]);
    return cushion;
}

// sets up everything needed for the table, including all pockets and cushions
// as well as the table itself
function setupTable() {
    // initializing the table
    table.location = createVector(0, 0);
    table.width = 900;
    table.height = table.width / 2;

    // add the table to the world
    const options = {friction: 0, restitution: 0, isStatic: true, isSensor: true}
    table.table = Bodies.rectangle(table.location.x+450, table.location.y+220, table.width, table.height, options);
    World.add(engine.world, [table.table]);

    // here we initialize the pockets, and add them to the pockets array within
    // setupPocket.
    const offset = 20; // how far each hole is from the wall of the canvas
    const [tx, ty, tw, th] = [table.location.x, table.location.y, table.width, table.height];
    const HOLESIZE = BALLDIAMETER * 1.5; // UNCHANGEABLE VALUE!
    setupPocket(tx + offset, ty + offset, HOLESIZE);
    setupPocket(tx + tw/2, ty + offset, HOLESIZE);
    setupPocket(tx - offset + tw, ty + offset, HOLESIZE);
    setupPocket(tx + offset, ty - offset + th, HOLESIZE);
    setupPocket(tx + tw/2, ty - offset + th, HOLESIZE);
    setupPocket(tx - offset + tw, ty - offset + th, HOLESIZE);

    // adding the cushions to the tables cussions
    setupCushion(tx+235, ty + 20, 370, 20, -0.07);
    setupCushion(tx+665, ty + 20, 370, 20, -0.07);
    setupCushion(tx+235, ty - 20 + th, 390, 20, 0.07);
    setupCushion(tx+665, ty - 20 + th, 390, 20, 0.07);

    const leftCushion = setupCushion(tx+20, ty + 225, 370, 20, 0.07);
    Matter.Body.rotate(leftCushion, Math.PI / 2);

    const rightCushion = setupCushion(tx+880, ty + 225, 370, 20, 0.07);
    Matter.Body.rotate(rightCushion, -Math.PI / 2);

}

// we draw the table, including the pockets and the cushions
function drawTable(){
    push();
    noStroke();
    // the green of the pool table
    fill(50, 110, 50);
    const [tx, ty, tw, th] = [table.location.x, table.location.y, table.width, table.height];
    rect(tx, ty, tw, th, 20);
    drawVertices(table.table.vertices);

    // wooden frame of the table
    fill(110, 40, 10);
    rect(0, 0, table.width, 10);
    rect(0, 0, 10, table.height);
    rect(0, table.height-10, table.width, 10);
    rect(table.width - 10, 0, 10, table.height);

    // the yellow backs for each pocket
    fill(180, 180, 0);
    rect(0, 0, 30, 30, 5);
    rect(table.width / 2 - 20, 0, 40, 20, 5);
    rect(table.width - 30, 0, 30, 30, 5);
    rect(0, table.height - 30, 30, 30, 5);
    rect(table.width / 2 - 20, table.height - 20, 40, 20, 5);
    rect(table.width - 30, table.height - 30, 30, 30, 5);

    // the pool pockets
    fill(0);
    table.pockets.forEach(pocket => drawVertices(pocket.vertices));

    // the pool cushions
    fill(0, 0, 0, 100);
    table.cushions.forEach(cushion => drawVertices(cushion.vertices));

    pop();
    // we also draw the d zone here on top of everything else so it can be seen
    drawDZone();
}

// initializing the d zone location, and diameter
function setupDZone() {
    dZone = createVector(200, 220);
    dZone.diameter = 150;
}

// drawing of the d zon
function drawDZone() {
    push();
    stroke(255);
    line(200, 32, 200, table.height - 32);
    noFill();
    ellipse(dZone.x, dZone.y, dZone.diameter);

    noStroke();
    fill(50, 110, 50);
    rect(201, 140, 76, 160);
    pop();
}

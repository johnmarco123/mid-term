// for the custom gamemode 4, this helps us link two portals to one another
function linkPortals(portal1, portal2, color) {
    // we set their linkedTo property to one another. We also ensure
    // that their color property matches so the user knows which portals are
    // linked together
    portal1.linkedTo = portal2;
    portal2.linkedTo = portal1;
    portal1.color = color;
    portal2.color = color;
}

// removes all portals from the portal array, and destroys them from the world
function destroyAllPortals() {
    while (portals.length > 0) {
        removeFromWorld(portals.pop());
    }
}

// initializes all the portals
function setupPortals() {
    // CHANGE WITH CAUTION. CHANGING ANY OF THE OPTIONS WILL BREAK THE
    // FUNCTIONALITY OF THE PORTAL
    const options = { isStatic: true, isSensor: true, label: 'portal' };
    const portalLength = 100;
    const portalWidth = 10;
    const [tx, ty] = [table.location.x, table.location.y]

    // each portal has an outLocation. This is the location that a ball will
    // be teleported to, when it teleports to this portal.
    const d = BALLDIAMETER;
    const [p1x, p1y] = [tx+30, ty+220] // coordinates for portal 1
    const portal1 = Bodies.rectangle(p1x, p1y, portalWidth, portalLength, options);
    portal1.outLocation = {x: p1x+d, y: p1y}

    const [p2x, p2y] = [tx + 870, ty+220]; // coordinates for portal 2 
    const portal2 = Bodies.rectangle(tx + 870, ty+220, portalWidth, portalLength, options);
    portal2.outLocation = {x: p2x-d, y: p2y}
    linkPortals(portal1, portal2, [255, 0, 0]);

    const [p3x, p3y] = [tx + 240, ty + 30]; // coordinates for portal 3
    const portal3 = Bodies.rectangle(p3x, p3y, portalLength, portalWidth, options);
    portal3.outLocation = {x: p3x, y: p3y+d}

    const [p4x, p4y] = [tx + 240, ty+420]; // coordinates for portal 4
    const portal4 = Bodies.rectangle(p4x, p4y, portalLength, portalWidth,  options);
    portal4.outLocation = {x: p4x, y: p4y-d}
    linkPortals(portal3, portal4, [0, 255, 0]);

    const [p5x, p5y] = [tx + 670, ty+30]; // coordinates for portal 5
    const portal5 = Bodies.rectangle(p5x, p5y, portalLength, portalWidth, options);
    portal5.outLocation = {x: p5x, y: p5y+d}

    const [p6x, p6y] = [tx + 670, ty+420]; // coordinates for portal 6
    const portal6 = Bodies.rectangle(p6x, p6y, portalLength, portalWidth, options);
    portal6.outLocation = {x: p6x, y: p6y-d}
    linkPortals(portal5, portal6, [0, 0, 255]);

    portals.push(portal1, portal2, portal3, portal4, portal5, portal6);
    World.add(engine.world, [...portals]);
}

// flickers the colors of each portal for some added effect
function flickerPortalColors() {
    portalColors += portalColorChangeSpeed;
    if (portalColors >= 255 || portalColors <= 100) {
        portalColorChangeSpeed *= -1;
    }
}

// we draw all the portals here
function drawPortals() {
    // as long as there is portals, we flicker their colors so it looks cooler
    if (portals.length > 0) {
        flickerPortalColors();
    }
    // for each portal, we color it with its unique color
    push();
    for (const portal of portals) {
        noStroke();
        fill(...portal.color, portalColors);
        drawVertices(portal.vertices);
    }
    pop();
}

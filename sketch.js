
console.log("sketch entered");

function setup() {
    console.log("sketch set up");
    c = createCanvas(400, 400);
    c.parent("sketchdiv");
    c.position(0, 0);
    fill(100);
    rect(50, 50,20, 200);
    //c.clear();
}

function draw() {
    console.log("sketch looping");
}
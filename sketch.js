
console.log("sketch entered");

function setup() {
    console.log("sketch set up");
    let parent = document.getElementById("sketch");
    c = createCanvas(parent.offsetWidth, parent.offsetHeight);
    c.parent("sketch");
    //c.position(0, 0);
    //c.clear();
}

function draw() {
    //console.log("sketch looping");
    background(100);
    rect(0, 0, 50, 50);

    if (typeof asleep !== 'undefined') {
        if (asleep) {
            rect(200, 0, 50, 50);
            console.log("drew sleeping")
        }
    }

}


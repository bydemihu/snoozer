// script.js is the main snoozer functionality script. it is attached to snoozer.html which is inserted as an iframe by injector.js.

console.log("script.js entered");

// local vars
let minimized = false;
let progress = 0;  // progress percentage
let rate;  
let framerate = 12;
let lastframe = 0;
let active = true;
let showPoints = false;
let blinkThreshold;  // adjust for blink sensitivity
// range: 0.16 is ideal, 0.08 is low end, 0.36 is high end (1-10 scale for final)
let snoozecount = 0;
let asleep = false;
let quiet;

// declare DOM elements
let quietbutton;
let quietcolor;

// timer calculation: 100% progress is "100". it runs as 12 frames per second, rate is how much is incremented per frame. 
// if rate = 1, then it takes 100 frames to reach 100% progress, or 8.33 seconds.

// retrieve global variables  // COMMENT OUT FOR LOCAL TESTING
chrome.storage.sync.get(['snoozerQuieted'], function (result) {
    quiet = result.snoozerQuieted;
    console.log('script.js snoozerQuieted retrieved as', quiet);
    turnquiet(quiet);  // set initial quiet button state
});

chrome.storage.sync.get(['snoozerSensitivity'], function (result) {
    blinkThreshold = result.snoozerSensitivity * 0.04;
    console.log('script.js snoozerSensitivity retrieved as', result.snoozerSensitivity);
});

chrome.storage.sync.get(['snoozerTimer'], function (result) {
    rate = 100 / (result.snoozerTimer * framerate);
    console.log('script.js snoozerTimer retrieved as', result.snoozerTimer);
});



// LOAD CONTENT
document.addEventListener('DOMContentLoaded', async function () {

    // DECLARE VARIABLES
    const canvas = document.getElementById("canvas");
    canvas.setAttribute("width", 360);
    canvas.setAttribute("height", 240);
    canvas.setAttribute("style", "transform:scale(-1, 1);");
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = "white";

    const exit = document.getElementById("exit");
    const minimize = document.getElementById("minimize");
    const snoozebutton = document.getElementById("snoozebutton");
    quietbutton = document.getElementById("quietbutton");
    quietcolor = document.getElementById("quietcolor");
    const snoozetext = document.getElementById("snoozecount");

    // SET INITIAL STATES FOR LOCAL TESTING
    // quiet = false;
    // turnquiet(quiet);

    // blinkThreshold = 4 * 0.04;
    // rate = 100 / (10 * framerate);  //takes ten seconds

    // CONFIGURE MODEL
    const model = faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh;
    const detectorConfig = {
        runtime: 'tfjs',
        refineLandmarks: true,
    };
    const estimationConfig = { flipHorizontal: false, staticImageMode: false };

    // GET VIDEO DATA
    const video = document.getElementById('video');
    video.setAttribute("width", 360);
    video.setAttribute("height", 240);


    if (navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: { width: 360, height: 240 } })
            .then((stream) => {
                console.log('Video access granted.');
                video.srcObject = stream;  // assign stream to video elem
                video.addEventListener("loadeddata", () => {  // wait for stream to load
                    runDetection();  // run detection and draw points
                });
            })
            .catch(function (error) {
                console.log("Something went wrong!");
            });
    }

    // RUN DETECTION (REFINED LANDMARKS + DETECTORCONFIG)
    const runDetection = async () => {

        // version 1
        const detector = await faceLandmarksDetection.createDetector(model, detectorConfig);

        // all
        console.log("detector created");
        ctx.drawImage(video, 0, 0, 360, 240); //initial video
        let isProcessing = false;  // initial processing state


        // establish eye keypoint variables
        var RO = { x: 0, y: 0 };
        var RT = { x: 0, y: 0 };
        var RB = { x: 0, y: 0 };
        var RI = { x: 0, y: 0 };
        var RO = { x: 0, y: 0 };
        var LO = { x: 0, y: 0 };
        var LT = { x: 0, y: 0 };
        var LB = { x: 0, y: 0 };
        var LI = { x: 0, y: 0 };

        const detect = async (timestamp) => {  // runs every frame while active

            if (isProcessing) return;
            isProcessing = true;

            if (timestamp - lastframe >= 1000 / framerate) {
                lastframe = timestamp;


                // version 1
                const faces = await detector.estimateFaces(video, estimationConfig);

                // draw points
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(video, 0, 0, 360, 240);
                

                // detect faces
                faces.forEach(face => {
                    face.keypoints.forEach((keypoint, index) => {
                        
                        const x = keypoint.x;
                        const y = keypoint.y;

                        // keypoint mapping
                        if (index === 33) {  // RO
                            RO.x = x;
                            RO.y = y;
                            ctx.fillStyle = "red";
                        }
                        else if (index === 159) {  // RT
                            RT.x = x;
                            RT.y = y;
                            ctx.fillStyle = "red";
                        }
                        else if (index === 145) {  // RB
                            RB.x = x;
                            RB.y = y;
                            ctx.fillStyle = "red";
                        }
                        else if (index === 133) {  // RI
                            RI.x = x;
                            RI.y = y;
                            ctx.fillStyle = "red";
                        }
                        else if (index === 362) {  // LI
                            LI.x = x;
                            LI.y = y;
                            ctx.fillStyle = "red";
                        }
                        else if (index === 386) {  // LT
                            LT.x = x;
                            LT.y = y;
                            ctx.fillStyle = "red";
                        }
                        else if (index === 374) {  // LB
                            LB.x = x;
                            LB.y = y;
                            ctx.fillStyle = "red";
                        }
                        else if (index === 263) {  // LO
                            LO.x = x;
                            LO.y = y;
                            ctx.fillStyle = "red";
                        }
                        else {
                            ctx.fillStyle = "white";
                        }

                        if (showPoints) {  // draw points
                            ctx.fillRect(x, y, 1, 1); // Draw a rectangle for each keypoint
                        };
                    });
                });

                // perform distance calculations
                const LW = distance(LI.x, LO.x, LI.y, LO.y);
                const LH = distance(LT.x, LB.x, LT.y, LB.y);
                const RW = distance(RI.x, RO.x, RI.y, RO.y);
                const RH = distance(RT.x, RB.x, RT.y, RB.y);

                if (LH / LW <= blinkThreshold && RH / RW <= blinkThreshold) {
                    asleep = true;
                    console.log("sleeping")
                }
                else {
                    asleep = false;
                }

                if (active) {
                    // perform all sleep-based actions
                    if (asleep) {
                        document.getElementById("sun").style.display = "none";
                        document.getElementById("moon").style.display = "block";

                        if (progress > 100 - rate) {
                            progress = 100;
                            console.log("snoozed!!!");
                            active = false;
                            snoozecount++;
                            snoozetext.textContent = String(snoozecount);

                            window.parent.postMessage({ action: 'jumpscare' }, '*');  //send jumpscare to parent
                        }
                        else {
                            progress += rate;
                        }
                    }

                    else {
                        document.getElementById("sun").style.display = "block";
                        document.getElementById("moon").style.display = "none";

                        if (progress >= 1) {
                            progress += -1;  // save the value in progress
                        }
                    }

                    // update progress
                    const clamped = map(progress, 0, 100, 8, 98);
                    document.getElementById("progress").style.width = clamped + "%"; // can't exceed 100? or 100 progress has to equal 95 width
                    document.getElementById("progressicon").style.left = progress + "%";
                }

            }
            // finish frame calculations, rerun
            isProcessing = false;
            requestAnimationFrame(detect);

        } // end of detect

        detect(); // initial detect
    }

    // OTHER FUNCTIONS AND CLASSES
    canvas.onclick = () => {
        showPoints = !showPoints;
        console.log("points toggled");
    };

    function distance(x1, x2, y1, y2) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        return Math.sqrt(dx * dx + dy * dy);
    }

    function map(num, inMin, inMax, outMin, outMax) {
        num = ((num - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
        return num;
    }

    exit.onclick = () => {
        console.log("exited from interface");
        chrome.storage.sync.set({ snoozerEnabled: false });
    }

    minimize.onclick = () => {
        console.log("minimize toggled");
        window.parent.postMessage({ action: 'minimizetoggle' }, '*'); 

        if (minimized) {
            document.getElementById("logo").style.display = "block";
            document.getElementById("canvas").style.display = "block";
            document.getElementById("uicontainer").style.display = "block";
            document.getElementById("min").style.display = "block";
            document.getElementById("unmin").style.display = "none";
            minimized = false;
        }
        else {
            document.getElementById("logo").style.display = "none";
            document.getElementById("canvas").style.display = "none";
            document.getElementById("uicontainer").style.display = "none";
            document.getElementById("min").style.display = "none";
            document.getElementById("unmin").style.display = "block";
            minimized = true;
        }

    }

    snoozebutton.onclick = () => {
        console.log("snooze clicked")
        progress = 0;

        // reset state
        if (!active) {
            active = true;

            window.parent.postMessage({ action: 'reset' }, '*'); 
        }
    }

    quietbutton.onclick = () => {
        chrome.storage.sync.set({ snoozerQuieted: !quiet });  //send quiet to global
    }

});


// global state listener
chrome.storage.onChanged.addListener(function (changes, areaName) {

    // quiet toggled
    if (changes.snoozerQuieted) {
        quiet = changes.snoozerQuieted.newValue;
        turnquiet(quiet);
    }
});

function turnquiet(quiet){
        if (quiet) {
            quietcolor.style.backgroundColor = "rgb(119, 57, 255)";
            quietbutton.style.left = "";
            quietbutton.style.right = "0";
        }
        else {
            quietcolor.style.backgroundColor = "rgb(194, 210, 255)";
            quietbutton.style.left = "0";
            quietbutton.style.right = "";
        }
}

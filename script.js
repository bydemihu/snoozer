// // Make sure DOM content loaded, then run script
// import * as faceLandmarksDetection from './node_modules/@tensorflow-models/face-landmarks-detection';
// import './node_modules/@tensorflow/tfjs-core';
// // Register WebGL backend.
// import './node_modules/@tensorflow/tfjs-backend-webgl';
// import './node_modules/@mediapipe/face_mesh/face_mesh.js';

// CREATE GLOBAL VARS
window.asleep = false;
let minimized = false;
let progress = 0;  // progress percentage
let sleeptimer = 10;  // num of seconds, sort of rough
let rate = 15 / sleeptimer;
let active = true;
let showPoints = true;
let blinkThreshold = 0.16;  // adjust for blink sensitivity
let snoozecount = 0;
let quiet = false;
let jump;

// LOAD CONTENT
document.addEventListener('DOMContentLoaded', async function () {

    // DECLARE VARIABLES
    const canvas = document.getElementById("canvas");
    canvas.setAttribute("width", 360);
    canvas.setAttribute("height", 240);
    canvas.setAttribute("style", "transform:scale(-1, 1);");
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = "white";
    
    const exit = this.getElementById("exit");
    const minimize = this.getElementById("minimize");
    const container = this.getElementById("container");
    const snoozebutton = this.getElementById("snoozebutton");
    const quietbutton = this.getElementById("quietbutton");
    const quietcolor = this.getElementById("quietcolor");
    const snoozetext = this.getElementById("snoozecount");
    const uicontainer = this.getElementById("uicontainer");

    var images = [
        'assets/incredible.png',
        'assets/rock.jpg',
        'assets/emoji.jpg',
    ];

    var sounds = [
        'assets/airhorn.wav',
        'assets/boom.mp3',
        'assets/error.mp3',
        'assets/alarm.webm',
    ];

    // COLORS
    // let dark = color(47, 63, 91);
    // let medium = color(194, 210, 255);
    // let light = color(228, 236, 244);
    // let accent = color(119, 57, 255);
    // let gold = color(239, 201, 123);

    // CONFIGURE MODEL
    const model = faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh;
    const detectorConfig = {
        runtime: 'tfjs',
        refineLandmarks: true,
        //solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh', //https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh
        //./node_modules/@mediapipe/face_mesh
    };


    //https://github.com/tensorflow/tfjs-models/tree/master/face-landmarks-detection/src/mediapipe#usage


    // GET VIDEO DATA
    const video = document.getElementById('video');
    video.setAttribute("width", 360);
    video.setAttribute("height", 240);


    if (navigator.mediaDevices.getUserMedia) {
        //navigator.getUserMedia({ audio: false, video: { width: 360, height: 240 } })
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

    



    // RUN DETECTION (FACEMESH ONLY)
    const runDetection2 = async () => {

        async function detectFaces() {
            try {
                const model = await facemesh.load();
                //const video = document.getElementById("video");

                const detect = async () => {
                    const faces = await model.estimateFaces(video);

                    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                    faces.forEach(face => {
                        face.scaledMesh.forEach(keypoint => {
                            const x = keypoint[0];
                            const y = keypoint[1];
                            //console.log(x, y);
                            ctx.fillRect(x, y, 1, 1); // Draw a rectangle for each keypoint
                        })
                    })
                    requestAnimationFrame(detect);
                }
                detect();

            } catch (error) {
                console.error("Error detecting faces:", error);
            }
        }

        detectFaces();

    };


    // RUN DETECTION (REFINED LANDMARKS + DETECTORCONFIG)
    const runDetection = async () => {

        // version 2
        //const model = await faceLandmarksDetection.load(
        //faceLandmarksDetection.SupportedPackages.mediapipeFacemesh);


        // version 1
        const detector = await faceLandmarksDetection.createDetector(model, detectorConfig);

        // all
        console.log("detector created");
        ctx.drawImage(video, 0, 0, 360, 240); //initial video
        let isProcessing = false;  // initial processing state
        var first = true;  // initial detect run (used for logging the first face array)

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

        const detect = async () => {  // runs every frame while active
            //console.log("detect called");

            if (isProcessing) return;
            isProcessing = true;

            // version 1
            const estimationConfig = { flipHorizontal: false, staticImageMode: true };
            const faces = await detector.estimateFaces(video, estimationConfig);
            //console.log(video)

            // version 2
            //const faces = await model.estimateFaces({ input: video });

            if (first) {
                console.log(faces);
                first = false;
            }
            //console.log(faces)

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

            // if (LH / LW <= blinkThreshold) {
            //     console.log ("left blink");
            // }

            // if (RH / RW <= blinkThreshold) {
            //     console.log ("right blink");
            // }

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
                        snoozecount ++;
                        snoozetext.textContent = String(snoozecount);

                        window.parent.postMessage({ action: 'jumpscare' }, '*');  //send jumpscare to parent
                        //jumpscare();
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

            // finish frame calculations, rerun
            isProcessing = false;
            requestAnimationFrame(detect);

        } // end of detect

        detect(); // initial detect
    }

    // OTHER FUNCTIONS AND CLASSES
    // function jumpscare() {
    //     // generate random
    //     var rand = Math.floor(Math.random() * Math.min(images.length, sounds.length));
    //     jump = document.createElement('div');

    //     jump.style.backgroundImage = `url("${chrome.runtime.getURL(images[rand])}")`;
    //     //jump.style.backgroundImage = "url('" + images[rand] + "')";
    //     jump.style.backgroundSize = "fill";
    //     jump.style.backgroundRepeat = "no-repeat";
    //     jump.style.width = "100vw";
    //     jump.style.height = "100vh";
    //     jump.style.position = "absolute";
    //     jump.style.zIndex = 9999999;
    //     jump.id = "jumpscare";
        
    //     document.body.insertBefore(jump, container);
    //     //document.body.appendChild(jump);

    //     if(!quiet){
    //         var sound = new Audio(sounds[rand]);
    //         sound.play();
    //     }
        
    // };

    canvas.onclick = () => {
        showPoints = !showPoints;
        console.log("points toggled");
    };

    function distance(x1, x2, y1, y2) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        return Math.sqrt(dx * dx + dy * dy);
    }

    function map(num, inMin, inMax, outMin, outMax){ 
        num = ((num - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
        return num;
    }

    //setDrag(container)  (outdated, drag is now performed in injector.js)
    function setDrag(elem) {
        var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

        if (document.getElementById(elem.id + "grabber")) {
            document.getElementById(elem.id + "grabber").onmousedown = startDrag;
            console.log("dragged grabber")
        }
        else {
            elem.onmousedown = startDrag;
            console.log("dragged element")
        }

        function startDrag(e) {
            e = e || window.event;
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = stopDrag;
            document.onmousemove = dragElement;
        }

        function dragElement(e) {
            e = e || window.event;
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;

            elem.style.top = (elem.offsetTop - pos2) + "px";
            elem.style.left = (elem.offsetLeft - pos1) + "px";
        }

        function stopDrag() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    exit.onclick = () => {
        window.close();
        console.log("exited");
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
        if(!active){
            active = true;
            //jump.parentNode.removeChild(jump);

            window.parent.postMessage({ action: 'reset' }, '*');  //send reset to parent
            //window.parent.postMessage({ asleep: asleep }, '*');
        }
    }

    quietbutton.onclick = () => {
        console.log("quiet toggled", !quiet)
        window.parent.postMessage({ action: 'quiettoggle' }, '*');  //send jumpscare to parent

        if(quiet){
            quiet = false;
            quietcolor.style.backgroundColor = "rgb(194, 210, 255)";
            quietbutton.style.left = "0";
            quietbutton.style.right = "";
        }
        else{
            quiet = true;
            quietcolor.style.backgroundColor = "rgb(119, 57, 255)";
            quietbutton.style.left = "";
            quietbutton.style.right = "0";
        }
    }

});

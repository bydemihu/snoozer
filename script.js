// // Make sure DOM content loaded, then run script
// import * as faceLandmarksDetection from './node_modules/@tensorflow-models/face-landmarks-detection';
// import './node_modules/@tensorflow/tfjs-core';
// // Register WebGL backend.
// import './node_modules/@tensorflow/tfjs-backend-webgl';
// import './node_modules/@mediapipe/face_mesh/face_mesh.js';

// LOAD CONTENT
document.addEventListener('DOMContentLoaded', async function () {

    // DECLARE VARIABLES
    let canvas = document.getElementById("canvas");
    canvas.setAttribute("width", 240);
    canvas.setAttribute("height", 160);
    canvas.setAttribute("style", "transform:scale(-1, 1);");
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = "white";
    let img1 = document.getElementById("img1"); //tester image
    let showPoints = true;
    let asleep = false;
    let blinkThreshold = 0.1;

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
    video.setAttribute("width", 240);
    video.setAttribute("height", 160);
    if (navigator.mediaDevices.getUserMedia) {
        //navigator.getUserMedia({ audio: false, video: { width: 240, height: 160 } })
        navigator.mediaDevices.getUserMedia({ video: { width: 240, height: 160 } })
            .then(function (stream) {
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
        ctx.drawImage(video, 0, 0, 240, 160); //initial video
        let isProcessing = false;  // initial processing state
        var first = true;

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

        const detect = async () => {  // runs every frame
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
            ctx.drawImage(video, 0, 0, 240, 160);

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

            if (LH/LW <= blinkThreshold && RH/RW <= blinkThreshold){
                asleep = true;
                console.log("sleeping")
                ctx.fillRect(0, 0, 20, 20);
            }
            else{
                asleep = false;
            }

            // finish frame calculations, rerun
            isProcessing = false;
            requestAnimationFrame(detect);

        } // end of detect

        detect(); // initial detect
    }

    // SET POINTS TOGGLE
    canvas.onclick = () => {
        showPoints = !showPoints;
        console.log("points toggled");
    };


    function distance(x1, x2, y1, y2) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        return Math.sqrt(dx * dx + dy * dy);
    }
});

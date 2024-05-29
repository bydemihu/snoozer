// // Make sure DOM content loaded, then run script
// import * as faceLandmarksDetection from './node_modules/@tensorflow-models/face-landmarks-detection';
// import './node_modules/@tensorflow/tfjs-core';
// // Register WebGL backend.
// import './node_modules/@tensorflow/tfjs-backend-webgl';
// import './node_modules/@mediapipe/face_mesh/face_mesh.js';


// LOAD CONTENT
document.addEventListener('DOMContentLoaded', function() {

// DECLARE VARIABLES
let canvas = document.getElementById("canvas");
canvas.setAttribute("width", 240);
canvas.setAttribute("height", 160);
canvas.setAttribute("style", "transform:scale(-1, 1);");
var ctx = canvas.getContext("2d");
ctx.fillStyle = "white";
let img1 = document.getElementById("img1"); //tester image
let showPoints = false;

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
    .then(function(stream) {
    video.srcObject = stream;  // assign stream to video elem
    video.addEventListener("loadeddata", () =>{  // wait for stream to load
    runDetection();  // run detection and draw points
    });
        })
        .catch(function(error) {
          console.log("Something went wrong!");
        });
    }



// RUN DETECTION (TFJS)
const runDetection2 = async () =>{

    async function detectFaces() {
        try {
          const model = await facemesh.load();
          //const video = document.getElementById("video");
        
          const detect = async () =>{
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


// RUN DETECTION (MEDIAPIPE)
const runDetection = async () =>{
    const detector = await faceLandmarksDetection.createDetector(model, detectorConfig);
    console.log("detector created");
    ctx.drawImage(video, 0, 0, 240, 160); //initial video
    let isProcessing = false;  // initial processing state

    const detect = async () => {  // runs every frame
        //console.log("detect called");
        if (isProcessing) return;
        isProcessing = true;

        const estimationConfig = { flipHorizontal: false, staticImageMode: true};
        const faces = await detector.estimateFaces(video, estimationConfig);
        //console.log(video)
        
        //console.log(faces)
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(video, 0, 0, 240, 160);
            if (showPoints){  // draw points
                    faces.forEach(face => {
                        face.keypoints.forEach(keypoint => {
                            const x = keypoint.x;
                            const y = keypoint.y;
                            //console.log("drew a point");
                            ctx.fillRect(x, y, 1, 1); // Draw a rectangle for each keypoint
                        });
                    });
            };  

        isProcessing = false;
        requestAnimationFrame(detect);
        }
        detect();
    }

    // SET POINTS TOGGLE
    canvas.onclick = ()=>{
        showPoints = !showPoints;
        console.log("points toggled");
    };
});

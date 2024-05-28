// Make sure DOM content loaded, then run script
// import './node_modules/@mediapipe/face_mesh/face_mesh.js';
// import './node_modules/@tensorflow/tfjs-core/dist/tf-core.js';
// // Register WebGL backend.
// import './node_modules/@tensorflow/tfjs-backend-webgl/dist/tf-backend-webgl.js';
// import * as faceLandmarksDetection from './node_modules/@tensorflow-models/face-landmarks-detection/dist/face-landmarks-detection.js';

document.addEventListener('DOMContentLoaded', (event) => {

let video = document.getElementById("video");
let button = document.getElementById('requestPermission');
//let image2 = document.getElementById("testimage");
//var canvas = document.createElement("canvas");

let canvas = document.getElementById("canvas")
//let canvas = document.getElementById("canvas");
canvas.setAttribute("width", 240);
canvas.setAttribute("height", 160);
canvas.setAttribute("style", "transform:scale(-1, 1);");
//canvas.setAttribute("style", "position: absolute; x:0; y:0; transform:scale(-1, 1);");
//document.body.appendChild(canvas);
var ctx = canvas.getContext("2d");
ctx.fillStyle = "white";
// ctx.translate(600, 0);
// ctx.scale(-1, 1);

// ctx.translate(0, 0);
// ctx.scale(1, 1);

canvas.onselectstart = function () { return false; }

const model = faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh;
const detectorConfig = {
runtime: 'mediapipe',
refineLandmarks: true,
solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh', //https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh
};

//https://github.com/tensorflow/tfjs-models/tree/master/face-landmarks-detection/src/mediapipe#usage

// tl 600 0 scale -1 1



// const setupCamera = () => {
//     navigator.mediaDevices.getUserMedia({
//         video: {width: 600, height: 400},
//         audio: false,
//     })
//     .then((stream) => {
//         video.srcObject = stream;
//     });
// };






setTimeout( function() {  //global timeout of 1000milli

    let button = document.getElementById('requestPermission');

    button.onclick = ()=>{
        console.log('cam button clicked');
        navigator.getUserMedia = navigator.getUserMedia ||
                        navigator.webkitGetUserMedia ||
                        navigator.mozGetUserMedia;
    
        if (navigator.getUserMedia) {
        navigator.getUserMedia({ audio: false, video: { width: 240, height: 160 } },
            (stream) => {
                console.log('cam media gotten');
    
                video.srcObject = stream;  // assign the webcam stream to the html video element
    
                video.addEventListener("loadeddata", () =>{  // only run the model stuff after vid loaded
                    console.log('media loaded, detection run');
                    runDetection();  // temporary don't run detection
                    
                });
            },
            (err) => {
                console.error(`The following error occurred: ${err.name}`);
            }
        );
        } else {
            console.log("getUserMedia not supported");
        }
    };




// function btncheck(){
// button = document.getElementById('requestPermission');
// if (button == null) {
//     setTimeout ( btncheck() , 100)
//     }
// }

// btncheck();

// button.onclick = ()=>{
//     console.log('ya');
//     navigator.getUserMedia = navigator.getUserMedia ||
//                     navigator.webkitGetUserMedia ||
//                     navigator.mozGetUserMedia;

//     if (navigator.getUserMedia) {
//     navigator.getUserMedia({ audio: false, video: { width: 600, height: 400 } },
//         (stream) => {
//             console.log('success');
//             video.srcObject = stream;

//             video.addEventListener("loadeddata", () =>{  // only run the model stuff after vid loaded
//                 runDetection();
//                 // draw the face keypoints
//             });

//         },
//         (err) => {
//             //console.error(`The following error occurred: ${err.name}`);
//         }
//     );
//     } else {
//         console.log("getUserMedia not supported");
//     }
// };

}, 1000);





// runDetection establishes the model, configures the mediapipe and detection, and draws the camera preview.
const runDetection = async () =>{
    // const model = faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh;
    // const detectorConfig = {
    // runtime: 'mediapipe',
    // solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh',
    // };

    const detector = await faceLandmarksDetection.createDetector(model, detectorConfig);
    // detector is assigned once the facelandmark detection model loads

    // this runs every frame
    const detect = async () => {
        console.log("detect called");
        const estimationConfig = { flipHorizontal: false };
        const faces = await detector.estimateFaces(video, estimationConfig);
        // faces is assigned once the detector finds a face
        //console.log(faces)

        // Clear the canvas
        //ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // the video data is not flipped, so neither are the keypoints. do all calculations with the original data and only draw it flipped.
        ctx.drawImage(video, 0, 0, 240, 160);
        console.log("videodrawn");
        if (faces.length > 0) {
            faces.forEach(face => {
                face.keypoints.forEach(keypoint => {
                    const x = keypoint.x;
                    const y = keypoint.y;
                    ctx.fillRect(x, y, 1, 1); // Draw a rectangle for each keypoint
                });
            });
        }

        requestAnimationFrame(detect); // Continue detecting in the next frame
        //console.log("requesteddetect");
    };

    detect();
    // const estimationConfig = {flipHorizontal: false};
    // console.log(video)
    // const faces = await detector.estimateFaces(video, estimationConfig);

    // console.log(faces);
}


});



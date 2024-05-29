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

// CONFIGURE MODEL (MEDIAPIPE)
// const model = faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh;
// const detectorConfig = {
// runtime: 'mediapipe',
// refineLandmarks: true,
// solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh', //https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh
// };

//https://github.com/tensorflow/tfjs-models/tree/master/face-landmarks-detection/src/mediapipe#usage


// GET VIDEO DATA
const video = document.getElementById('video');
if (navigator.mediaDevices.getUserMedia) {
    //navigator.getUserMedia({ audio: false, video: { width: 240, height: 160 } })
    navigator.mediaDevices.getUserMedia({ video: { width: 240, height: 160 } })
    .then(function(stream) {
    video.srcObject = stream;  // assign stream to video elem
    video.addEventListener("loadeddata", () =>{  // wait for stream to load
    runDetection2();  // run detection and draw points
    });
        })
        .catch(function(error) {
          console.log("Something went wrong!");
        });
    }



// RUN DETECTION


const runDetection2 = async () =>{

    async function detectFaces() {
        try {
          const model = await facemesh.load();
          //const video = document.getElementById("video");
        
          const repeat = async () =>{
            
          //ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          //ctx.clearRect(0, 0, canvas.width, canvas.height);
          //ctx.fillRect(102, 140, 2, 2);
          
          const faces = await model.estimateFaces(video);
          //console.log(faces[0].mesh)

          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            faces.forEach(face => {
                face.scaledMesh.forEach(keypoint => {
                    const x = keypoint[0];
                    const y = keypoint[1];
                    //console.log(x, y);
                    ctx.fillRect(x, y, 1, 1); // Draw a rectangle for each keypoint
                    //console.log("drew  a point");
                })
            })
          

          
            requestAnimationFrame(repeat);
        
        }
        repeat();
        

        } catch (error) {
          console.error("Error detecting faces:", error);
        }
      }
      
      // Call the function to start face detection.
      detectFaces();

};








// setTimeout( function() {  //global timeout of 1000milli


//     // button.onclick = ()=>{
//     //     console.log('cam button clicked');
//     //     navigator.getUserMedia = navigator.getUserMedia ||
//     //                     navigator.webkitGetUserMedia ||
//     //                     navigator.mozGetUserMedia;
    
//     //     if (navigator.getUserMedia) {
//     //     navigator.getUserMedia({ audio: false, video: { width: 240, height: 160 } },
//     //         (stream) => {
//     //             console.log('cam media gotten');
    
//     //             video.srcObject = stream;  // assign the webcam stream to the html video element
    
//     //             video.addEventListener("loadeddata", () =>{  // only run the model stuff after vid loaded
//     //                 console.log('media loaded, detection run');
//     //                 runDetection();  // temporary don't run detection
                    
//     //             });
//     //         },
//     //         (err) => {
//     //             console.error(`The following error occurred: ${err.name}`);
//     //         }
//     //     );
//     //     } else {
//     //         console.log("getUserMedia not supported");
//     //     }
//     // };



// }, 1000);





// runDetection establishes the model, configures the mediapipe and detection, and draws the camera preview.
const runDetection = async () =>{
    // const model = faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh;
    // const detectorConfig = {
    // runtime: 'mediapipe',
    // solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh',
    // };


    async function detectFaces() {
        try {
          // Load the MediaPipe facemesh model assets.
          const model = await facemesh.load();
          
          // Select the video element.
          const video = document.querySelector("video");
          
          // Check if the video element is found and ready to play
          if (video) {
            // Ensure the video is loaded and playing
            if (video.readyState >= 2) {
              // Pass the video stream to the model to obtain an array of detected faces.
              const faces = await model.estimateFaces(video);
              
              // Each face object contains a `scaledMesh` property, which is an array of 468 landmarks.
              //scaledmesh is the array!
              //faces.forEach(face => console.log(face.scaledMesh));
            } else {
              console.error("Video element is not ready to play.");
            }
          } else {
            console.error("Video element not found.");
          }
        } catch (error) {
          console.error("Error detecting faces:", error);
        }
      }
      
      // Call the function to start face detection.
      detectFaces();






//---------------------------------------
    // const detector = await faceLandmarksDetection.createDetector(model, detectorConfig);
    // // detector is assigned once the facelandmark detection model loads

    // // this runs every frame
    // const detect = async () => {
    //     console.log("detect called");
    //     const estimationConfig = { flipHorizontal: false };
    //     const faces = await detector.estimateFaces(video, estimationConfig);



    //     // --------------------------
    //     // faces is assigned once the detector finds a face
    //     //console.log(faces)

    //     // Clear the canvas
    //     //ctx.clearRect(0, 0, canvas.width, canvas.height);
        
    //     // the video data is not flipped, so neither are the keypoints. do all calculations with the original data and only draw it flipped.
    //     ctx.drawImage(video, 0, 0, 240, 160);
    //     console.log("videodrawn");
    //     if (faces.length > 0) {
    //         console.log("face detected");
    //         faces.forEach(face => {
    //             face.keypoints.forEach(keypoint => {
    //                 const x = keypoint.x;
    //                 const y = keypoint.y;
    //                 ctx.fillRect(x, y, 1, 1); // Draw a rectangle for each keypoint
    //             });
    //         });
    //     }

    //     requestAnimationFrame(detect); // Continue detecting in the next frame
    //     //console.log("requesteddetect");
    // };

    // detect();
    // const estimationConfig = {flipHorizontal: false};
    // console.log(video)
    // const faces = await detector.estimateFaces(video, estimationConfig);

    // console.log(faces);



};
});

document.addEventListener('DOMContentLoaded', (event) => {


let button = document.getElementById('requestPermission');
let pop = document.getElementById('openPopup');

button.onclick = ()=>{
    console.log('camera allowed via options');
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ audio: false, video: { width: 240, height: 160 } })
                .then((stream) => {
                    console.log('Video access granted.');
                    // Here, you might want to attach this stream to a video element to show on screen
                })
                .catch((error) => {
                    console.error(`The following error occurred: ${error.name}`);
                });
        } else {
            console.log("Browser does not support getUserMedia.");
        }





    // navigator.getUserMedia = navigator.getUserMedia ||
    //                 navigator.webkitGetUserMedia ||
    //                 navigator.mozGetUserMedia;

    // if (navigator.getUserMedia) {
    // navigator.getUserMedia({ audio: false, video: { width: 240, height: 160 } },
    //     (stream) => {
    //         console.log('video success');
    //     },
    //     (err) => {
    //         console.error(`The following error occurred: ${err.name}`);
    //     }
    // );
    // } else {
    //     console.log("getUserMedia not supported");
    // }
};

pop.onclick = () => {
    console.log('popup opened');
    //chrome.windows.create({url: "test.html", type: "popup"});

//     chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//         chrome.tabs.executeScript(
//           tabs[0].id,
//           {file: 'background.js'}  // run the script that injects test.html

//     //chrome.runtime.sendMessage({ action: 'openPopup' });
// )});
};



});
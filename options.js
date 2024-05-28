let button = document.getElementById('requestPermission');

button.onclick = ()=>{
    console.log('ya');
    navigator.getUserMedia = navigator.getUserMedia ||
                    navigator.webkitGetUserMedia ||
                    navigator.mozGetUserMedia;

    if (navigator.getUserMedia) {
    navigator.getUserMedia({ audio: false, video: { width: 600, height: 400 } },
        (stream) => {
            console.log('video success');
        },
        (err) => {
            console.error(`The following error occurred: ${err.name}`);
        }
    );
    } else {
        console.log("getUserMedia not supported");
    }
};
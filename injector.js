// this adds test.html snoozer interface to the webpage. it gets called by background.js


let iframecontainer = document.createElement('div');
let iframe = document.createElement('iframe');
let iframegrabber = document.createElement('div');
let iframeexit = document.createElement('div');
let quiet = false;
let minimized = false;

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

// Set the attributes for the iframe
iframe.src = chrome.runtime.getURL('snoozer.html'); // Use the local snoozer.html file
iframe.sandbox = "allow-scripts allow-same-origin allow-forms";
iframe.allow = 'camera; microphone';
iframe.style.width = '310px';
iframe.style.height = '560px';
iframe.style.border = 'none';
iframe.style.overflow = 'hidden';
iframe.style.pointerEvents = 'auto';
iframe.style.zIndex = '123456789';
iframe.style.transform = '(translate3d(0, 0, 1));'
iframe.style.position = 'absolute';

// movable container containing the iframe
iframecontainer.style.position = 'fixed';
iframecontainer.style.top = '0';
iframecontainer.style.left = '0';
iframecontainer.style.width = '0';
iframecontainer.id = "iframecontainer";
iframecontainer.style.zIndex = '1234567899';

// grab bar
iframegrabber.style.position = 'absolute';
iframegrabber.style.top = '0px';
iframegrabber.style.left = '48px';
iframegrabber.style.width = "180px";
iframegrabber.style.height = "48px";
iframegrabber.id = "iframecontainergrabber"
iframegrabber.style.zIndex = '1234567899';

// exit button
iframeexit.style.position = 'absolute';
iframeexit.style.top = '12px';
iframeexit.style.left = '270px';
iframeexit.style.width = "32px";
iframeexit.style.height = "32px";
iframeexit.id = "iframeexit";
iframeexit.style.zIndex = '1234567899';
iframeexit.style.cursor = "pointer";

//Append the iframe to the body of the webpage
document.body.appendChild(iframecontainer);
iframecontainer.appendChild(iframegrabber);
iframecontainer.appendChild(iframeexit);
iframecontainer.appendChild(iframe);


iframeexit.onclick = () => {
    iframecontainer.remove();

    if (jump) {
        jump.remove();
    }
}



setDrag(iframecontainer)
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

function jumpscare() {
    // generate random
    var rand = Math.floor(Math.random() * Math.min(images.length, sounds.length));
    jump = document.createElement('div');

    //jump.style.backgroundImage = "url('" + images[rand] + "')";
    jump.style.width = "100%";
    jump.style.height = "100%";
    jump.style.position = "fixed";
    jump.style.top = "0";
    jump.style.zIndex = 10000000;
    jump.id = "jumpscare";

    jump.style.backgroundImage = `url("${chrome.runtime.getURL(images[rand])}")`;
    jump.style.backgroundRepeat = "no-repeat";
    jump.style.backgroundSize = "100% 100%";

    //document.body.insertBefore(jump, iframecontainer);
    document.body.appendChild(jump);


    console.log("inject made a jumpscare");

    if(!quiet){
        var sound = new Audio();
        sound.src = chrome.runtime.getURL(sounds[rand]);
        sound.play();
    }
    
};

window.addEventListener('message', function(event) {
    // Ensure the message is coming from the expected origin
    //if (event.origin !== 'snoozer.html') return;

    if (event.data && event.data.action === 'jumpscare') {
        console.log("jumpscare called from iframe");
        jumpscare();
    }

    if (event.data && event.data.action === 'reset') {
        console.log("reset called from iframe");
        jump.remove();
    }

    if (event.data && event.data.action === 'quiettoggle') {
        quiet = !quiet;
    }
    
    if (event.data && event.data.action === 'minimizetoggle') {

        if(!minimized){
            iframe.style.height = "120px";
            console.log("minimized iframe");
        }
        else{
            iframe.style.height = "560px";
        }


        minimized = !minimized;
        
    }
});



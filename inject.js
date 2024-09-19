// this adds test.html snoozer interface to the webpage. it gets called by background.js!

let iframecontainer;
let iframe;
let iframegrabber;
let iframeexit;
let quiet = false;
let minimized = false;
let jump;
let position = { top: '12px', left: '12px' };
let active; // if the current tab is active
let enabled;

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

chrome.storage.sync.get(['snoozerEnabled'], function (result) {
    if (result.snoozerEnabled === undefined) {
        chrome.storage.sync.set({ snoozerEnabled: false });
        console.log('snoozerEnabled initialized as false');
        enabled = false;
    }

    else {
        if (result.snoozerEnabled && active) {
            console.log('snoozerEnabled initial open');
            open();
        }
        enabled = result.snoozerEnabled;
    }
});

chrome.storage.sync.get(['snoozerQuieted'], function (result) {
    if (result.snoozerQuieted === undefined) {
        chrome.storage.sync.set({ snoozerQuieted: false });
        console.log('snoozerQuieted initialized as false');
        quiet = false;
    }

    else {
        quiet = result.snoozerQuieted;
        console.log('snoozerQuieted retrieved as', quiet);
    }
});

chrome.storage.sync.get(['snoozerPosition'], function (result) {
    if (result.snoozerPosition === undefined) {
        chrome.storage.sync.set({ snoozerPosition: { top: '12px', left: '12px' } });
        console.log('snoozerPosition initialized');
        position = result.snoozerPosition;
    }

    else {
        position = result.snoozerPosition;
        console.log('snoozerPosition retrieved as', position);
    }
});

function open() {
    iframecontainer = document.createElement('div');
    iframe = document.createElement('iframe');
    iframegrabber = document.createElement('div');

    // Set the attributes for the iframe
    iframe.src = chrome.runtime.getURL('snoozer.html'); // Use the local snoozer.html file
    iframe.sandbox = "allow-scripts allow-same-origin allow-forms allow-popups";
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
    iframecontainer.style.top = position.top;
    iframecontainer.style.left = position.left;
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

    //Append the iframe to the body of the webpage
    document.body.appendChild(iframecontainer);
    iframecontainer.appendChild(iframegrabber);
    iframecontainer.appendChild(iframe);

    setDrag(iframecontainer);

}

function exit() {
    if (iframecontainer) {
        iframecontainer.remove();
        if (jump) {
            jump.remove();
        }
        iframecontainer = null;
        iframe = null;
        iframegrabber = null;
        iframeexit = null;
    }
}

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

    // retrieve position
    chrome.storage.sync.get(['snoozerPosition'], function(result) {
        if (result.snoozerPosition) {
            elem.style.top = result.snoozerPosition.top;
            elem.style.left = result.snoozerPosition.left;
        }
    });

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

        // update position
        chrome.storage.sync.set({
            snoozerPosition: {
                top: elem.style.top,
                left: elem.style.left
            }
        });
    }
}

function jumpscare() {
    // generate random
    var rand = Math.floor(Math.random() * Math.min(images.length, sounds.length));
    jump = document.createElement('div');

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

    if (!quiet) {
        var sound = new Audio();
        sound.src = chrome.runtime.getURL(sounds[rand]);
        sound.play();
    }

};

// iframe state listener
window.addEventListener('message', function (event) {
    // Ensure the message is coming from the expected origin
    //if (event.origin !== 'snoozer.html') return;

    if (active && enabled){  // listener only works if active

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

        if (!minimized) {
            iframe.style.height = "120px";
            console.log("minimized iframe");
        }
        else {
            iframe.style.height = "560px";
        }

        minimized = !minimized;
    }
}

});

// global state listener
chrome.storage.onChanged.addListener(function (changes, areaName) {


    if (changes.snoozerEnabled) {
        if (changes.snoozerEnabled.newValue && active) {
            open();
            console.log("snoozer opened")
        } else {
            exit();
            console.log("snoozer exited")
        }
        enabled = changes.snoozerEnabled.newValue;  // local enabled variable containing global value;
    }
    

    // quiet
    if (changes.snoozerQuieted) {
        quiet = changes.snoozerQuieted.newValue;
    }


});

// tab state listner
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log("received", request.action.toString(), "from background");

    if (request.action === "activateTab" && enabled) {

        console.log("received activateTab from background");
        active = true;

        if (!document.getElementById('iframecontainer')) {
            console.log('No element with ID "iframecontainer" exists. Safe to proceed.');
            open();
        } else {
            console.log('Element with ID "iframecontainer" already exists.');
            exit();
            open();
        }

        // open();
        // reinsert iframe WITHOUT affecting snoozerEnabled

    } else if (request.action === "deactivateTab") {

        console.log("received deactivateTab from background");
        active = false;
        exit();
        // remove iframe WITHOUT affecting snoozerEnabled
    }
});


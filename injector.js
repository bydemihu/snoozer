let iframecontainer = document.createElement('div');
let iframe = document.createElement('iframe');
let iframegrabber = document.createElement('div');

// Set the attributes for the iframe
iframe.src = chrome.runtime.getURL('test.html'); // Use the local test.html file
iframe.sandbox = "allow-scripts allow-same-origin allow-forms";
iframe.allow = 'camera; microphone';
iframe.style.width = '320px';
iframe.style.height = '560px';
iframe.style.border = 'none';
// iframe.style.position = 'fixed';
iframe.style.overflow = 'hidden';
iframe.style.pointerEvents = 'auto';
iframe.style.cursor = "move";
// iframe.style.top = '0';
// iframe.style.left = '0';
iframe.style.zIndex = '1000000000';
iframe.style.position = 'absolute';

iframecontainer.style.position = 'fixed';
iframecontainer.style.top = '0';
iframecontainer.style.left = '0';
iframecontainer.style.width = '0';
iframecontainer.id = "iframecontainer";

iframegrabber.style.position = 'absolute';
iframegrabber.style.top = '0px';
iframegrabber.style.left = '48px';
iframegrabber.style.width = "180px";
iframegrabber.style.height = "48px";
iframegrabber.id = "iframecontainergrabber"
iframegrabber.style.zIndex = '100000000000';
//iframegrabber.style.backgroundColor = 'black';

//Append the iframe to the body of the webpage
document.body.appendChild(iframecontainer);
iframecontainer.appendChild(iframegrabber);
iframecontainer.appendChild(iframe);

//document.body.appendChild(iframe);

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



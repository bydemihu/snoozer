// THESE ARE THE OPTIONS SETTINGS FOR VER 2.0
// to-do: let user adjust blink sensitivity and snooze rate
// to-do: let user add their own pictures and sounds

console.log("options.js entered");

document.addEventListener('DOMContentLoaded', (event) => {

    // initialize DOM elements
    let backbutton = document.getElementById("backbutton");
    let quietbutton = document.getElementById("quietbutton");
    let timerbarbutton = document.getElementById("timerbarbutton");
    let sensebarbutton = document.getElementById("sensebarbutton");


    backbutton.onclick = () => {
        if (window.history.length > 1) {
                window.location.href = 'popup.html';
        } else {
            window.close();
        }
    }

    quietbutton.onclick = () => {
        window.location.href = "./error.html";
    }

    timerbarbutton.onclick = () => {
        window.location.href = "./error.html";
    }

    sensebarbutton.onclick = () => {
        window.location.href = "./error.html";
    }

    
});
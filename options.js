// THESE ARE THE OPTIONS SETTINGS FOR VER 2.0
// to-do: let user add their own pictures and sounds

console.log("options.js entered");
//let quiet = false;

document.addEventListener('DOMContentLoaded', (event) => {

    // initialize DOM elements
    let quiet;
    let backbutton = document.getElementById("backbutton");
    let quietbutton = document.getElementById("quietbutton");

    let sensitivityslider = document.getElementById("sensitivityslider");  // slider input
    let sensitivity = document.getElementById("sensitivity");  // number display
    let timerslider = document.getElementById("timerslider");
    let timer = document.getElementById("timer");

    // retrieve global values and set initial states for options
    chrome.storage.sync.get(['snoozerQuieted'], function (result) {
        quiet = result.snoozerQuieted;
        console.log('options.js snoozerQuieted retrieved as', quiet);
        turnquiet(quiet);  // set initial quiet button state
    });

    chrome.storage.sync.get(['snoozerSensitivity'], function (result) {
        sensitivity.innerHTML = result.snoozerSensitivity;
        updateSliderBackground(sensitivityslider);
    });

    chrome.storage.sync.get(['snoozerTimer'], function (result) {
        timer.innerHTML = result.snoozerTimer;
        updateSliderBackground(timerslider);
    });

    backbutton.onclick = () => {
        if (window.history.length > 1) {
            window.location.href = 'popup.html';
        } else {
            window.close();
        }
    }

    quietbutton.onclick = () => {
        turnquiet(!quiet);
        quiet = !quiet;
    }

    // update sensitivity
    sensitivityslider.oninput = function () {
        sensitivity.innerHTML = this.value;
        updateSliderBackground(this)
    }

    // update timer
    timerslider.oninput = function () {
        timer.innerHTML = this.value;
        console.log("input made")
        updateSliderBackground(this)
    }

    // toggle quiet button
    function turnquiet(quiet) {
        if (quiet) {
            quietcolor.style.backgroundColor = "rgb(119, 57, 255)";
            quietbutton.style.left = "";
            quietbutton.style.right = "0";
        }
        else {
            quietcolor.style.backgroundColor = "rgb(194, 210, 255)";
            quietbutton.style.left = "0";
            quietbutton.style.right = "";
        }
    }

    // update purple slider bg
    function updateSliderBackground(slider) {
        const min = slider.min || 0;
        const max = slider.max || 100;
        const value = slider.value;
    
        const percentage = ((value - min) / (max - min)) * 100;
    
        slider.style.background = `linear-gradient(to right, rgb(119, 57, 255) ${percentage}%, rgb(194, 210, 255) ${percentage}%)`;
    }

});
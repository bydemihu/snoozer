// This is the script attached to the popup that turns snoozerEnabled on and off.

console.log("popup.js entered");

document.addEventListener('DOMContentLoaded', async function () {
    let on;

    // get global
    chrome.storage.sync.get(['snoozerEnabled'], function (result) {
        on = result.snoozerEnabled;
        console.log("popup retrieved snoozerEnabled as", on);

        // set initial local state
        if (on) {
            turnon();
        }
        else {
            turnoff();
        }
    });

    // get local elements
    let onbutton = document.getElementById('onbutton');
    let oncolor = document.getElementById('oncolor');

    // global state listener
    chrome.storage.onChanged.addListener(function (changes, areaName) {
        if (changes.snoozerEnabled) {
            on = changes.snoozerEnabled.newValue;  // update on value
            if (on) {
                turnon();
            } else {
                turnoff();
            }
        }
    });

    // global state changer
    // NOTHING ELSE NEEDED, injector.js has its own global state listener
    onbutton.onclick = () => {
        console.log("on toggled from popup", !on);
        chrome.storage.sync.set({ snoozerEnabled: !on });
    }

    // local state changer functions
    function turnon() {
        oncolor.style.backgroundColor = "rgb(119, 57, 255)";
        onbutton.style.left = "";
        onbutton.style.right = "0";

        // inject script
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            let activeTab = tabs[0];
            chrome.scripting.executeScript({
              target: { tabId: activeTab.id },
              files: ['injector.js']
            }, () => {
              if (chrome.runtime.lastError) {
                console.error(chrome.runtime.lastError);
              } else {
                console.log('injector.js injected successfully');
              }
            });
          });
    }

    function turnoff() {
        oncolor.style.backgroundColor = "rgb(194, 210, 255)";
        onbutton.style.left = "0";
        onbutton.style.right = "";
    }

})
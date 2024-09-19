// This is the script attached to the popup that turns snoozerEnabled on and off.

console.log("popup.js entered");

document.addEventListener('DOMContentLoaded', async function () {
    let enabled;

    // get global
    chrome.storage.sync.get(['snoozerEnabled'], function (result) {
        enabled = result.snoozerEnabled;
        console.log("popup retrieved snoozerEnabled as", enabled);

        // set initial local state
        if (enabled) {
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
            enabled = changes.snoozerEnabled.newValue;  // update on value
            if (enabled === true) {
                turnon();
            } else {
                turnoff();
                console.log("turned off from iframe")
            }
        }
    });

    // global state changer
    // NOTHING ELSE NEEDED, injector.js has its own global state listener
    onbutton.onclick = () => {
        console.log("on toggled from popup", !enabled);
        chrome.storage.sync.set({ snoozerEnabled: !enabled });
    }

    // local state changer functions
    function turnon() {
        oncolor.style.backgroundColor = "rgb(119, 57, 255)";
        onbutton.style.left = "";
        onbutton.style.right = "0";

        // // also messages activeTab
        // chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        //     const activeTabId = tabs[0].id;
        //     chrome.tabs.sendMessage(activeTabId, { action: 'activateTab' });
        // });
    }

    function turnoff() {
        oncolor.style.backgroundColor = "rgb(194, 210, 255)";
        onbutton.style.left = "0";
        onbutton.style.right = "";
    }

})
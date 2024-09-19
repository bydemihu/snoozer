// background.js checks for the active tab (all tabs have inject.js, but only the active one has the iframe)

let prevTabId;

function sendMessageToTab(tabId, action) {
    chrome.tabs.sendMessage(tabId, { action: action }, function (response) {
        if (chrome.runtime.lastError) {
            console.warn(`Content script not found in tab ${tabId}: ${chrome.runtime.lastError.message}`);
        } else {
            console.log(`Message '${action}' sent to tab ${tabId}`);
        }
    });
}

// tab creation
chrome.tabs.onCreated.addListener(function (tab) {
    chrome.tabs.onUpdated.addListener(function (tabId, changeInfo) {
        if (tabId === tab.id && changeInfo.status === 'complete') {
            sendMessageToTab(tabId, 'activateTab');
            console.log("sent activateTab on creation");

            // chrome.scripting.executeScript({
            //     target: { tabId: activeInfo.tabId },
            //     files: ['inject.js']
            // });
            console.log("injected inject.js in new tab");
        }
    });
});

// tab activation
chrome.tabs.onActivated.addListener(function (activeInfo) {
    // const activeTabId = activeInfo.tabId;

    sendMessageToTab(activeInfo.tabId, 'activateTab');
    console.log("sent activateTab on switch");

    // add inject.js to the tab (instead of using content script)
    // if(){
    // chrome.scripting.executeScript({
    //     target: { tabId: activeInfo.tabId },
    //     files: ['inject.js']
    // });

    console.log("injected inject.js on existing tab");


    if (prevTabId != activeInfo.tabId) {
        try {
            sendMessageToTab(prevTabId, 'deactivateTab');
            console.log("sent deactivateTab on switch");
        }
        catch {
            console.log("no previous tab");
        }
    }

    prevTabId = activeInfo.tabId;

    // sendMessageToTab(activeTabId, 'activateTab');
    // console.log("sent activateTab on switch");

    // chrome.tabs.query({ windowId: activeInfo.windowId }, function(tabs) {
    //     tabs.forEach(function(tab) {
    //         if (tab.id !== activeTabId) {
    //             sendMessageToTab(tab.id, 'deactivateTab');
    //             console.log("hello deactivated tab")
    //         }
    //     });
    // });
});

// tab updates
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo) {
    if (changeInfo.status === 'complete') {

        sendMessageToTab(tabId, 'activateTab');
        console.log("sent activateTab on reload");

        // chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        //     if (tabs[0].id === tabId) {
        //         sendMessageToTab(tabId, 'activateTab');
        //         console.log("sent activateTab on reload");
        //     }
        // });
    }
});

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
        }
    });
});

// tab activation 
chrome.tabs.onActivated.addListener(function (activeInfo) {

    sendMessageToTab(activeInfo.tabId, 'activateTab');
    console.log("sent activateTab on switch");

    if (prevTabId != activeInfo.tabId) {
        try {
            sendMessageToTab(prevTabId, 'deactivateTab');
            console.log("sent deactivateTab on switch");
        }
        catch {
            console.log("no previous tab");
        }
    }

    // reassign prevTabId to contain current tab
    prevTabId = activeInfo.tabId;
});

// tab updates
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo) {
    if (changeInfo.status === 'complete') {

        sendMessageToTab(tabId, 'activateTab');
        console.log("sent activateTab on reload");
    }
});

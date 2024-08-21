// background.js checks for the active tab (all tabs have inject.js, but only the active one has the iframe)

function sendMessageToTab(tabId, action) {
    chrome.tabs.sendMessage(tabId, { action: action }, function(response) {
        if (chrome.runtime.lastError) {
            console.warn(`Content script not found in tab ${tabId}: ${chrome.runtime.lastError.message}`);
        } else {
            console.log(`Message '${action}' sent to tab ${tabId}`);
        }
    });
}

// tab creation
chrome.tabs.onCreated.addListener(function(tab) {
    chrome.tabs.onUpdated.addListener(function(tabId, changeInfo) {
        if (tabId === tab.id && changeInfo.status === 'complete') {
            sendMessageToTab(tabId, 'activateTab');
        }
    });
});

// tab activation
chrome.tabs.onActivated.addListener(function(activeInfo) {
    const activeTabId = activeInfo.tabId;
    
    sendMessageToTab(activeTabId, 'activateTab');
    
    chrome.tabs.query({ windowId: activeInfo.windowId }, function(tabs) {
        tabs.forEach(function(tab) {
            if (tab.id !== activeTabId) {
                sendMessageToTab(tab.id, 'deactivateTab');
            }
        });
    });
});

// tab updates
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo) {
    if (changeInfo.status === 'complete') {
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            if (tabs[0].id === tabId) {
                sendMessageToTab(tabId, 'activateTab');
            }
        });
    }
});

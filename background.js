// this ONLY runs in the extension!
// background.js injects the injector

console.log("background.js entered")

chrome.action.onClicked.addListener((tab) => {
    console.log("injector.js run")
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['injector.js']
    });
  });
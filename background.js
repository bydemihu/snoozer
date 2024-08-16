// background.js initializes the settings.


// console.log("background.js entered");

// // set/get stored globals

// chrome.storage.sync.get(['snoozerEnabled'], (result) => {
//   if (result.snoozerEnabled === undefined) {
//       chrome.storage.sync.set({ snoozerEnabled: false }, () => {
//           console.log('snoozerEnabled initialized as false.');
//       });
//   }
//   else {
//     console.log('snoozerEnabled retrieved as', result.snoozerEnabled)
//   }
// });

// chrome.storage.sync.get(['snoozerQuieted'], (result) => {
//   if (result.snoozerQuieted === undefined) {
//       chrome.storage.sync.set({ snoozerQuieted: false }, () => {
//           console.log('snoozerQuieted initialized as false.');
//       });
//   }
//   else {
//     console.log('snoozerQuieted retrieved as', result.snoozerQuieted)
//   }
// });

// chrome.storage.sync.get(['snoozerEnabled'], function (result) {
//   on = result.snoozerEnabled || false;
//   console.log("fetched initial snoozerEnabled", on);
// });

// chrome.storage.sync.get(['snoozerQuieted'], function (result) {
//   quiet = result.snoozerQuieted || false;
//   console.log("fetched initial snoozerQuieted", on);
// });

// chrome.storage.sync.get(['snoozerMinimized'], function (result) {
//   minimized = result.snoozerEnabled || false;
//   console.log("fetched initial snoozerMinimized", on);
// });
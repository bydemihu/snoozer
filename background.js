// this ONLY runs in the extension!

fetch(chrome.runtime.getURL('/test.html'))
        .then(response => response.text())
        .then(data => {
            document.getElementById('inject-container').innerHTML = data;
            // other code
            // eg update injected elements,
            // add event listeners or logic to connect to other parts of the app
        }).catch(err => {
            // handle error
        });
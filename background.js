import { main } from './test_data_structure.js';

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "getEmailData") {
    chrome.identity.getAuthToken({ interactive: true }, (token) =>  {
      if (chrome.runtime.lastError) {
        console.error("Error retrieving token:", chrome.runtime.lastError.message);
        sendResponse({ error: chrome.runtime.lastError.message });
      } else {
        console.log(`Take me to${token}`)
        main(token)
        .then((result) => {
          chrome.storage.local.set({ emailData: result}, () => {
            console.log("Email Data Store Successfully: ", result);
            sendResponse({ success: true });
          })
        })
        .catch((error) => {
          console.error("Error in main function:", error);
          sendResponse({ error: error.message });
        });
      }
    });
  }
});


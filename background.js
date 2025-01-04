chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "getEmailData") {
    chrome.identity.getAuthToken({ interactive: true }, (token) =>  {
      if (chrome.runtime.lastError) {
        console.error("Error retrieving token:", chrome.runtime.lastError.message);
        sendResponse({ error: chrome.runtime.lastError.message });
      } else {
        const result = main(token)
        // console.log("Authorization Token:", token)
        sendResponse({ token });
      }
    });
  }
});


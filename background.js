chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "getAuthToken") {
    chrome.identity.getAuthToken({ interactive: true }, (token) => {
      if (chrome.runtime.lastError) {
        console.error("Error retrieving token:", chrome.runtime.lastError.message);
        sendResponse({ error: chrome.runtime.lastError.message });
      } else {
        console.log("OAuth token retrieved:", token);
        sendResponse({ token });
      }
    });
    // Return true to indicate async response
    return true;
  }
});
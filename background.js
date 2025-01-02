chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "found_email_data") {
    console.log("Collected Emails:", message.data);
    chrome.storage.local.set({ emails: message.data });
    sendResponse({ status: "success" });
  }
});
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "emails_data") {
    console.log("Collected Emails:", message.data);
    chrome.storage.local.set({ emails: message.data });
    sendResponse({ status: "success" });
  }
});

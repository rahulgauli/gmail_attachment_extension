chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "email_data") {
    console.log(message.type)
    console.log(message)
    console.log("Collected Emails:", message.data);
    chrome.storage.local.set({ emails: message.data });
    sendResponse({ status: "success" });
  }
});
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "notifyAttachment") {
      const { subject, sender } = message.data;
  
      chrome.notifications.create({
        type: "basic",
        iconUrl: "icon.png",
        title: "Attachment Found",
        message: `Email from ${sender} with subject "${subject}" has an attachment. Click to download.`,
        priority: 2
      });
    }
  });
  
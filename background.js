chrome.runtime.onInstalled.addListener(() => {
  chrome.identity.getAuthToken({ interactive: true }, (token) => {
    if (token) {
      fetchEmailsWithAttachments(token);
    }
  });
});

function fetchEmailsWithAttachments(token) {
  const headers = new Headers({
    Authorization: `Bearer ${token}`,
  });

  // Request to get the list of emails
fetch('https://www.googleapis.com/gmail/v1/users/me/messages', {
  headers: headers})
  .then(response => response.json())
  .then(data => {
    const messages = data.messages;
    if (messages) {
      messages.forEach(message => {
        checkForAttachments(message.id, token);
      });
    }
  });
}

function checkForAttachments(messageId, token) {
  const headers = new Headers({
    Authorization: `Bearer ${token}`,
  });

  fetch(`https://www.googleapis.com/gmail/v1/users/me/messages/${messageId}`, {
    headers: headers
  })
    .then(response => response.json())
    .then(message => {
      const parts = message.payload.parts;
      if (parts) {
        parts.forEach(part => {
          if (part.filename && part.body.attachmentId) {
            console.log(`Email with attachment: ${message.snippet}`);
            // Handle listing emails with attachments here
          }
        });
      }
    });
}

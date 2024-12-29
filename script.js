chrome.runtime.onMessage.addListener((message) => {
  if (message.type === 'emails_with_attachments') {
    const emailListDiv = document.getElementById('email-list');
    message.emails.forEach(email => {
      const emailDiv = document.createElement('div');
      emailDiv.classList.add('email-item');
      emailDiv.innerText = email;
      emailListDiv.appendChild(emailDiv);
    });
  }
});

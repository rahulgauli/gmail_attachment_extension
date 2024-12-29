// Sample email data (replace with actual data from your extension)
const emails = [
    { 
      subject: "Meeting Invitation", 
      sender: "john.doe@example.com", 
      attachments: [
        { name: "Agenda.pdf", url: "path/to/Agenda.pdf" },
        { name: "Minutes.docx", url: "path/to/Minutes.docx" }
      ]
    },
    { 
      subject: "Project Update", 
      sender: "jane.smith@example.com", 
      attachments: [
        { name: "ProgressReport.pdf", url: "path/to/ProgressReport.pdf" }
      ]
    },
    { 
      subject: "Holiday Greetings", 
      sender: "alice.brown@example.com", 
      attachments: [
        { name: "Card.jpg", url: "path/to/Card.jpg" }
      ]
    }
  ];
  
  // Get the email list element
const emailList = document.getElementById('email-list');
  
  // Iterate over the emails and display each
emails.forEach(email => {
const listItem = document.createElement('li');
listItem.classList.add('email-item');

// Create email content
let emailContent = `<strong>${email.subject}</strong><br><span class="sender">${email.sender}</span>`;

// Create attachments section
if (email.attachments && email.attachments.length > 0) {
    let attachments = '<div class="attachments">';
    email.attachments.forEach(att => {
    attachments += `
        <div class="attachment-item">
        <span>${att.name}</span>
        <button class="download-btn" onclick="window.open('${att.url}', '_blank')">Download</button>
        </div>
    `;
    });
    attachments += '</div>';
    emailContent += attachments;
}

listItem.innerHTML = emailContent;
emailList.appendChild(listItem);
});

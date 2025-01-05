async function downloadAttachment(userId, messageId, attachmentId) {
  const url = `https://gmail.googleapis.com/gmail/v1/users/${userId}/messages/${messageId}/attachments/${attachmentId}`;
  try {
    const token = await new Promise((resolve, reject) => {
      chrome.identity.getAuthToken({ interactive: true }, (token) => {
        if (chrome.runtime.lastError) {
          reject(new Error("Error Retrieving Token: " + chrome.runtime.lastError.message));
        } else {
          console.log("Token Received");
          resolve(token);
        }
      });
    });
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch attachment");
    }
    const data = await response.json();
    if (!data.data) {
      throw new Error("Attachment data not found");
    }
    let fileData = data.data.replace(/-/g, '+').replace(/_/g, '/');
    const padding = fileData.length % 4;
    if (padding) {
      fileData += '='.repeat(4 - padding);
    }
    const decodedData = atob(fileData);
    const blob = new Blob([new Uint8Array(decodedData.split("").map(char => char.charCodeAt(0)))], { type: 'application/octet-stream' });
    const downloadUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = "attachment";  
    a.click();
    URL.revokeObjectURL(downloadUrl);
  } catch (error) {
    console.error("Error downloading attachment:", error);
  }
}


document.addEventListener("DOMContentLoaded", () => {
    let processedEmails = 0;
    const introVideo = document.getElementById("intro-video");
    const emailDataDiv = document.getElementById("email-data");
    const openButton = document.querySelector(".open-button")
    chrome.storage.local.get("emailData", (result) => {
      const email_data = result.emailData || [];
      email_data.forEach((email)=>{
        const emailItem = document.createElement("div");
        emailItem.className = "email-item";
        const sender = document.createElement("p");
        sender.textContent = `Sender:${email.from}`;
        sender.className = "email-sender";

        const subject = document.createElement("p");
        subject.textContent = `Subject: ${email.subject}`;
        subject.className = "email-subject";

        const downloadButton = document.createElement('button');
        downloadButton.classList.add('download-button');
        downloadButton.textContent = 'Download';
        downloadButton.onclick = async function () {
          await downloadAttachment(email.to, email.messageID, email.attahcmentId);
        };

        emailItem.appendChild(sender);
        emailItem.appendChild(subject);
        emailItem.appendChild(downloadButton);
        emailDataDiv.append(emailItem);
        processedEmails++;

        if (processedEmails == email_data.length){
          openButton.disabled = false;
          openButton.style.backgroundColor = "#4CAF50"; // Green
          openButton.style.cursor = "pointer";
          openButton.style.opacity = "1";
          openButton.addEventListener("click", ()=> {
            introVideo.style.display = "none";
            emailDataDiv.style.display = "block";
          })
        }
      })

  })
})
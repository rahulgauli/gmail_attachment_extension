document.addEventListener("DOMContentLoaded", () => {
    const emailDataDiv = document.getElementById("email-data");
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

        emailItem.appendChild(sender);
        emailItem.appendChild(subject);

        emailDataDiv.append(emailItem);
      })
  })
})

document.addEventListener("DOMContentLoaded", () => {
    const emailDataDiv = document.getElementById("email-data");
  
    chrome.storage.local.get("emails", (result) => {
      const { emails } = result.emails || null;

      if (emails) {
        emails.forEach(({ sender, subject, auth_token }) => {
          const emailItem = document.createElement("div");
          emailItem.innerText = `Sender: ${sender}, Subject: ${subject}, Auth Token: ${auth_token}`;
          emailDataDiv.appendChild(emailItem);
        });
      } else {
        emailDataDiv.innerText = "No emails collected yet.";
      }
    });
  });
  
document.addEventListener("DOMContentLoaded", () => {
    const emailDataDiv = document.getElementById("email-data");
  
    // Retrieve the emails from Chrome's local storage
    chrome.storage.local.get("emails", (result) => {
      const { emails } = result || {};
      console.log(result)
      if (emails && emails.length > 0) {
        noEmailsMessage.style.display = "none";  // Hide the "No emails collected yet" message if emails are present
        emails.forEach(({ sender, subject }) => {
          // Create a new email item
          const emailItem = document.createElement("li");
          emailItem.classList.add("email-item");
  
          const senderElement = document.createElement("div");
          senderElement.classList.add("email-sender");
          senderElement.innerText = sender;
  
          const subjectElement = document.createElement("div");
          subjectElement.classList.add("email-subject");
          subjectElement.innerText = subject;
  
          emailItem.appendChild(senderElement);
          emailItem.appendChild(subjectElement);
          emailDataDiv.appendChild(emailItem);
        });
      } else {
        console.log("not found")  // Show the "No emails collected yet" message if no emails are found
      }
    });
  });
async function collectEmails() {
    const emailData = [];
    const emailRows = document.querySelectorAll(".zA");
    const auth_token = await getAuthTokenAndFetchEmailData()
    emailRows.forEach((row) => {
      const subject = row.querySelector(".bog")?.innerText || "No Subject";
      const sender = row.querySelector(".yX.xY span")?.innerText || "No Sender";
      emailData.push({ sender, subject, auth_token });
    });
  
    return { emails: emailData };
  }
  
  setInterval(() => {
    const data = collectEmails();
    chrome.runtime.sendMessage({ type: "emails_data", data }, (response) => {
      if (response.status === "success") {
        console.log("Email data sent successfully.");
      }
    });
  }, 10000);

function getAuthTokenAndFetchEmailData() {
    return new Promise((resolve, reject) => {
      chrome.identity.getAuthToken({ interactive: true }, (token) => {
        if (chrome.runtime.lastError) {
          reject(`Auth error: ${chrome.runtime.lastError.message}`);
          return;
        }
        if (!token) {
          reject("Failed to retrieve access token.");
          return;
        }
        console.log("Access token retrieved:", token);
        resolve(token);
    });
});
}

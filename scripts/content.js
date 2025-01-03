function getAuthToken() {
  return new Promise((resolve, reject) => {
    chrome.identity.getAuthToken((token) => {
      if (chrome.runtime.lastError || !token) {
        console.error("Failed to retrieve access token:", chrome.runtime.lastError?.message);
        reject(chrome.runtime.lastError || new Error("Failed to get token"));
      } else {
        console.log("Access token retrieved:", token);
        resolve(token);
      }
    });
  });
}

async function collectEmails() {
  const emailData = [];
  try {
    const authToken = await getAuthToken();
    // Fetch inbox emails here (e.g., const emailRows = await fetchInboxEmails(authToken))
    emailData.push(authToken); // Add auth token for now, replace with emailRows later
    return { emails: emailData };
  } catch (error) {
    console.error("Error in collectEmails:", error);
    return { emails: [] }; // Return an empty array if an error occurs
  }
}


setInterval(async () => {
  try {
    const data = await collectEmails();
    chrome.runtime.sendMessage({ type: "email_data", data }, (response) => {
      if (chrome.runtime.lastError) {
        console.error("Error sending message:", chrome.runtime.lastError.message);
      } else if (response?.status === "success") {
        console.log("Email data sent successfully.");
      } else {
        console.warn("Unexpected response:", response);
      }
    });
  } catch (error) {
    console.error("Error in setInterval:", error);
  }
}, 10000);
async function get_list_of_emails(token) {
  const email_list = await fetch(
    "https://www.googleapis.com/gmail/v1/users/me/messages",{
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  if (email_list.ok){
    const email_data = await email_list.json();
    console.log("Gmail API response:", email_data);
    return email_data
  } else {
    console.error("Gmail API Error:", await email_list.text())
    return "No Email Found"
  }
};



chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "getAuthToken") {
    chrome.identity.getAuthToken({ interactive: true }, (token) => {
      if (chrome.runtime.lastError) {
        console.error("Error retrieving token:", chrome.runtime.lastError.message);
        sendResponse({ error: chrome.runtime.lastError.message });
      } else {
        sendResponse({ token });
      }
    });
    return true;
  }
  if (message.type === "getEmailData") {
    const token = message.token;
    if (token) {
      get_list_of_emails(token)
        .then((email_data) => {
          console.log(email_data)
          sendResponse({ data: email_data });
        })
        .catch((error) => {
          sendResponse({ error: error.message });
        });
    } else {
      sendResponse({ error: "No token provided" });
    }
    return true;
  }
});


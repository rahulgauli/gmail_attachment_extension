async function getAuthToken() {
  return new Promise((resolve, reject) => {
    chrome.identity.getAuthToken({ interactive: true }, (token) => {
      if (chrome.runtime.lastError) {
        console.log("Error encountered:", chrome.runtime.lastError.message);
        return reject(new Error("Authentication failed due to: " + chrome.runtime.lastError.message)); // Reject with an error message
      }

      if (!token) {
        console.log("No token received.");
        return reject(new Error("Failed to retrieve access token.")); // Reject if no token was received
      }

      console.log("Access token retrieved:", token);
      resolve(token);
    });
  });
}

async function fetchEmailList(token) {
  try {
    const emailListResponse = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!emailListResponse.ok) {
      throw new Error(`Failed to fetch email list: ${emailListResponse.statusText}`);
    }

    const emailListData = await emailListResponse.json();
    if (!emailListData.messages || emailListData.messages.length === 0) {
      return "No messages found.";
    }

    return emailListData.messages; // Return only the message IDs
  } catch (error) {
    console.error("Error fetching email list:", error.message);
    throw error;
  }
}

async function fetchEmailDetails(emailId, token) {
  try {
    const messageResponse = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${emailId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!messageResponse.ok) {
      throw new Error(`Failed to fetch message details: ${messageResponse.statusText}`);
    }

    const messageData = await messageResponse.json();
    const headers = messageData.payload.headers;
    const fromHeader = headers.find((header) => header.name === "From");
    const subjectHeader = headers.find((header) => header.name === "Subject");

    return {
      sender: fromHeader ? fromHeader.value : "Unknown Sender",
      subject: subjectHeader ? subjectHeader.value : "No Subject",
    };
  } catch (error) {
    console.error("Error fetching message details:", error.message);
    throw error;
  }
}

async function fetchInboxEmails(token) {
  try {
    // Step 1: Get the email list (IDs)
    const emailList = await fetchEmailList(token);
    if (typeof emailList === "string") {
      return emailList;
    }

    const emailDetailsPromises = emailList.map(async (message) => {
      const emailDetails = await fetchEmailDetails(message.id, token);
      return emailDetails;
    });

    const emailDetails = await Promise.all(emailDetailsPromises);

    console.log("Inbox Emails (Sender and Subject):", emailDetails);
    return emailDetails;

  } catch (error) {
    console.error("Error fetching inbox emails:", error.message);
    throw error;
  }
}

async function collectEmails() {
  const emailData = [];
  const auth_token = await getAuthToken()
  const emailRows = await fetchInboxEmails(auth_token);
  emailData.push({emailRows});
  return { emails: emailData };
}


setInterval(async () => { 
  try {
    const data = await collectEmails();
    // const data = {"Hennesy":"mota"};
    chrome.runtime.sendMessage({ type: "found_email_data", data }, (response) => {
      if (response.status === "success") {
        console.log("Email data sent successfully.");
      }
    });
  } catch (error) {
    console.error("Error in setInterval:", error);
  }
}, 10000);
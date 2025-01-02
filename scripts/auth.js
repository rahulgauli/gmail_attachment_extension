async function getAuthToken() {
    return new Promise((resolve, reject) => {
      chrome.identity.getAuthToken({ interactive: true }, (token) => {
        if (chrome.runtime.lastError) {
          return reject(`Auth error: ${chrome.runtime.lastError.message}`);
        }
  
        if (!token) {
          return reject("Failed to retrieve access token.");
        }
  
        console.log("Access token retrieved:", token);
        resolve(token);
      });
    });
  }

async function fetchInboxEmails(token) {
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
      const emailDetailsPromises = emailListData.messages.map(async (message) => {
        const messageResponse = await fetch(
          `https://gmail.googleapis.com/gmail/v1/users/me/messages/${message.id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
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
      });
      const emailDetails = await Promise.all(emailDetailsPromises);
      console.log("Inbox Emails (Sender and Subject):", emailDetails);
      return emailDetails;
    } catch (error) {
      console.error("Error fetching inbox emails:", error.message);
      throw error;
    }
  }
  
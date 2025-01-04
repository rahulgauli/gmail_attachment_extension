if (window.location.hostname === "mail.google.com") {
  console.log("Content script running on Gmail.");  
  chrome.runtime.sendMessage({ type: "getEmailData" }, (response) => {
    if (response.token) {
      chrome.runtime.sendMessage({ type: "getEmailData", token: response.token }, (emailResponse) => {
        if (emailResponse.data) {
          console.log("Emails:", emailResponse.data);
        } else {
          console.error("Error fetching emails:", emailResponse.error);
        }
      });
    } else {
      console.error("Error retrieving token:", response.error);
    }
  });}
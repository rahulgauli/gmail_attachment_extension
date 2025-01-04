if (window.location.hostname === "mail.google.com") {
  console.log("Content script running on Gmail.");  
  chrome.runtime.sendMessage({ type: "getEmailData" }, (response) => {
    if (response) {
      console.log("Success", response)
    } else {
      console.error("Error retrieving token:", response.error);
    }
  });}
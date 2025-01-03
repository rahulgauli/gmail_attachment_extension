if (window.location.hostname === "mail.google.com") {
  console.log("Content script running on Gmail.");  
  chrome.runtime.sendMessage({ type: "getAuthToken" }, (response) => {
    if (response.error) {
      console.error("Error retrieving token:", response.error);
    } else {
      console.log("OAuth Token:", response.token);
      // Perform actions with the token (e.g., Gmail API calls)
    }
  });
}
console.log(response);
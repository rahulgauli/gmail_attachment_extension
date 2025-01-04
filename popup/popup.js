document.addEventListener("DOMContentLoaded", () => {
    const emailDataDiv = document.getElementById("email-data");
    chrome.storage.local.get("emails", (result) => {
    console.log(result)
    })})

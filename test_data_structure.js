let all_email = [ ]

const baseUrl = 'https://www.googleapis.com/gmail/v1/users/me/messages';


async function getMailData(auth_token, pageToken=null) {
    try{
        const request_data = {
            method: "GET",
            headers: {"Authorization": `Bearer ${auth_token}`}};
        const url = pageToken ? `${baseUrl}?pageToken=${pageToken}&maxResults=100` : `${baseUrl}?maxResults=100`;
        const response = await fetch(url, request_data);
        if (response.ok){return await response.json();}
        else {throw new Error("Error Making API call to GMAIL");}}
    catch {
        error => {console.error("Error:", error);}}
}


async function fetchAllMessages(auth_token){
    let allMessages = [];
    let pageToken = null;
    do {
        const emaildata = await getMailData(auth_token, pageToken);
        for ( let a_message of emaildata.messages){
            allMessages.push(a_message.id);
        };
        pageToken = emaildata.nextPageToken;
    }
    while (pageToken);
    return allMessages;
};


async function filterAllEmail(all_email_id, auth_token){
    const request_data = {
        method: "GET",
        headers: {"Authorization": `Bearer ${auth_token}`}};
    const baseUrl = "https://gmail.googleapis.com/gmail/v1/users/me/messages";
    let messagesDetails = []
    for (let an_email_id of all_email_id){
        let url = `${baseUrl}/${an_email_id}`
        const response = await fetch(url, request_data)
        if (response.ok){
            messagesDetails.push(await response.json())
        }
        else {
            throw new Error(`Error: ${response.status} ${response.statusText}`)
        }
    };
    return messagesDetails;
};

async function get_data_from_headers(headers, attachmentId){
    try{
        const response = {attahcmentId:attachmentId}
        for (const header of headers){
            if (header.name === "From"){
                response.from = header.value
            }
            if (header.name === "Subject"){
                response.subject = header.value
            }
        }
        return response
    }
    catch{
        error => {console.error(error)}
    }
}


async function collect_sender_subject(emails) {
    try {
        const result = [];
        for (const email of emails) {
            if (email.payload.mimeType === "multipart/mixed") {
                for (const part_item of email.payload.parts) {
                    if (part_item.filename !== "") {
                        const an_email_data = await get_data_from_headers(email.payload.headers, part_item.body.attachmentId);
                        result.push(an_email_data);
                    }
                }
            }
        }
        return result;
    } catch (error) {
        console.error("Error:", error);
    }
}


async function main(auth_token){
    const all_messages = await fetchAllMessages(auth_token)
    const filteredMessages = await filterAllEmail(all_messages, auth_token)
    const result = await collect_sender_subject(filteredMessages)
    console.log(result)
    return result
}

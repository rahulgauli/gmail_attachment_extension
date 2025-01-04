let all_email = [ ]

const auth_token = "Add your token here"
const baseUrl = 'https://www.googleapis.com/gmail/v1/users/me/messages';


async function getMailData(pageToken=null) {
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


async function fetchAllMessages(){
    let allMessages = [];
    let pageToken = null;
    do {
        const emaildata = await getMailData(pageToken);
        for ( let a_message of emaildata.messages){
            allMessages.push(a_message.id);
        };
        pageToken = emaildata.nextPageToken;
    }
    while (pageToken);
    return allMessages;
};


async function filterAllEmail(all_email_id){
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


async function main(){
    const collected_data = []
    const all_messages = await fetchAllMessages()
    const filteredMessages = await filterAllEmail(all_messages)
    filteredMessages.forEach(item => {
        if (item.payload.mimeType === "multipart/mixed"){
            item.payload.parts.forEach(part_item => {
                if (part_item.filename != ""){
                    item.payload.headers.forEach(header =>{
                        const temp_data = {}
                        if (header.name === "From"){
                            console.log(header.value)
                            temp_data.from = header.value
                        }
                        if (header.name === "Subject"){
                            console.log(header.value)
                            temp_data.as = header.value
                        }
                        if (Object.keys(temp_data).length > 2){
                            console.log(temp_data)
                        }
                    })
                }
            })
        };
    })
    console.log(collected_data)
}


    main()
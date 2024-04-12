const BASE_URL = 'http://localhost:8000'; 

async function sendMessageToBot(message){
    const response = await fetch(`${BASE_URL}/message`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ "message":  message })
    }); 

    if (!response.ok){
        throw new Error('Network response was not ok ' + response.statusText)
    }

    return response.json();
}

export { sendMessageToBot };
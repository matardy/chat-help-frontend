const BASE_URL = 'http://54.226.248.161:8001';

async function startConversation() {
    const userId = 123;
    const conversationResponse = await fetch(`${BASE_URL}/chat/conversation/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: userId })
    });

    if (!conversationResponse.ok) {
        throw new Error('Failed to start conversation: ' + conversationResponse.statusText);
    }

    const { id: conversationId } = await conversationResponse.json();
    return conversationId;
}

async function sendMessageToBot(message) {
    const conversationId = 2;

    const response = await fetch(`${BASE_URL}/chat/message?session_id=123&conversation_id=${conversationId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: message })
    });

    if (!response.ok) {
        throw new Error('Network response was not ok: ' + response.statusText);
    }

    return response.json();
}

export { sendMessageToBot };

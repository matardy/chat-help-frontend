<template>
  <div class="chat-container">
    <header class="header">
      <h1>Asistente Legal - ChatBot</h1>
    </header>
    <main class="chat-display">
      <div
        class="message"
        :class="{ user: msg.isUser, bot: !msg.isUser }"
        v-for="(msg, index) in messages"
        :key="index" >

        <p v-html="formatMessage(msg.text)"></p>

      </div>
    </main>
    <div class="input-area">
      <textarea 
        v-model="newMessage" 
        class="message-input" 
        placeholder="Type a message" 
        rows="1"
        @keyup.enter.prevent="handleEnter" 
        ></textarea>
      <button @click="sendMessage" class="send-button">Send</button>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { sendMessageToBot } from '../services/apiService';




export default {
  setup() {
    const newMessage = ref('')
    const messages = ref([])

    const formatMessage = (text) => {
      // Replace markdown-like bold syntax with HTML <strong> tags
      let formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      // Replace newlines with HTML <br> tags
      formattedText = formattedText.replace(/\n/g, '<br>');
      return formattedText;
    };

    const sendMessage = async () => {
      // delete messages first

      const trimmedMessage = newMessage.value.trim();
      if (trimmedMessage) {
        messages.value.push({ text: trimmedMessage ,isUser: true});
        newMessage.value = '';
        
        try {
            const botResponse = await sendMessageToBot(trimmedMessage);
            messages.value.push({ text: botResponse.response, isUser: false }); 
        } catch (error) {
            messages.value.push({ text: 'Error al conectar con el bot', isUser: false });
        }
        
        
      }
    };

    // Handle shift+enter 
    const handleEnter = (event) => {
      if (event.shiftKey) {
        // Allow Shift+Enter to insert a new line without sending the message
        event.preventDefault();
      } else {
        // Prevent the default enter behavior and send the message
        event.preventDefault();
        sendMessage();
      }
    };

    return { newMessage, messages, sendMessage, handleEnter, formatMessage}
  }
}
</script>

<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  height: 100vh; /* Full viewport height */
  width: 100vw; /* Full viewport width */
  background-color: #fff;
}

.header {
  background-color: #f3f4f6;
  padding: 1rem;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.chat-display {
  flex-grow: 1;
  padding: 1rem;
  overflow-y: auto;
}

.message {
  display: block;
  clear: both;
  padding: 10px 15px;
  margin: 10px 0;
  border-radius: 18px;
  word-wrap: break-word; /* Ensures text wraps to prevent overflow */
  max-width: 80%; /* Restrict maximum width */
  min-width: 20%; /* Minimum width for very short messages */
}

.user, .bot {
  background-color: #e5e7eb;
  float: right; /* Aligns user messages to the right */
  color: #333; /* Text color for better readability */
}

.bot {
  background-color: #d1d5db;
  float: left; /* Aligns bot messages to the left */
  color: #333;
}

.input-area {
  height: 10%;
  display: flex;
  padding: 10px;
  background-color: #f3f4f6;
}

.message-input {
  flex-grow: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 18px;
  margin-right: 10px;
  outline: none;
  resize: none; /* Prevent manual resizing */
  overflow: hidden;
}


.send-button {
  padding: 10px 20px;
  background-color: #4caf50;
  border: none;
  border-radius: 18px;
  color: white;
  cursor: pointer;
}

.send-button:hover {
  background-color: #45a049;
}

.send-button:active {
  background-color: #397d35;
}
</style>

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
        :key="index"
      >
        <p>{{ msg.text }}</p>
      </div>
    </main>
    <div class="input-area">
      <input v-model="newMessage" class="message-input" placeholder="Type a message" />
      <button @click="sendMessage" class="send-button">Send</button>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup() {
    const newMessage = ref('')
    const messages = ref([])

    const sendMessage = () => {
      if (newMessage.value.trim()) {
        messages.value.push({ text: newMessage.value, isUser: true })
        newMessage.value = '' // Clear the input
        // Simulate a bot response
        setTimeout(() => messages.value.push({ text: 'Bot is working', isUser: false }), 500)
      }
    }

    return { newMessage, messages, sendMessage }
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
  max-width: 80%;
}

.user {
  background-color: #e5e7eb;
  margin-right: 0;
  margin-left: auto;
}

.bot {
  background-color: #d1d5db;
  margin-left: 0;
  margin-right: auto;
}

.input-area {
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

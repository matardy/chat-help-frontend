<template>
  <div class="chat-container">
    <header class="header">
      <h1 class="text-2xl">Asistente Legal - ChatBot</h1>
    </header>
    <!-- MESSAGES -->
    <main class="chat-display">
      <div
        class="message bg-blue-500 text-white p-2 rounded-lg max-w-xs"
        :class="{ user: msg.isUser, bot: !msg.isUser }"
        v-for="(msg, index) in messages"
        :key="index"
      >
        <p v-html="formatMessage(msg.text)"></p>
      </div>
    </main>
    <!-- BUTTON -->
    <div class="flex px-4 py-2 bg-gray-100 border-t">
      <input
        type="text"
        class="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Escribe tu mensaje..."
        v-model="newMessage"
        rows="1"
        @keyup.enter.prevent="handleEnter"
      />
      <button
        @click="sendMessage"
        class="ml-2 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="icon icon-tabler icons-tabler-outline icon-tabler-send-2"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path
            d="M4.698 4.034l16.302 7.966l-16.302 7.966a.503 .503 0 0 1 -.546 -.124a.555 .555 0 0 1 -.12 -.568l2.468 -7.274l-2.468 -7.274a.555 .555 0 0 1 .12 -.568a.503 .503 0 0 1 .546 -.124z"
          />
          <path d="M6.5 12h14.5" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { sendMessageToBot } from '../services/apiService'

export default {
  setup() {
    const newMessage = ref('')
    const messages = ref([])

    const formatMessage = (text) => {
      if (typeof text !== 'string') {
        return text
      }
      // Replace markdown-like bold syntax with HTML <strong> tags
      let formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // Replace newlines with HTML <br> tags
      formattedText = formattedText.replace(/\n/g, '<br>')
      return formattedText
    }

    const sendMessage = async () => {
      // delete messages first

      const trimmedMessage = newMessage.value.trim()
      if (trimmedMessage) {
        messages.value.push({ text: trimmedMessage, isUser: true })
        newMessage.value = ''

        try {
          const botResponse = await sendMessageToBot(trimmedMessage)
          messages.value.push({ text: botResponse.response.answer, isUser: false })
        } catch (error) {
          messages.value.push({ text: 'Error al conectar con el bot', isUser: false })
        }
      }
    }

    // Handle shift+enter
    const handleEnter = (event) => {
      if (event.shiftKey) {
        // Allow Shift+Enter to insert a new line without sending the message
        event.preventDefault()
      } else {
        // Prevent the default enter behavior and send the message
        event.preventDefault()
        sendMessage()
      }
    }

    return { newMessage, messages, sendMessage, handleEnter, formatMessage }
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

.user,
.bot {
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

<template>
  <div class="chat-container">
    <ContextModal :currentMessage="currentMessage" :context="modalContext" :visible="isModalVisible"  @update:visible="isModalVisible = $event" />
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
        <!-- Place the "Ver mas" link and document reference at the button of the chat bubble-->
        <div class="context-link" v-if="msg.context && msg.context.length">
        <span>{{ msg.context[0].source.split('/').pop() }} - página {{ msg.context[0].page }}</span>
        <a href="#" @click="showModal(index)">Ver más</a>
        </div>

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
import ContextModal from './ContextModal.vue';

export default {
  components: {
    ContextModal
  },
  setup() {
    const newMessage = ref('')
    const messages = ref([])

    const isModalVisible = ref(false); 
    const modalContext = ref([]); 
    const currentMessage = ref('')

    const showModal = (messageIndex) => {
      modalContext.value = messages.value[messageIndex].context;
      currentMessage.value = messages.value[messageIndex].text
      isModalVisible.value = true; 
    };

    const closeModal = () => {
      isModalVisible.value = false;
    };

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
            console.log("Response: ", botResponse.response.answer)
            console.log("COntext: ", botResponse.response.context)
            messages.value.push({ text: botResponse.response.answer, isUser: false, context: botResponse.response.context }); 
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

    return { newMessage, messages, sendMessage, handleEnter, formatMessage, showModal, isModalVisible, modalContext, closeModal, currentMessage};
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

/* context styles */
.context-link {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px; /* Spacing from the main text */ 
  font-size: 0.75rem /* Smaller texto for the context reference */ 
}

.context link a {
  cursor: pointer;
  text-decoration: underline; 
  color: #0066cc; /* Styling for link */
}
</style>

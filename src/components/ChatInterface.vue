<template>
  <title>Hola</title>
  <div class="chat-container">
    <ContextModal
      :currentMessage="currentMessage"
      :context="modalContext"
      :visible="isModalVisible"
      @update:visible="isModalVisible = $event"
    />
    <header class="header">
      <h1 class="text-2xl">Asistente Legal - ChatBot</h1>
    </header>
    <!-- MESSAGES -->
    <div class="chat-container w-full max-w-3xl mx-auto overflow-hidden">
      <main class="chat-display p-4 flex-1 overflow-y-auto no-scrollbar">
        <div
          class="message bg-blue-500 text-white p-2 rounded-lg max-w-xs"
          :class="{ user: msg.isUser, bot: !msg.isUser }"
          v-for="(msg, index) in messages"
          :key="index"
        >
          <p v-if="!msg.isLoader" v-html="formatMessage(msg.text)"></p>
          <div v-if="msg.isLoader" class="loader"></div>
          <!-- Place the "Ver mas" link and document reference at the button of the chat bubble-->
          <div class="context-link" v-if="msg.context && msg.context.length">
            <span
              >{{ msg.context[0].source.split('/').pop() }} - página {{ msg.context[0].page }}</span
            >
            <a
              class="ml-2 p-2 bg-blue-200 hover:bg-blue-300 transition-colors duration-300 rounded-full"
              href="#"
              @click="showModal(index)"
              >Ver más</a
            >
          </div>
        </div>
      </main>
      <!-- INPUT AREA -->
      <div class="flex px-4 py-2">
        <textarea
          @input="adjustTextarea"
          class="w-full p-2 rounded-lg overflow-hidden resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 border"
          placeholder="Escribe tu mensaje..."
          rows="1"
          v-model="newMessage"
          @keyup.enter.prevent="handleEnter"
        ></textarea>
        <button
          @click="sendMessage"
          class="ml-2 p-2 text-blue-500 hover:bg-blue-200 transition-colors duration-300 rounded-full"
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
  </div>
</template>

<script>
import { ref } from 'vue'
import { sendMessageToBot } from '../services/apiService'
import ContextModal from './ContextModal.vue'

export default {
  components: {
    ContextModal
  },
  setup() {
    const newMessage = ref('')
    const messages = ref([])

    const isModalVisible = ref(false)
    const modalContext = ref([])
    const currentMessage = ref('')

    const isLoading = ref(false)

    const showModal = (messageIndex) => {
      modalContext.value = messages.value[messageIndex].context
      currentMessage.value = messages.value[messageIndex].text
      isModalVisible.value = true
    }

    const closeModal = () => {
      isModalVisible.value = false
    }

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
      const trimmedMessage = newMessage.value.trim()
      if (trimmedMessage) {
        messages.value.push({ text: trimmedMessage, isUser: true })
        newMessage.value = ''

        isLoading.value = true
        messages.value.push({ text: '', isUser: false, isLoader: true })

        try {
          const botResponse = await sendMessageToBot(trimmedMessage)

          replaceLoaderWithMessage({
            text: botResponse.response.answer,
            isUser: false,
            context: botResponse.response.context,
          })
        } catch (error) {
          replaceLoaderWithMessage({
            text: 'Error al conectar con el bot',
            isUser: false,
          })
        } finally {
          isLoading.value = false
        }
      }
    }

    const replaceLoaderWithMessage = (newMessage) => {
      const loaderIndex = messages.value.findIndex((msg) => msg.isLoader)

      if (loaderIndex !== -1) {
        messages.value.splice(loaderIndex, 1, newMessage)
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

    return {
      newMessage,
      messages,
      sendMessage,
      handleEnter,
      formatMessage,
      showModal,
      isModalVisible,
      modalContext,
      closeModal,
      currentMessage,
      isLoading
    }
  },
  methods: {
    adjustTextarea(event) {
      const textarea = event.target
      textarea.style.height = 'auto'
      textarea.style.height =
        textarea.scrollHeight <= 5 * parseFloat(getComputedStyle(textarea).lineHeight)
          ? textarea.scrollHeight + 'px'
          : 5 * parseFloat(getComputedStyle(textarea).lineHeight) + 'px'
    }
  },
  mounted() {
    document.title = 'Asistente Legal - ChatBot'
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
  /* background-color: #f3f4f6; */
  color: #878a8e;
  padding: 1rem;
  text-align: center;
  /* box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); */
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
  min-width: 5%; /* Minimum width for very short messages */
}

.user {
  background-color: #bfdbfe;
  text-align: end;
  float: right;
  color: #333;
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
  font-size: 0.75rem; /* Smaller texto for the context reference */
}

.context link a {
  cursor: pointer;
  text-decoration: underline;
  color: #0066cc; /* Styling for link */
}

.loader {
  width: 30px;
  aspect-ratio: 2;
  --_g: no-repeat radial-gradient(circle closest-side, #0066cc 90%, #0000);
  background:
    var(--_g) 0% 50%,
    var(--_g) 50% 50%,
    var(--_g) 100% 50%;
  background-size: calc(100% / 3) 50%;
  animation: l3 1s infinite linear;
}
@keyframes l3 {
  20% {
    background-position:
      0% 0%,
      50% 50%,
      100% 50%;
  }
  40% {
    background-position:
      0% 100%,
      50% 0%,
      100% 50%;
  }
  60% {
    background-position:
      0% 50%,
      50% 100%,
      100% 0%;
  }
  80% {
    background-position:
      0% 50%,
      50% 50%,
      100% 100%;
  }
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.no-scrollbar {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}
</style>

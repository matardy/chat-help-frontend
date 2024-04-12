<template>
  <ChatLayout>
    <ChatInterface />
  </ChatLayout>
</template>

<script>
import ChatLayout from './components/ChatLayout.vue'
import ChatInterface from './components/ChatInterface.vue'

export default {
  name: 'App',
  components: {
    ChatLayout,
    ChatInterface
  }
}
</script>

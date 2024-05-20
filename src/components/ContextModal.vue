<template>
  <div v-if="visible" class="modal-overlay" @click.self="closeModal">
    <div class="modal-window">
      <div class="modal-header">
        <button class="close-button ml-2 p-2 bg-blue-200 hover:bg-blue-300 transition-colors duration-300 rounded-full" @click="closeModal">
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
            class="icon icon-tabler icons-tabler-outline icon-tabler-x"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M18 6l-12 12" />
            <path d="M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div class="current-msg">
        <div class="message">
          <p>{{ currentMessage }}</p>
        </div>
      </div>
      <div class="modal-body">
        <div v-for="(content, index) in context" :key="index">
          <h3>Page {{ content.page }}</h3>
          <p>{{ content.page_content }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    currentMessage: String,
    context: Array,
    visible: Boolean
  },
  emits: ['update:visible'],
  setup(props, { emit }) {
    const closeModal = () => {
      emit('update:visible', false)
    }
    return { closeModal }
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 10000; /* Asegúrate de que este valor es más alto que cualquier otro en la página */
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-window {
  position: relative;
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 90%;
  max-height: 90%;
  display: flex;
  flex-direction: column;
  overflow: hidden; /* Evita el desbordamiento externo */
  z-index: 10001; /* Asegúrate de que es mayor que el overlay */
}

.modal-header {
  display: flex;
  justify-content: flex-end;
}

.close-button {
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
}
.current-msg {
  padding: 10px;
  border-bottom: 1px solid #ccc; /* Estilo opcional para separar secciones */
}

.message {
  background-color: #e5e7eb;
  padding: 10px;
  border-radius: 18px;
  word-wrap: break-word;
  margin-bottom: 10px; /* Espacio antes del contenido desplazable */
}

.modal-body {
  overflow-y: auto; /* Permite desplazamiento solo en esta sección */
  max-height: calc(100% - 100px); /* Ajusta según sea necesario */
  padding: 10px;
}
</style>

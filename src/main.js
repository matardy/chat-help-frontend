import { createApp } from 'vue'
import App from './App.vue'
//import './assets/global.css';
import './styles.css'

// Importar Google Fonts directamente en el archivo JavaScript
const link = document.createElement('link');
link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=Merriweather:wght@400;700&family=Fira+Code:wght@400;700&display=swap';
link.rel = 'stylesheet';
document.head.appendChild(link);
  
createApp(App).mount('#app')

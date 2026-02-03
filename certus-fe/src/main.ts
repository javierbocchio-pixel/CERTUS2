import { createApp } from 'vue';
import App from './App.vue';
import { registerPlugins } from './app';
import '@mdi/font/css/materialdesignicons.css';
import 'vuetify/styles';
import './styles/main.scss';

const app = createApp(App);

registerPlugins(app);

app.mount('#app');

import { createApp } from 'vue';
import { createHead } from '@unhead/vue';

import App from '@/App.vue';
import router from '@/router';

// css resetting
import 'normalize.css';
import 'reset-css/reset.css';

const app = createApp(App);
const head = createHead();

app.use(router);
app.use(head);

app.mount('#app');

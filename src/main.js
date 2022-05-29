import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import VueRouter from 'vue-router';
import {store} from "./store/store.js"
import axios from "axios";
import Chartkick from 'vue-chartkick'
import Chart from 'chart.js'
// import {routes} from "./routes/routes.js"
import {router} from "./routes/routes.js"
import VueSweetalert2  from  'vue-sweetalert2' ;
import 'sweetalert2/dist/sweetalert2.min.css';

Vue.use( VueSweetalert2 ) ;
Vue.use(Chartkick.use(Chart));
Vue.use(VueRouter);
Vue.config.productionTip = false

/* const router = new VueRouter ({
  routes,
  mode:"history"
}) */

axios.defaults.baseURL="http://localhost:5000/api/"
//axios.defaults.baseURL="https://app-inventario-venta.herokuapp.com/api/"
new Vue({
  vuetify,
  store,
  router,
  render: h => h(App),
  
}).$mount('#app')

/* router.beforeEach((to, from, next) =>{
  if (!store.state.token && to.path != "/"){
    next("/");
  }else{
    next();
  }
}) */
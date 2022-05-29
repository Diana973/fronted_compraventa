import login from '../pages/Login.vue'
import inicio from '../pages/Inicio.vue'
import categorias from '../pages/Categorias.vue'
import articulos from '../pages/Articulos.vue'
import ingresos from '../pages/Ingresos.vue';
import proveedores from '../pages/Proveedores.vue';
import ventas from '../pages/Ventas.vue';
import clientes from '../pages/Clientes.vue';
import usuarios from '../pages/Usuarios.vue';
import consultaCompras from '../pages/ConsultaCompras.vue';
import consultaVentas from '../pages/ConsultaVentas.vue';
import VueRouter from 'vue-router';
import {store} from "../store/store.js"


export const routes =[
    {path: '/', component: login},
    {path: '/inicio', component: inicio},
    {path: '/categorias', component: categorias},
    {path: '/articulos', component: articulos},
    {path: '/ingresos', component: ingresos},
    {path: '/proveedores', component: proveedores},
    {path: '/ventas', component: ventas},
    {path: '/clientes', component: clientes},
    {path: '/usuarios', component: usuarios},
    {path: '/consultaCompras', component: consultaCompras},
    {path: '/consultaVentas', component: consultaVentas},

]


export const router = new VueRouter({
    mode:'history',
    routes
})

router.beforeEach((to,from,next)=>{
    if(!store.state.token && to.path != '/'){
      next('/')
    }else{
    next()
    }
    
})

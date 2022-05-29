import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export const store = new Vuex.Store({
     
    state:{
        id:"",
        token:"",
        usuario:"",
        contrasena:"",
        rol:""
    },

    mutations:{
        setId(state,value){
            state.id = value;
        },
        setToken(state,value){
            state.token = value;
        },
        setUsuario(state,value){
            state.usuario = value;
        },
        setContrasena(state,value){
            state.contrasena = value;
        },
        setRol(state,value){
            state.rol = value;
        },
    },
    actions:{
        setId(context,value){
            context.commit("setId",value);
        },
        setToken(context,value){
            context.commit("setToken",value);
        },
        setUsuario(context,value){
            context.commit("setUsuario",value);
        },
        setContrasena(context,value){
            context.commit("setContrasena",value);
        },
        setRol(context,value){
            context.commit("setRol",value);
        },
    }

   
})

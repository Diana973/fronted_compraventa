
  <template>

  <div >
    
  
   <v-app-bar app
      flex
      color="cyan darken-2"
      dark
    >
      <v-app-bar-nav-icon v-if="$store.state.token!==''" @click="drawer = true"></v-app-bar-nav-icon>

      <v-toolbar-title>Sistema_Compraventa</v-toolbar-title>
      <v-spacer></v-spacer>

      <v-btn v-if="$store.state.token!==''" @click="salir()" class="cyan darken-2">
         salir
        <v-icon>mdi-menu-right</v-icon>
      </v-btn>
      
    </v-app-bar >
    
    <v-navigation-drawer 
      
      temporary
      v-model="drawer"
      absolute
      
    >
    <!-- permanent
      expand-on-hover -->
    

    <v-list>
       <v-list-item v-if="$store.state.rol=='Administrador' || $store.state.rol=='Almacenista' || $store.state.rol=='Vendedor'"  to="/inicio">
        <v-list-item-icon>
          <v-icon>mdi-home</v-icon>
        </v-list-item-icon>

        <v-list-item-title
        
        >Home</v-list-item-title>
      </v-list-item>


      <v-list-group
        :value="false"
        prepend-icon="mdi-store"
         v-if="$store.state.rol=='Administrador' ||  $store.state.rol=='Almacenista'"
      >
        <template v-slot:activator>
          <v-list-item-title>Almacen</v-list-item-title>
        </template>

          <v-list-item 
            v-for="([title, icon,url], i) in admins"
            :key="i"
            link
            :to="url"
          >
            <v-list-item-title v-text="title"></v-list-item-title>

            <v-list-item-icon>
              <v-icon v-text="icon"></v-icon>
            </v-list-item-icon>
          </v-list-item>
       </v-list-group>

        <v-list-group
        :value="false"
        prepend-icon="mdi-cart"
         v-if="$store.state.rol=='Administrador' ||  $store.state.rol=='Almacenista'"
      >
        <template v-slot:activator>
          <v-list-item-title >Compras</v-list-item-title>
        </template>
          <v-list-item
            v-for="([title, icon,url], i) in admin1"
            :key="i"
            link
            :to="url"
          >
            <v-list-item-title v-text="title"></v-list-item-title>

            <v-list-item-icon>
              <v-icon v-text="icon"></v-icon>
            </v-list-item-icon>
          </v-list-item>
       </v-list-group>

        <v-list-group
        :value="false"
        prepend-icon="mdi-chart-line"
         v-if="$store.state.rol=='Administrador' ||  $store.state.rol=='Vendedor'"
      >
        <template v-slot:activator>
          <v-list-item-title>Ventas</v-list-item-title>
        </template>

          <v-list-item
            v-for="([title, icon,url], i) in admin2"
            :key="i"
            link
            :to="url"
          >
            <v-list-item-title v-text="title"></v-list-item-title>

            <v-list-item-icon>
              <v-icon v-text="icon"></v-icon>
            </v-list-item-icon>
          </v-list-item>
       </v-list-group>
        <v-list-group
        :value="false"
        prepend-icon="mdi-account"
         v-if="$store.state.rol=='Administrador'"
      >
        <template v-slot:activator>
          <v-list-item-title>Accesos</v-list-item-title>
        </template >
          <v-list-item
            v-for="([title, icon,url], i) in admin3"
            :key="i"
            link
            :to="url"
          >
            <v-list-item-title v-text="title"></v-list-item-title>

            <v-list-item-icon>
              <v-icon v-text="icon"></v-icon>
            </v-list-item-icon>
          </v-list-item>
       </v-list-group>

        <v-list-group
        :value="false"
        prepend-icon="mdi-checkbox-marked-circle-outline"
         v-if="$store.state.rol=='Administrador'"
      >
        <template v-slot:activator>
          <v-list-item-title>Consultas</v-list-item-title>
        </template>
          <v-list-item
            v-for="([title, icon,url], i) in admin4"
            :key="i"
            link
            :to="url"
          >
            <v-list-item-title v-text="title"></v-list-item-title>

            <v-list-item-icon>
              <v-icon v-text="icon"></v-icon>
            </v-list-item-icon>
          </v-list-item>
       </v-list-group>

       
    </v-list>
    </v-navigation-drawer>
  
  </div>
</template>


 <script>
 
 export default {
    data() {
    return {
      drawer:false,
      group: null,
      open: ['login'],
      admins: [
        ['Categoria','mdi-format-list-bulleted-type',"/categorias"],
        ['Articulos','mdi-playlist-plus',"/articulos"],
      ],
        admin1: [
        ['Ingresos','mdi-currency-usd',"/ingresos"],
        ['Proveedores','mdi-account-multiple',"/proveedores"],
      ],
        admin2: [
        ['Ventas','mdi-chart-line-variant',"/ventas"],
        ['Clientes','mdi-account-multiple',"/clientes"],
      ],
        admin3: [
        ['Usuarios','mdi-account-multiple-plus',"/usuarios"],
        
      ],
        admin4: [
        ['Consulta ventas','mdi-check-all',"/consultaVentas"],
        ['Consulta compras','mdi-check-all',"/consultaCompras"],
      ],
     
    };
  },

  methods:{
     
     salir(){
      this.$swal({
        
        title:"!!Estas seguro que quieres cerrar sección!!",
        showCancelButton: true,
        confirmButtonText: "ok!",
        cancelButtonText: "Cancelar!",
        confirmButtonColor: "#F44336",
   
        reverseButtons: true,

      }).then((result)=>{
        if(result.isConfirmed){
          this.$store.dispatch('setToken', "")
           this.$router.replace('/')
           .then((response)=>{
             console.log(response)
           }).catch((error)=>{
             console.log(error)
           });
           this.$swal.fire({
            title:'haz cerrado sección',
            position: 'top-end',
            toast: true, 
            background:'#E0F7FA',
            showConfirmButton:false,
            icon: "success",
            timer: 2000,
          });
        }
      })
    }
  
  }  
  }
 
 </script>
 

<template>
  <div>
    <v-app class="mt-15 ma-1 pa-2">
      <v-card flat>
        <v-form>
          <v-container fluid mt-4 class="spacing-playground pa-5">
            <v-row>
              <v-col cols="12" sm="4" class="d-flex justify-center headline">
                <v-toolbar-title class="font-weight-bold"
                  >PROVEEDORES</v-toolbar-title
                >
                <v-divider class="mx-4" insert vertical></v-divider>
              </v-col>

              <v-col cols="12" sm="4">
                <v-text-field
                  v-model="search"
                  append-icon="mdi-magnify"
                  label="Search"
                  single-line
                  hide-details
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="4" class="d-flex justify-center">
                <v-btn @click="dialog = true" dark class="cyan darken-3"
                  >Nuevo Registro</v-btn
                >
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card>

      <v-data-table
        :headers="headers"
        :items="proveedores"
        :search="search"
        :items-per-page="5"
        class="spacing-playground pa-5"
      >
        <template v-slot:[`item.opciones`]="{ item }">
          <v-icon small class="mr-2" @click="editProduct(item)"
            >mdi-pencil</v-icon
          >
          <v-icon small class="mr-2" @click="activ(item)">
            {{ item.estado === 1 ? " mdi-cancel" : "mdi-check" }}
          </v-icon>
        </template>
        <template v-slot:[`item.estado`]="{ item }">
          <span
            v-bind:class="[item.estado === 1 ? 'primary--text' : 'red--text']"
          >
            {{ item.estado === 1 ? "Activo" : "Inactivo" }}
          </span>
        </template>
      </v-data-table>

      <v-dialog v-model="dialog" width="520" persistent>
        <v-card>
          <v-card-title>{{ t }}</v-card-title>
          <v-divider mx-4></v-divider>
          <v-form ref="form">
            <v-container>
              <v-row>
                <v-col cols="12" sm="4" class="d-flex justify-start">
                  <v-text-field v-model="nombre" label="Nombre"></v-text-field>
                </v-col>
                <v-col cols="12" sm="4">
                  <v-text-field
                    v-model="tipoPersona"
                    label="Tipo persona"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" sm="4">
                  <v-select
                    v-model="tipoDocumento"
                    :items="documento"
                    label="Tipo documento"
                  ></v-select>
                </v-col>

                <v-col cols="12" sm="4">
                  <v-text-field
                    type="Number"
                    v-model="numeroDocumento"
                    label="Numero documento"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" sm="4">
                  <v-text-field
                    v-model="direccion"
                    label="Direccion"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" sm="4">
                  <v-text-field
                    type="Number"
                    v-model="telefono"
                    label="Telefono"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" sm="4">
                  <v-text-field v-model="email" label="Email"> </v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
          <v-divider></v-divider>
          <v-card-actions>
            <v-alert
              color="red accent-2"
              shaped
              text
              class="mt-6"
              dense
              v-if="a == true"
              type="warning"
            >
              {{ error }}
            </v-alert>
            <v-alert
              shaped
              text
              class="mt-6"
              color="green"
              dense
              v-else-if="a == false"
              type="success"
              >{{ error }}
            </v-alert>

            <v-spacer></v-spacer>
            <v-btn class="success" @click="guardarDatos()">{{ n }}</v-btn>
            <v-btn class="cyan darken-3" dark @click="salir()">Cancelar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <header style="height: 30px"></header>
    </v-app>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      search: "",
      a: null,
      error: "",
      valid: true,
      bd: 0,
      dialog: false,
      n: "Guardar",
      t: "Nuevo Registro",
      nombre: "",
      tipoPersona: "",
      tipoDocumento: "",
      numeroDocumento: "",
      direccion: "",
      telefono: "",
      documento: ["CC", "RUP", "PASAPORTE", "CE"],
      email: "",
      proveedores: [],

      headers: [
        { text: "Estado", value: "estado" },
        { text: "Nombre", value: "nombre" },
        { text: "Tipo persona", value: "tipoPersona" },
        { text: "Tipo documemto", value: "tipoDocumento" },
        { text: "Numero documento", value: "numeroDocumento" },
        { text: "Direccion", value: "direccion" },
        { text: "Telefono", value: "telefono" },
        { text: "Email", value: "email" },
        { text: "Opciones", value: "opciones" },
      ],
    };
  },
  created() {
    this.traer();
  },

  methods: {
    traer() {
      let header = { headers: { "x-token": this.$store.state.token } };
      axios
        .get("proveedor", header)
        .then((response) => {
          console.log(response);
          this.proveedores = response.data.proveedor;
        })
        .catch((error) => {
          console.log(error);
        });
    },
  
    activ(item) {
      this.id = item._id;
      this.estado = item.estado;

      if (this.estado === 1) {
        this.$swal.fire({
          title: "¿Esta seguro , quiere desactivar este proveedor?",
        icon: "warning",
        toast: true,
        showCancelButton: true,
         confirmButtonText: "Desactivar!",
         confirmButtonColor: "#F44336",
         cancelButtonText: "Cancelar!",
         cancelButtonColor: "",
        reverseButtons: true,

      }).then((result)=>{
        if(result.isConfirmed){
           let header ={headers:{"x-token":this.$store.state.token}}
        axios
          .put(`proveedor/desactivar/${this.id}`, {
          
            estado: 0,
          },
          header
          )
          .then((response) => {
            console.log(response);
            this.traer();
            this.$swal.fire({
            toast: true,
            position:"bottom",
            text: "¡ Desactivaste este proveedor! ",
            icon: "success",
            showConfirmButton: false,
            timer: 1000,
          });
            
          })
          .catch((error) => {
            console.log(error);
          });

        }

      })
       
      } else if(this.estado===0){
         this.$swal.fire({
          title: "¿Esta seguro de activar este proveedor?",
        icon: "warning",
        toast: true,
        showCancelButton: true,
         confirmButtonText: "Activar!",
         confirmButtonColor: "#66BB6A",
         cancelButtonText: "Cancelar!",
         cancelButtonColor: "",
        reverseButtons: true,
         }).then((result)=>{

           if(result.isConfirmed){
          let header ={headers:{"x-token":this.$store.state.token}}
          axios
           .put(`proveedor/activar/${this.id}`, {
            estado: 1,
          }, header)
          .then((response) => {
            console.log(response);
            this.traer();
            this.$swal.fire({
            toast: true,
            position:"bottom",
            text: "¡ Activaste este proveedor! ",
            icon: "success",
            showConfirmButton: false,
            timer: 1000,
          });
          })
          .catch((error) => {
            console.log(error);
          });

           }

         })
       
      }
    },

    guardarDatos() {
      let header = { headers: { "x-token": this.$store.state.token } };
      if (this.bd === 1) {
        axios
          .put(
            `proveedor/${this.id}`,

            {
              nombre: this.nombre,
              tipoPersona: this.tipoPersona,
              tipoDocumento: this.tipoDocumento,
              numeroDocumento: this.numeroDocumento,
              direccion: this.direccion,
              telefono: this.telefono,
              email: this.email,
            },
            header
          )
          .then((response) => {
            console.log(response);
            this.traer();
            this.dialog = false;
            this.salir();
            this.$swal.fire({
              showConfirmButton: false,
              icon: "success",
              position: "center-end",
              background: "#C8E6C9",
              toast: true,
              title: "Edicción exitosa",
              timer: 2000,
            });
          })
          .catch((error) => {
            console.log(error.response.data.errors[0]);
            this.$swal.fire({
              showConfirmButton: false,
              icon: "error",
              position: "center-end",
              background: "#FFEBEE",
              toast: true,
              title: "¡" + error.response.data.errors[0].msg + "!",
              timer: 3000,
            });
          });
      } else if (this.bd === 0) {
        console.log(this.bd);
        console.log(this.nombre);
        let header = { headers: { "x-token": this.$store.state.token } };
        axios
          .post(
            "proveedor",
            {
              nombre: this.nombre,
              tipoPersona: this.tipoPersona,
              tipoDocumento: this.tipoDocumento,
              numeroDocumento: this.numeroDocumento,
              direccion: this.direccion,
              telefono: this.telefono,
              email: this.email,
              estado: 1,
            },
            header
          )
          .then((response) => {
            console.log(response);
            this.salir();
            this.traer();
            this.$swal.fire({
              showConfirmButton: false,
              icon: "success",
              position: "center-end",
              background: "#C8E6C9",
              toast: true,
              title: "Registro exitoso",
              timer: 2000,
            });
          })
          .catch((error) => {
            console.log(error.response.data.errors[0].msg);
            this.$swal.fire({
              showConfirmButton: false,
              icon: "error",
              position: "center-end",
              background: "#FFEBEE",
              toast: true,
              title: "¡" + error.response.data.errors[0].msg + "!",
              timer: 3000,
            });
          });
      }
    },
    salir() {
      this.$refs.form.resetValidation();
      this.dialog = false;
      this.n = "Guardar";
      this.t = "Nuevo registro";
      this.nombre = "";
      this.tipoPersona = "";
      this.tipoDocumento = "";
      this.numeroDocumento = "";
      this.direccion = "";
      this.telefono = "";
      this.email = "";
      this.estado = "";
    },

    editProduct(item) {
      console.log(item);
      this.id = item._id;
      this.n = "Editar";
      this.t = "Editar Registro";
      this.nombre = item.nombre;
      this.tipoPersona = item.tipoPersona;
      this.tipoDocumento = item.tipoDocumento;
      this.numeroDocumento = item.numeroDocumento;
      this.direccion = item.direccion;
      this.telefono = item.telefono;
      this.email = item.email;
      this.estado = item.estado;
      this.bd = 1;
      this.dialog = true;
    },
  },
};
</script>
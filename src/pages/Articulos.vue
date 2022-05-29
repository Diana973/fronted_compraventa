<template>
  <v-app class="mt-15 ma-1 pa-2">
    <v-card flat>
      <v-form ref="form">
        <v-container fluid mt-4 class="spacing-playground pa-5">
          <v-row>
            <v-col cols="12" sm="1" class="d-flex justify-end">
              <v-btn @click="crearPDF()" color="black" icon depressed>
                <v-icon>mdi-printer</v-icon>
              </v-btn>
            </v-col>
            <v-col cols="12" sm="2" class="d-flex justify-star headline">
              <v-toolbar-title class="font-weight-bold"
                >ARTICULOS</v-toolbar-title
              >
              <v-divider class="mx-4" insert vertical></v-divider>
            </v-col>

            <v-col cols="12" sm="5" class="d-flex justify-end">
              <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="Search"
                single-line
                hide-details
              ></v-text-field>
            </v-col>

            <v-col cols="12" sm="4" class="d-flex justify-center">
              <v-btn @click="nuevo()" dark class="cyan darken-3"
                >Nuevo Artículo</v-btn
              >
            </v-col>
          </v-row>
        </v-container>
      </v-form>
    </v-card>

    <v-data-table
      :headers="headers"
      :items="articulos"
      :search="search"
      :items-per-page="10"
      class="spacing-playground pa-4"
    >
      <template v-slot:[`item.opciones`]="{ item }">
        <v-icon small class="mr-2" @click="editProduct(item)">
          mdi-pencil</v-icon
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
                <v-text-field
                  type="Number"
                  v-model="codigo"
                  required
                  label="Codigo"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="4">
                <v-text-field
                  type="string"
                  v-model="nombre"
                  required
                  label="Nombre"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="4">
                <v-select
                  v-model="categoria"
                  :items="itemCategoria"
                  required
                  label="Categoria"
                  @change="ver()"
                ></v-select>
              </v-col>
              <v-col cols="12" sm="4">
                <v-text-field
                  type="Number"
                  v-model="stock"
                  required
                  label="Stock"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="4">
                <v-text-field
                  type="Number"
                  v-model="precioVenta"
                  required
                  label="Precio venta"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="4">
                <v-text-field
                  type="string"
                  v-model="descripcion"
                  required
                  label="Descripcion"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
        <template v-slot:[`item.categoria`]="{ item }">
          {{ item.categoria }}
        </template>
        <v-divider></v-divider>

        <v-container>
          <v-row>
            <v-col wrap cols="12">
              <v-card-actions mt-2>
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

                <v-btn color="success" dark @click="guardarDatos()">
                  {{ n }}
                </v-btn>

                <v-btn color="cyan darken-3" dark @click="salir()"
                  >Cancelar</v-btn
                >
              </v-card-actions>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-dialog>
    <header style="height: 30px"></header>
  </v-app>
</template>

<script>
import jspdf from "jspdf";
import {} from "jspdf-autotable";
import axios from "axios";
export default {
  data() {
    return {
      search: "",
      estado: null,
      a: null,
      error: "",
      valid: true,
      id: "",
      bd: 0,
      dialog: false,
      n: "Guardar",
      t: "Nuevo Registro",
      codigo: "",
      nombre: "",
      categoria: "",
      stock: "",
      itemCategoria: [],
      precioVenta: 0,
      descripcion: "",
      articulos: [],
      headers: [
        { text: "Estado", value: "estado" },
        { text: "Codigo", value: "codigo" },
        { text: "Nombre", value: "nombre" },
        { text: "Categoria", value: "categoria.nombre" },
        { text: "Stock", value: "stock" },
        { text: "Precio venta", value: "precioVenta" },
        { text: "Descripcion", value: "descripcion" },
        { text: "Opciones", value: "opciones" },
      ],
    };
  },

  created() {
    this.traer();
    this.traerCategoriasNombre();
  },

  methods: {
   
   activ(item) {
      this.id = item._id;
      this.estado = item.estado;

      if (this.estado === 1) {
        this.$swal.fire({
          title: "¿Esta seguro , quiere desactivar este articulo?",
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
          .put(`articulo/desactivar/${this.id}`, {
          
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
            text: "¡ Desactivaste este articulo! ",
            icon: "success",
            showConfirmButton: false,
            timer: 2000,
          });
            
          })
          .catch((error) => {
            console.log(error);
          });

        }

      })
       
      } else if(this.estado===0){
         this.$swal.fire({
          title: "¿Esta seguro de activar este articulo?",
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
           .put(`articulo/activar/${this.id}`, {
            estado: 1,
          }, header)
          .then((response) => {
            console.log(response);
            this.traer();
            this.$swal.fire({
            toast: true,
            position:"bottom",
            text: "¡ Activaste este articulo! ",
            icon: "success",
            showConfirmButton: false,
            timer: 2000,
          });
          })
          .catch((error) => {
            console.log(error);
          });

           }

         })
       
      }
    },

    ver() {
      console.log(this.categoria);
    },
    nuevo() {
      this.dialog = true;
      this.traerCategoriasNombre();
      this.bd = 0;
      console.log(this.bd);
    },

    traer() {
      let header = { headers: { "x-token": this.$store.state.token } };
      axios
        .get("articulo", header)
        .then((response) => {
          console.log(response);
          this.articulos = response.data.articulo;
        })
        .catch((error) => {
          console.log(error);
        });
    },

    guardarDatos() {
      let header = { headers: { "x-token": this.$store.state.token } };

      if (this.bd === 1) {
        console.log(this.bd);
        axios
          .put(
            `articulo/${this.id}`,

            {
              codigo: this.codigo,
              nombre: this.nombre,
              categoria: this.categoria,
              stock: this.stock,
              precioVenta: this.precioVenta,
              descripcion: this.descripcion,
            },
            header
          )
          .then((response) => {
            console.log(response);
            this.traer();
            this.salir();
            this.traerCategoriasNombre();
            this.dialog = false;
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
        let header = { headers: { "x-token": this.$store.state.token } };

        axios
          .post(
            "articulo",
            {
              codigo: this.codigo,
              nombre: this.nombre,
              categoria: this.categoria,
              stock: this.stock,
              precioVenta: this.precioVenta,
              descripcion: this.descripcion,
              estado: 1,
            },
            header
          )
          .then((response) => {
            console.log(response);
            this.traer();
            this.traerCategoriasNombre();
            this.$refs.form.resetValidation();
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
      }
    },

    crearPDF() {
     
      let columnas = [
        
        { title: "Codigo", dataKey: "codigo" },
        { title: "Nombre", dataKey: "nombre" },
        { title: "Categoria", dataKey: "categoria" },
        { title: "Stock", dataKey: "stock" },
        { title: "Precio venta", dataKey: "precioVenta" },
        { title: "Descripcion", dataKey: "descripcion" },
      ];

      let filas = [];
      this.articulos.forEach(function (x) {
        filas.push({
          nombre: x.nombre,
          codigo: x.codigo,
          categoria: x.categoria.nombre,
          stock: x.stock,
          precioVenta: x.precioVenta,
          descripcion: x.descripcion,
        });
      });

      const doc = new jspdf("p", "pt");
      doc.autoTable(columnas, filas, {
        margin: { top: 60 },
        addPageContent: function () {
          doc.text("Factura", 40, 30);
        },
      });

      doc.save("factura_Articulos.pdf");
    },


    salir() {
      this.$refs.form.resetValidation();
      this.dialog = false;
      this.n = "Guardar";
      this.t = "Nuevo registro";
      this.codigo = "";
      this.nombre = "";
      this.categoria = "";
      this.stock = "";
      this.precioVenta = "";
      this.descripcion = "";
      this.estado = "";
    },
    traerCategoriasNombre() {
      let header = { headers: { "x-token": this.$store.state.token } };
      axios
        .get("categoria", header)

        .then((response) => {
          response.data.categoria.map((x) => {
            this.itemCategoria.push({
              text: x.nombre,
              value: x._id,
            });
          });
        })

        .catch((error) => {
          console.log(error);
        });
    },

    editProduct(item) {
      console.log(item);
      this.id = item._id;
      console.log(this.id);
      console.log(item.categoria._id);
      this.dialog = true;
      this.n = "Editar";
      this.t = "Editar Registro";
      this.codigo = item.codigo;
      this.nombre = item.nombre;
      this.categoria = item.categoria._id;
      this.stock = item.stock;
      this.precioVenta = item.precioVenta;
      this.descripcion = item.descripcion;
      this.estado = item.estado;
      this.bd = 1;
    },
  },
};
</script>


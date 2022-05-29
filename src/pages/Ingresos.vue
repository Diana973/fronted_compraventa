<template>
  <div>
    <v-app class="mt-15 ma-1 pa-2">
      <v-card flat>
        <v-form ref="form">
          <v-container fluid mt-4 class="spacing-playground pa-9">
            <v-row>
              <v-col cols="12" sm="4" class="d-flex justify-center headline">
                <v-toolbar-title class="font-weight-bold"
                  >INGRESOS</v-toolbar-title
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
                <v-btn @click="btn()" dark class="cyan darken-3"
                  >Nuevo Registro</v-btn
                >
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card>

      <!-- tabla principal -->

      <v-data-table
        :headers="headers"
        :items="ingresos"
        :search="search"
        :items-per-page="5"
        class="spacing-playground pa-5"
      >
        <template v-slot:[`item.opciones`]="{ item }">
          <v-icon small class="mr-2" @click="datosFactura(item)"
            >mdi-window-maximize</v-icon
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

      <!-- boton nuevo registro -->

      <v-dialog v-model="dialog" width="1000" persistent  >
        <v-card>
          <v-card-title>{{ t }}</v-card-title>
          <v-divider mx-4></v-divider>
          <v-form ref="form" class="ma-4"  :disabled="isDisabled">
            <v-container>
              <v-row>
                <v-col cols="12" sm="4" class="d-flex justify-start">
                  <v-select
                    v-model="tipoComprobante"
                    :items="comprobante"
                    required
                    label="Tipo comprobante"
                  ></v-select>
                </v-col>
                <v-col cols="12" sm="4">
                  <v-text-field
                    v-model="serieComprobante"
                    required
                    label="Serie comprobante"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="4">
                  <v-text-field
                    v-model="numeroComprobante"
                    required
                    label="Numero comprobante"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-select
                    v-model="proveedor"
                    required
                    :items="itemProveedor"
                    label="Proveedor"
                    @change="ver()"
                  ></v-select>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="impuesto"
                    required
                    label="Impuesto"
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-col mt-15 cols="12" sm="3">
                <h3>Factura</h3>
              </v-col>

              <v-data-table
                :headers="titulos"
                :items="detalles"
                :items-per-page="5"
                class="elevation-1"
              >
                <template v-slot:[`item.borrar`]="{ item }">
                  <v-icon small class="mr-2" @click="eliminarD(item)"
                    >mdi-delete</v-icon
                  >
                </template>

                <template
                  v-if="tfieldCantidad === true"
                  v-slot:[`item.cantidad`]="{ item }"
                >
                  <v-text-field
                    type="Number"
                    @click="nuevo(item)"
                    @change="onChange(item)"
                    v-model="item.cantidad"
                  ></v-text-field>
                </template>

                <template v-slot:[`item.subtotal`]="{ item }">
                  <v-container type="Number">
                    {{ item.cantidad * item.precio }}
                  </v-container>
                </template>
              </v-data-table>
            </v-container>
          </v-form>

          <v-container mt-12>
            <v-row>
              <v-col cols="12" sm="4" class="d-flex justify-end">
                <h3>Total Parcial : {{ saldo }}</h3>
              </v-col>

              <v-col cols="12" sm="4" class="d-flex justify-center">
                <h3>Total Impuesto: {{ impuest }}</h3>
              </v-col>

              <v-col cols="12" sm="4" class="d-flex justify">
                <h3>Total: {{ subTotal }}</h3>
              </v-col>
            </v-row>
          </v-container>
          <v-divider></v-divider>

          <!-- BOTONES -->
          <v-card-actions>
            <v-col cols="" sm="" class="d-flex justify-start">
              <v-btn
                v-if="btnAgregar === true"
                color="cyan darken-3"
                class="hidden-sm-and-up"
                dark
                small
                @click="dialog2 = true"
              >
                <v-icon>mdi-plus</v-icon>
              </v-btn>
              <v-btn
                v-if="btnAgregar === true"
                color="cyan darken-3"
                class="hidden-xs-only"
                dark
                @click="traerArticulo()"
                >Agregar producto
              </v-btn>
            </v-col>
            <v-spacer></v-spacer>
            <v-btn
              v-if="btnGuardar === true"
              class="hidden-sm-and-up"
              color="success"
              small
              @click="guardarDatos()"
            >
              <v-icon>mdi-check</v-icon></v-btn
            >
            <v-btn
              v-if="btnGuardar === true"
              class="hidden-xs-only"
              color="success"
              @click="guardarDatos()"
              >{{ n }}</v-btn
            >
            <v-btn
              class="hidden-sm-and-up"
              color="grey"
              small
              dark
              @click="salir()"
            >
              <v-icon>mdi-window-close</v-icon></v-btn
            >
            <v-btn
              class="hidden-xs-only"
              color="cyan darken-3"
              dark
              @click="salir()"
              >{{ texto_btnsalir }}</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog persistent v-model="dialog2" max-width="900px">
        <v-card>
          <v-spacer></v-spacer>
          <v-card-title> Selecciona un articulo </v-card-title>
          <v-col cols="12" mt-15>
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Busqueda"
              single-line
              hide-details
            ></v-text-field>
          </v-col>

          <!-- tabla numero 3 -->

          <v-data-table
            :headers="title2"
            :items="agregarArticulos"
            :items-per-page="5"
            :search="search"
            class="elevation-1"
          >
            <template v-slot:[`item.seleccionar`]="{ item }">
              <v-icon
                small
                class="mr-2"
                @click="agregar_producto(item)"
                v-if="item.estado == 1"
                >mdi-plus-box</v-icon
              >
            </template>
            <template v-slot:[`item.estado`]="{ item }">
              <span
                v-bind:class="[
                  item.estado === 1 ? 'primary--text' : 'red--text',
                ]"
              >
                {{ item.estado === 1 ? "Activo" : "Inactivo" }}
              </span>
            </template>
          </v-data-table>
          <v-col cols="12" sm="12"> </v-col>
          <v-card-actions>
            <v-col class="d-flex justify-end">
              <v-btn color="primary" text @click="dialog2 = false">
                Cerrar
              </v-btn>
            </v-col>
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
      id: "",
      total: 0,
      subt: 0,
      fecha: Date,
      dialog: false,
      dialog2: false,
      btnAgregar: true,
      btnCancelar: true,
      btnGuardar: true,
      texto_btnsalir: "cancelar",
      tfieldCantidad: true,
      tfieldDescuento: true,
      isDisabled: false,
      n: "Guardar",
      t: "Nuevo Registro",
      impuesto: 0,
      proveedor: "",
      serieComprobante: "",
      tipoComprobante: "",
      numeroComprobante: "",
      codigo: "",
      detalles: [],
      ingresos: [],
      itemProveedor: [],
      comprobante: ["Nota debito", "Factura", "Nota credito"],
      headers: [
        { text: "Estado", value: "estado" },
        { text: "Usuario", value: "usuario.nombre" },
        { text: "Proveedor", value: "proveedor.nombre" },
        { text: "Tipo comprobante", value: "tipoComprobante" },
        { text: "Serie comprobante", value: "serieComprobante" },
        { text: "Numero comprobante", value: "numeroComprobante" },
        { text: "Fecha", value: "fecha" },
        { text: "Impuesto", value: "impuesto" },
        { text: "Total", value: "total" },
        { text: "Opciones", value: "opciones" },
      ],
      titulos: [
        { text: "Borrar", value: "borrar" },
        { text: "Articulos", value: "nombreProducto" },
        { text: "Cantidad", value: "cantidad" },
        { text: "Precio", value: "precio" },
        { text: "Sub total", value: "subtotal" },
      ],

      title2: [
        { text: "Seleccionar", value: "seleccionar" },
        { text: "Codigo", value: "codigo" },
        { text: "Nombre", value: "nombre" },
        { text: "Categoria", value: "categoria.nombre" },
        { text: "Stock", value: "stock" },
        { text: "Precio venta", value: "precioVenta" },
        { text: "Descripcion", value: "descripcion" },
        { text: "Estado", value: "estado" },
      ],

      agregarArticulos: [],
    };
  },

  computed: {
    subTotal() {
      // return this.productosDescripcion ? this.productosDescripcion.forEach((detalle, y) => (detalle += y.subtotal)):0
      //return  this.productosDescripcion.forEach((detalle, y) => (detalle += y.subtotal))
      //return this.productosDescripcion.reduce((detalle, y) => detalle += y.subtotal);
      this.detalles.map((x) => (this.subt += x.subtotal));
      return this.subt;
    },

    impuest() {
      console.log(this.subt);
      console.log(this.impuesto);
      return this.subt * (Number(this.impuesto) / 100);
    },

    saldo() {
      console.log(this.subt);
      console.log(this.impuesto);
      return Math.round(this.subt - this.impuesto);
    },
  },

  created() {
    this.traer();
    this.traerProveedor();
  },

  methods: {
    btn() {
      this.dialog = true;
      this.texto_btnsalir = "cancelar";
      this.btnAgregar = true;
      this.btnCancelar = true;
      this.btnGuardar = true;
    },
    nuevo(item) {
      console.log(item);
      console.log(item);
    },
    ver() {
      console.log(this.proveedor);
    },

    onChange(item) {
      item.subtotal = item.precio * item.cantidad;
      this.subt = 0;
    },

    eliminarD(item) {
      this.$swal({
        title: "!!Estas seguro que quieres eliminar este Articulo!!",
        showCancelButton: true,
        toast: true,
        icon: "question",
        position: "top",
        background: "#E0F7FA",
        confirmButtonText: "ok!",
        cancelButtonText: "Cancelar!",
        confirmButtonColor: "#F44336",
        reverseButtons: true,
      }).then((result) => {
        if (result.isConfirmed) {
          this.subt=0
          let index = this.detalles.findIndex((x) => x._id == item._id);
          this.detalles.splice(index, 1)
            .then((response) => {
              console.log(response);
              
            })
            .catch((error) => {
              console.log(error);
            });
        }
      });
    },


    activ(item) {
      this.id = item._id;
      this.estado = item.estado;

      if (this.estado === 1) {
        this.$swal.fire({
          title: "¿Esta seguro , quiere desactivar este ingreso?",
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
          .put(`ingreso/desactivar/${this.id}`, {
          
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
            text: "¡ Desactivaste este ingreso! ",
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
          title: "¿Esta seguro de activar este ingreso?",
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
           .put(`ingreso/activar/${this.id}`, {
            estado: 1,
          }, header)
          .then((response) => {
            console.log(response);
            this.traer();
            this.$swal.fire({
            toast: true,
            position:"bottom",
            text: "¡ Activaste este Ingreso! ",
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

    traer() {
      console.log(this.$store.state.token);
      let header = { headers: { "x-token": this.$store.state.token } };
      axios
        .get("ingreso", header)
        .then((response) => {
          console.log(response);
          this.ingresos = response.data.ingreso;
        })
        .catch((error) => {
          console.log(error);
        });
    },

    traerArticulo() {
      let header = { headers: { "x-token": this.$store.state.token } };
      axios
        .get("articulo", header)
        .then((response) => {
          console.log(response);
          this.agregarArticulos = response.data.articulo;
          this.dialog2 = true;
        })
        .catch((error) => {
          console.log(error);
        });
    },

    traerProveedor() {
      let header = { headers: { "x-token": this.$store.state.token } };
      axios
        .get("proveedor", header)

        .then((response) => {
          response.data.proveedor.map((x) => {
            this.itemProveedor.push({
              text: x.nombre,
              value: x._id,
            });
          });
        })
        .catch((error) => {
          console.log(error);
        });
    },

    guardarDatos() {
      console.log(this.$store.state.usuario._id);
      this.total = this.subTotal;
      let header = { headers: { "x-token": this.$store.state.token } };
      axios
        .post(
          "ingreso",
          {
            usuario: this.$store.state.usuario._id,
            proveedor: this.proveedor,
            tipoComprobante: this.tipoComprobante,
            serieComprobante: this.serieComprobante,
            numeroComprobante: this.numeroComprobante,
            fecha: this.fecha,
            impuesto: this.impuesto,
            total: this.total,
            estado: 1,
            detalles: this.detalles,
          },
          header
        )
        .then((response) => {
          console.log(response);
          this.traer();
          this.salir();
          this.dialog = false;
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
          this.$swal.fire({
            showConfirmButton: false,
            icon: "error",
            position: "center-end",
            background: "#FFEBEE",
            toast: true,
            title: "¡" + error.response.data.errors[0].msg + "!",
            timer: 3000,
          });
          console.log(error.response.data.errors[0]);
        });
    },

    agregar_producto(item) {
      console.log(item.nombre);
      let indice = this.detalles.findIndex(
        (x) => x.nombreProducto === item.nombre
      );
      if (this.detalles.length === 0) {
        this.detalles.push({
          id: item._id,
          nombreProducto: item.nombre,
          precio: item.precioVenta,
          cantidad: 0,
          subtotal: 0,
        });
      } else if (indice === -1) {
        this.detalles.push({
          id: item._id,
          nombreProducto: item.nombre,
          precio: item.precioVenta,
          cantidad: 0,
          subtotal: 0,
        });
      } else {
        this.$swal.fire({
          showConfirmButton: false,
          icon: "error",
          position: "top",
          background: "#FFEBEE",
          toast: true,
          title: "¡ Producto ya agregado !",
          timer: 2000,
        });
      }
    },

    salir() {
      this.$refs.form.resetValidation();
      this.dialog = false;
      this.dialog2 = false;
      this.n = "Guardar";
      this.t = "Nuevo registro";
      this.usuario = "";
      this.proveedor = "";
      this.tipoComprobante = "";
      this.serieComprobante = "";
      this.numeroComprobante = "";
      this.impuesto = "";
      this.total = 0;
      this.estado = "";
      this.subt = 0;
      this.detalles = [];
    },

    datosFactura(item) {
      console.log(item);
      this.detalles = [];
      console.log(this.proveedor);
      this.id = item._id;
      this.n = "Editar";
      this.t = "Registro";
      this.texto_btnsalir = "salir";
      this.btnAgregar = false;
      this.btnCancelar = true;
      this.btnGuardar = false;
      this.tfieldCantidad = false;
      this.tfieldDescuento = false;
      this.tipoComprobante = item.tipoComprobante;
      this.serieComprobante = item.serieComprobante;
      this.numeroComprobante = item.numeroComprobante;
      this.proveedor = item.proveedor._id;
      this.impuesto = item.impuesto;
       this.isDisabled = true;
      this.bd = 1;
      this.dialog = true;
      item.detalles.map((x) => {
        this.detalles.push({
          _id: x._id,
          nombreProducto: x.nombreProducto,
          cantidad: x.cantidad,
          precio: x.precio,
          descuento: x.descuento,
          subtotal: x.precio * x.cantidad,
        });
      });
    },
  },
};
</script>


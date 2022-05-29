<template>
  <v-app class="mt-16 ma-3 pa-16">
    <v-container>
      <v-row justify="center" aling="center">
        <v-col cols="12" sm="10">
          <v-card class="elevation-6 mt-16 ma-auto" color="" width="550px">
            <v-form ref="formulario">
              <v-row>
                <v-col
                  cols="12"
                  sm=""
                  class="cyan darken-2 rounded-bl-xl; hidden-xs-only"
                >
                  <div style="text-aling: center; padding: 108px 0"></div>
                </v-col>
                <v-col cols="12" sm="10">
                  <v-card-text class="mt-10">
                    <h2 class="text-center">Acceso al sistema</h2>

                    <v-row justify="center" aling="center">
                      <v-col cols="12" sm="8">
                        <v-text-field
                          class="mt-6"
                          v-model="usuario"
                          label="Usuario"
                          prepend-icon="mdi-account"
                          required
                        >
                        </v-text-field>
                        <v-text-field
                          class="mt-6"
                          v-model="contrasena"
                          label="Contraseña"
                          prepend-icon="mdi-lock"
                          required
                          :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                          :type="show1 ? 'text' : 'password'"
                          @click:append="show1 = !show1"
                        ></v-text-field>
                      </v-col>
                    </v-row>

                    <v-row justify="center" aling="center">
                      <v-btn
                        pt-6
                        color="cyan darken-2"
                        width="280px"
                        class="hidden-xs-only"
                        @click="login()"
                      >
                        Ingresar
                      </v-btn>
                    </v-row>
                    <v-row justify="center" aling="center">
                      <v-btn
                        pt-6
                        color="cyan darken-2"
                        class="hidden-sm-and-up"
                        @click="login()"
                      >
                        Ingresar
                      </v-btn>
                    </v-row>

                    <v-row justify="center">
                      <v-alert
                        color="red accent-2"
                        class="mt-6"
                        shaped
                        text
                        dense
                        v-if="b == true"
                        type="warning"
                      >
                        {{ error }}
                      </v-alert>
                      <v-alert
                        class="mt-6"
                        color="green"
                        shaped
                        text
                        dense
                        v-else-if="b == false"
                        type="success"
                      >
                        {{ error }}
                      </v-alert>
                    </v-row>
                  </v-card-text>
                </v-col>
              </v-row>
            </v-form>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
import axios from "axios";
export default {
  data: () => ({
    valid: true,
    b: null,
    show1: false,
    error: "",
    id: "",
    usuario: "",
    contrasena: "",
  }),
  methods: {
    login() {
      axios
        .post("/auth", {
          email: this.usuario,
          password: this.contrasena,
        })
        .then((res) => {
          console.log(res);

          this.$store.dispatch("setId", res.data._id);
          this.$store.dispatch("setUsuario", res.data.usuario);
          this.$store.dispatch("setRol", res.data.usuario.rol);
          this.$store.dispatch("setContrasena", res.data.contrasena);
          this.$store.dispatch("setToken", res.data.token);
          console.log(res.data.token);
          setTimeout(() => {
            this.b = null;
            console.log(res.dat);
            this.$swal.fire({
              position: "top-end",
              toast: true,
              title: "¡Bienvenid@! " + res.data.usuario.nombre,
              icon: "success",
              showConfirmButton: false,
              timer: 3000,
            });

            this.$router.replace({ path: "/inicio" });
          }, 1000);
        })
        .catch((e) => {
          console.log(e.response);
          this.$swal.fire({
            position: "top-end",
            color: "#B71C1C",
            toast: true,
            background: "#FFEBEE",
            title: "¡!" + e.response.data.msg,
            showConfirmButton: false,
            timer: 3000,
          });

          this.$swal.fire({
            position: "top-end",
            color: "#B71C1C",
            toast: true,
            background: "#FFEBEE",
            title: "¡" + e.response.data.errors[0].msg + "!",
            showConfirmButton: false,
            timer: 3000,
          });
        });
    },
  },
};
</script>

<style scoped>
</style>

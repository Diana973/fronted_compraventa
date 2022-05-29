<template>
  <div>
  <v-footer
  
  class="footer"
    color="cyan darken-2"
    padless
  >
    <v-row
      justify="center"
      no-gutters
    >
      
      <v-col
        class="cyan darken-2 padless py-4 text-center white--text"
        cols="12"
      >
        {{ new Date().getFullYear() }} — <strong>Vuetify_by_D_Bayona</strong>
      </v-col>
    </v-row>
  </v-footer>
  </div>
</template>

<script>
  export default {
    data: () => ({
      
    }),
  }
</script>

<style scoped>
.footer{
  width: 100%;
  z-index: 20;
  position: fixed;
  bottom: 0px;
  justify-content: center;
}
</style>
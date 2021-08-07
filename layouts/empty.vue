<template>
  <div class="empty-layout">
    <nuxt />
    <div class="text-xs-center">
    <v-snackbar
      class="snackbar"
      v-model="snackbar"
      :timeout = 10000
      :top = true
      color="success"
    >
     <span>{{snackbarText}}</span> 
    </v-snackbar>
  </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
        snackbar: false,
        snackbarText: "",
    }
  },
  computed: {
    error() {
      return this.$store.getters.error
    }
  },
  watch: {
    error(value) {
        this.snackbarText = value.response.data.message
        this.snackbar = true
    }
  }
}
</script>


<style lang="scss" scoped>
  .empty-layout {
    display: flex;
    justify-content: center;
    width: 100%;
    padding-top: 4rem;
  }
</style>

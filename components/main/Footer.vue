<template>

  <v-footer
    color="blue-grey lighten-5"
    padless
  >
    <v-row
      justify="center"
      no-gutters
    >
    <div v-for="(page, n) in pages"
         :key="n" >
        <nuxt-link :to="`/page/${page.url}`" no-prefetch>
      <v-btn
        color="dark"
        text
        rounded
        class="my-2"
      >
        {{ page.title }}
      </v-btn>
      </nuxt-link>
      </div>


    <v-col
        class="blue-grey lighten-5 py-4 text-center dark--text"
        cols="12"
      >
        {{ new Date().getFullYear() }} — <strong>Бестгифт</strong>
      </v-col>
    </v-row>
  </v-footer>

</template>



<script>
export default {
  computed: {
    pages() {
      return this.$store.getters["page/pages"]
    }
  },
  data: () => ({ }),

};
</script>
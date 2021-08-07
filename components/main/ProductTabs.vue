<template>
  <div>
    <v-layout>
      <v-tabs  color="#DD5043 " centered show-arrows>
        <v-tab class="tab-name">Подборки товаров</v-tab>
        <!--  <v-tab class="tab-name">Суперцена</v-tab> -->
        <v-tab class="tab-name">Новинки</v-tab>
        <!--    <v-tab class="tab-name">Акции</v-tab> -->

        <v-tab-item
          v-for="(tab, n) in tabs"
          :key="n"
          style="margin-top: 10px"
        >
          <app-product-list
            :loading="false"
            :products="tab.products"
            :productView="'grid'"
          />
        </v-tab-item>
      </v-tabs>
    </v-layout>

    <!-- <app-Cart-Snackbar :snackbarOpen="snackbarOpen" :productAdd="productAdd" /> -->
  </div>
</template>

<script>
// import AppCartSnackbar from "@/components/main/CartSnackbar";

import AppProductList from "@/components/main/product/ProductList";
export default {
  props: ["recommend", "superPrice", "stock", "news"],
  components: {
    // AppCartSnackbar
    AppProductList,
  },
  data() {
    return {
      setting: null,
      // productAdd: {},
      tabs: [],
      snackbarOpen: false,
    };
  },
  async mounted() {
    // document.location.href = 'https://oauth.vk.com/authorize?client_id=7439076&display=popup&redirect_uri=http://localhost:3000&scope=market,photos,offline&response_type=code&v=5.103'

    this.setting = await this.$store.getters["setting"];

    this.tabs = [
      {
        products: this.recommend,
      },
      {
        products: this.news,
      },
    ];
  },
};
</script>

<style scoped lang="scss">
@import "@/theme/_variables";

.tab-name {
  color: $main-color !important;
  caret-color: $main-color !important;
}
.v-application .primary--text {
  color: $main-color !important;
  caret-color: $main-color !important;
}
</style>

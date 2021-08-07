<template>
  <div>
    <div>
      <div v-if="loading">
        <v-flex text-center>Загрузка...</v-flex>
      </div>

      <div v-if="view === 'grid'">
        <transition name="slide-fade">
          <v-layout wrap v-if="!loading">
            <v-flex
              v-for="product in products"
              :key="product._id"
              xs6
              sm4
              md3
              lg3
              xl2
            >
              <app-Product-Cart :product="product" :view="view" />
            </v-flex>
          </v-layout>
        </transition>
      </div>
      <div v-else>
        <transition name="slide-fade">
          <v-list three-line v-if="!loading">
            <template v-for="(product, index) in products">
              <v-divider :key="index" :inset="true"></v-divider>
              <app-Product-Cart
                :key="product._id"
                :product="product"
                :view="view"
              />
            </template>
          </v-list>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import AppProductCart from "@/components/main/product/ProductCart";
export default {
  props: ["loading", "products", "productView"],
  components: {
    AppProductCart,
  },
  computed: {
    view() {
      return this.productView || this.$store.getters["product/view"];
    },
  },
};
</script>

<style lang="scss" scoped>
.slide-fade-enter-active {
  transition: all 0.9s ease;
}
.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter, .slide-fade-leave-to
        /* .slide-fade-leave-active до версии 2.1.8 */ {
  transform: translateY(40px);
  opacity: 0;
}
</style>

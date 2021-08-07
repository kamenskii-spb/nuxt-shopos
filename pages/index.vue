<template>
  <div>
    <div class="banner-home-wrap">
      <div class="banner-home-main">
         <app-carousel />
        <!-- <v-img src="/b3.png" alt="Пляжные сумки"> </v-img> -->
      </div>

      <div class="banner-home-grid-wrap">
         <nuxt-link to="/category/zonti" no-prefetch>
        <div class="banner-home-grid">
          <img src="/g3.jpg" alt="zonti"  width="100%">
          <!-- <v-img src="/superprice2.png" alt="Пляжные сумки"> </v-img> -->
        </div>
        </nuxt-link>
        <nuxt-link to="/category/golovolomki" no-prefetch>
        <div class="banner-home-grid">
          <img src="/3b2.jpg" alt=""  width="100%">
          <!-- <v-img src="/3b2.jpg" alt="Пляжные сумки"> </v-img> -->
        </div>
        </nuxt-link>
      </div>
    </div>

    <app-productTabs
      v-cloak
      :recommend="recommend"
      :superPrice="superPrice"
      :news="news"
      :stock="stock"
    />
  </div>
</template>

<script>
import AppCarousel from "@/components/main/Carousel";
import AppProductTabs from "@/components/main/ProductTabs";

export default {
  head() {
    return {
      title: `сувениры и подарки `,
      meta: [
        {
          hid: "homepage",
          name: "description",
          content: "Бестгифт - интернет-магазин сувениры и подарки",
        },
        {
          hid: "homepage",
          name: "keywords",
          content:
            "сувениры, подарки, интернет-магазин, подарки к праздникам, оптом",
        },
      ],
    };
  },
  components: {
    AppCarousel,
    AppProductTabs,
  },
  async asyncData({ store }) {
    const recommend = await store.dispatch("product/fetchRecommend");
    const superPrice = await store.dispatch("product/fetchSuperPrice");
    const news = await store.dispatch("product/fetchNews", {});
    const stock = await store.dispatch("product/fetchStock");
    const cart = await store.dispatch("cart/fetchCart");
    return {
      recommend,
      superPrice,
      news,
      stock,
      cart,
    };
  },
};
</script>

<template>
  <div>
    <div
      v-if="view === 'grid'"
      class="product-cart"
      :loading="false"
      :outlined="false"
      :raised="false"
    >
      <div class="cart-wrapper">
        <div class="in-cart-wrapper">
          <nuxt-link :to="`/product/${product.seoUrl}`" no-prefetch>
            <v-hover v-slot:default="{ hover }">
              <div v-if="product.imageSrc" class="image-wrap">
                <v-img
                  :src="product.imageSrc"
                  :lazy-src="product.lazySrc"
                  :alt="product.name"
                  aspect-ratio="1"
                  contain
                >
                  <template v-slot:placeholder>
                    <v-row
                      class="fill-height ma-0"
                      align="center"
                      justify="center"
                    >
                      <v-progress-circular
                        indeterminate
                        color="grey lighten-5"
                      ></v-progress-circular>
                    </v-row>
                  </template>

                  <v-expand-transition>
                    <div
                      v-if="hover"
                      class="d-flex transition-fast-in-fast-out v-card--reveal  "
                      style="height: 100%;"
                    >
                      <app-product-attr
                        :product="product"
                        :classes="['product-attrs', ' text-center']"
                      />
                    </div>
                  </v-expand-transition>
                </v-img>
              </div>
            </v-hover>
            <div class="product-name  text-center">
              <p class="font-weight-medium">{{ product.name }}</p>
            </div>
          </nuxt-link>
          <app-product-price :product="product" :view="view"/>
          <app-product-add-cart :product="product" :view="view" />
        </div>
      </div>
    </div>

    <v-list-item :key="product._id" selectable class="my-2 product-list" v-else>
         <nuxt-link :to="`/product/${product.seoUrl}`" no-prefetch>
      <div class="image-wrap">
        <v-img width="250" 
                  :src="product.imageSrc"
                  :lazy-src="product.lazySrc"
                  :alt="product.name"
                  aspect-ratio="1"
                  contain >
              <template v-slot:placeholder>
                    <v-row
                      class="fill-height ma-0"
                      align="center"
                      justify="center"
                    >
                      <v-progress-circular
                        indeterminate
                        color="grey lighten-5"
                      ></v-progress-circular>
                    </v-row>
                  </template>
        </v-img>
      </div>
       </nuxt-link>
      <v-list-item-content style="min-width:180px">
           <nuxt-link :to="`/product/${product.seoUrl}`" no-prefetch>
        <v-list-item-title v-html="product.name" />
         </nuxt-link>
        <v-list-item-subtitle>
          <app-product-attr
            :product="product"
            :classes="['product-attrs-list']"
          />
        </v-list-item-subtitle>

          <app-product-price :product="product" :view="view"/>
        <app-product-add-cart :product="product" :view="view" />
      </v-list-item-content>
    </v-list-item>
  </div>
</template>

<script>
import AppProductAddCart from "@/components/main/product/ProductAddCart";
import AppProductAttr from "@/components/main/product/ProductAttr";
import AppProductPrice from "@/components/main/product/ProductPrice1";
export default {
  props: ["product", "view"],
  components: {
    AppProductAddCart,
    AppProductAttr,
    AppProductPrice
  },
  mounted() {
    this.quantity = this.product.minimum;
    this.step = this.product.minimum;
  },
};
</script>

<style lang="scss" scoped>
.product-list {
  display: flex;
  flex-wrap: wrap;
  .image-wrap {
    margin-right: 15px;
  }
}

.product-cart {
  margin-right: 5px;
  margin-bottom: 5px;
  cursor: pointer;
}

a{
    color: #494949;
}

.product-name {
  font-size: 0.8rem !important;
  line-height: 1.3rem !important;
  overflow: hidden;
  white-space: pre-wrap;
  margin-top: 10px !important;
  padding: 0 5px 5px 15px !important;
  height: 60px;
  }

.cart-wrapper {
  background-color: #fff;
  overflow: hidden;
}




.v-card--reveal {
  color: rgb(41, 40, 40);
  align-items: center;
  bottom: 0;
  justify-content: center;
  background: rgba(246, 246, 246, 0.7);
  position: absolute;
  width: 100%;
}
</style>

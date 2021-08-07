<template>
  <v-card
    class="product-cart"
    :loading="false"
    :outlined="false"
    :raised="false"
    @mouseenter.prevent.stop="scaleImg('_', $event)"
    @mouseleave.prevent.stop="removeScaleImg('_', $event)"

  >
    <div class="cart-wrapper">
      <!--    <client-only> -->
      <div class="in-cart-wrapper">
        <nuxt-link :to="`/product/${product.seoUrl}`" no-prefetch>
          <div v-if="product.imageSrc" class="image-wrap">
            <!-- <v-lazy-image
                :src="product.images[0].listSrc"
                :src-placeholder="product.images[0].preSrc"
                style="width: 100%; "
                :alt="product.name"
              /> -->

            <v-img
              :src="product.imageSrc"
              :lazy-src="product.lazySrc"
              :alt="product.name"
              aspect-ratio="1"
              contain

            >
              <template v-slot:placeholder>
                <v-row class="fill-height ma-0" align="center" justify="center">
                  <v-progress-circular
                    indeterminate
                    color="grey lighten-5"
                  ></v-progress-circular>
                </v-row>
              </template>
            </v-img>


          </div>
<!--          <v-img v-else height="213px" :src="'/noimage.jpg'"></v-img>-->
          <div class="product-name  text-center">{{
            product.name
          }}</div>
        </nuxt-link>
        <v-card-text style=" padding: 0 15px">
          <ul class="product-attrs  text-center">
            <li v-if="product.model">Артикул: {{ product.model }}</li>
            <li v-if="product.size">Размер: {{ product.size }}</li>
            <li v-if="product.minimum > 1">Минимум: {{ product.minimum }}</li>
          </ul>
          <h3 v-if="!product.newPrice" class="price  text-center ">
            {{ price | currency }}
          </h3>
          <h3 v-if="product.newPrice" class="price  text-center ">
            <span class="mr-4">{{ product.newPrice | currency }}</span>
            <span class="old_price">
              <ins>{{ product.price | currency }}</ins>
              <span class="line-through"></span>
            </span>
          </h3>
        </v-card-text>

        <v-row justify="center" no-gutters class="add-cart">
          <v-col cols="col-12" sm="9" class="text-center" >
            <number-input
              class="text-center"
              :value="product.minimum"
              :step="product.minimum"
              :min="product.minimum"
              size="small"
              inline
              controls
              :ref="product._id + '-quantity'"
            ></number-input>
          </v-col>
          <v-col cols="col-12" sm="3" class="text-center">
            <v-btn icon @click="addToCart(product)" color="blue lighten-1 white--text">
              <span class="d-flex d-sm-none mr1">В корзину</span>
              <v-icon style="font-size: 28px;"
                >mdi-cart-plus</v-icon
              >
            </v-btn>
     
          </v-col>
        </v-row>

        <app-Cart-Snackbar
          :snackbarOpen="snackbarOpen"
          :productAdd="productAdd"
        />
      </div>
      <!--  </client-only> -->
    </div>
  </v-card>
</template>

<script>
import AppCartSnackbar from "@/components/main/CartSnackbar";

export default {
  props: ["product"],
  components: {
    AppCartSnackbar,
  },
  data() {
    return {
      productAdd: {},
      snackbarOpen: false,
      $scaleImg: null
    };
  },
  computed: {
    price() {
      return  this.$store.getters["cart/typeCart"] === 'retail'
              ? this.product.price
              : this.product.wholesalePrice
    }
  },
  methods: {
    scaleImg(_, event){
      this.$scaleImg = event.target.querySelector('.v-image__image')
      this.$scaleImg.classList.add('product-image')

    },
    removeScaleImg(){
    if(this.$scaleImg)
      this.$scaleImg.classList.remove('product-image')
    },
    async addToCart(product) {

      const data = {
        _id: product._id,
        price: product.price,
        seoUrl: product.seoUrl,
        wholesalePrice: product.wholesalePrice,
        imageSrc: product.imageSrc,
        quantity: +this.$refs[product._id + "-quantity"].$refs.input.value || 1,
      };

      if (product.newPrice) {
        data.price = product.newPrice
      }

      await this.$store.dispatch("cart/addToCart", data);
      this.productAdd = product
      this.productAdd.img = product.imageSrc
      this.snackbarOpen = !this.snackbarOpen
    },
  },

};
</script>

<style>

 .v-image__image{ transition: all .3s ease-in-out ; }
 .product-image {
   transform: scale(1.1)
 }

.product-cart {
  margin: 4px;
  cursor: pointer;
}

.add-cart{
  padding:17px 15px;
}


.product-attrs {
  padding: 0 0 5px 0 !important;
  margin: 0;
  height: 55px;
}
.product-attrs li {
  list-style-type: none;
  font-size: 12px;
  line-height: 1.5;
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

.number-input {
  max-width: 86%;
}

.cart-wrapper {
  background-color: #fff;
  overflow: hidden;
}

.price {
  color: #f37f00;
  font-weight: 400;
}

.line-through {
  position: absolute;
  top: 45%;
  left: 0;
  right: 0;
  height: 2px;
  background-color: rgba(60, 60, 60, 0.5);
  transform: rotate(-15deg);
}
.old_price {
  position: relative;
  display: inline-block;
  color: #999;
}

ins {
  text-decoration: none;
}

.number-input__input{

    background-color: #f5f5f5 !important;
    border: 1px solid #bdcfe6 !important;
    border-radius: .25rem;
    display: block;
    font-size: 1rem;
    line-height: 1.5;
    max-width: 100%;
    min-height: 1.5rem;
    min-width: 3rem;
    padding: .4375rem .875rem;
    transition: border-color .15s;
    width: 100%;
}
</style>

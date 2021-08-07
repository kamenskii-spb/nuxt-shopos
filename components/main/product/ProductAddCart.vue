<template>
    <div>
          <v-layout wrap class="add-cart">
            <v-flex :class="{ 'text-center': view === 'grid' }">
              <app-number-input
                :value="quantity"
                :step="step"
                @inputChange="quantity = $event"
              />
              <v-btn
              color="grey darken-4"
              :class="['cart-btn',{ 'my-4': view === 'grid' }]"
              @click="addToCart(product)"
              outlined 
              :loading="loading"
              :disabled="loading"
            >
              В корзину
              <v-icon right dark>mdi-cart-plus</v-icon>
            </v-btn>
            </v-flex>
          </v-layout>
         <app-Cart-Snackbar
            :snackbarOpen="snackbarOpen"
            :productAdd="productAdd"
          />


         </div>

</template>

<script>
import AppCartSnackbar from "@/components/main/CartSnackbar";
import AppNumberInput from "@/components/main/NumberInput";
    export default {
     props:['product', 'view'],
       components: {
    AppCartSnackbar, AppNumberInput
  },
      data() {
    return {
      productAdd: {},
      snackbarOpen: false,
      loading: false,
      quantity: 1,
      step: 1,
    };
  },
    mounted() {
      this.quantity = this.product.minimum
      this.step = this.product.minimum
    },
     methods: {
    async addToCart(product) {

      if(!this.quantity) return
      this.loading = true
      const addProduct = {
        _id: product._id,
        price: product.price,
        seoUrl: product.seoUrl,
        wholesalePrice: product.wholesalePrice,
        imageSrc: product.imageSrc,
        quantity: +this.quantity,
      };

      if (product.newPrice) {
        addProduct.price = product.newPrice;
      }

      await this.$store.dispatch("cart/addToCart", addProduct);
   
      this.productAdd = product;
      this.productAdd.img = product.imageSrc;
      this.snackbarOpen = !this.snackbarOpen;

      this.loading = false
    },
  },
        
    }
</script>

<style lang="scss" scoped>



.cart-btn{
  width: 120px;
  font-size: 12px !important;
  margin-right: 10px;
  margin-bottom: 5px;
}
</style>
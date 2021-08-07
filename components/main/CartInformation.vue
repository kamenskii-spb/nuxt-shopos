<template>
         <nuxt-link to="/order" class="cart-wrap" no-prefetch>
        <v-icon class="top-cart">mdi-cart</v-icon>
        <div class="cart-total-price">
           <!--noindex-->
          <span class="cart-items"  
          v-text="cart.length == 1 ?
           '1 товар' :
            cart.length + ' товаров' " />
            <!--/noindex-->
       
    
          <!--noindex-->
          <span class="cart-price"> &nbsp;{{ totalPrice | currency }} </span
          ><!--/noindex-->
        </div>
      </nuxt-link>
</template>

<script>
    export default {
    computed: {
    cart() {
      return this.$store.getters["cart/cart"];
    },
    totalPrice() {
      return this.$store.getters["cart/totalPrice"];
    }
  },
    }
</script>

<style lang="scss" scoped>
@import "@/theme/_variables";

.top-cart {
  font-size: 30px;
  margin: 0 5px 0 0px;
  color: $main-color;
  cursor: pointer;
}

.cart-items {
  color: $main-color;
  text-decoration: underline;
  cursor: pointer;
  font-size: 11px;
}

.cart-price {
  text-decoration: none;
  color: $main-color;
  font-size: 11px;
}

.cart-wrap {
  display: flex !important;
  text-decoration: none;
}

</style>
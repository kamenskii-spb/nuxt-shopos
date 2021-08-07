<template>
  <v-card-text style=" padding: 0px">
    <h3 v-if="!product.newPrice"  :class="['price',{'text-center': view === 'grid' }]" >
      {{ price | currency }} 
    </h3>
    <h3 v-if="product.newPrice" :class="['price',{'text-center': view === 'grid' }]">
      <span class="mr-4">{{ product.newPrice | currency }}</span>
      <span class="old_price">
        <ins>{{ product.price | currency }}</ins>
        <span class="line-through"></span>
      </span>
    </h3>
  </v-card-text>
</template>

<script>
export default {
    props:['product', 'view'],
      computed: {
    price() {
      return this.$store.getters["cart/typeCart"] === "retail"
        ? this.product.price
        : this.product.wholesalePrice;
    },
  },
};

</script>

<style lang="scss" scoped>


ins {
  text-decoration: none;
}
.price {
  font-size: 1.1em;
  font-weight: 500;
  margin: 6px 0px
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
</style>

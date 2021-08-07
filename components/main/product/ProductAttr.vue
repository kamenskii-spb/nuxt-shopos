<template>
  <ul :class="[...classes]">
    <li v-if="product.model">Артикул: {{ product.model }}</li>
    <li v-if="product.size">Размер: {{ product.size }}</li>
    <li v-if="product.minimum > 1">Минимум: {{ product.minimum }}</li>
  </ul>
</template>

<script>
export default {
    props:['product', 'classes']
};
</script>

<style lang="scss" scoped>


.product-attrs {
  padding: 0 0 5px 0 !important;
  margin: 0;
}

.product-attrs li {
  list-style-type: none;
  font-size: 1rem;
  font-weight: bold;
  line-height: 1.5;
}


  .product-attrs-list {
    padding: 0 0 5px 0 !important;
    margin: 0;
    height: 100%;
  }

  .product-attrs-list li {
    list-style-type: none;
    font-size: 0.9rem;
    line-height: 1.5;
  }

</style>

<template>
<div>
<app-product-form  :product="product" @formHandler="update($event)" />
</div>
</template>

<script>

import AppProductForm from "@/components/admin/product/productForm"

export default {
  layout: "admin",
  middleware: ["admin-auth"],

  async asyncData({ store, params }) {
    const product = await store.dispatch(
      "admin/product/fetchAdminById",
      params.id
    );

    return { product };
  },
  components: {
    AppProductForm
  },
  methods: {
    async update(formData) {
        await this.$store
          .dispatch("admin/product/update", formData)
          .then(product => {
               this.$store.commit('admin/product/changeProduct', product )
               this.$router.push("/admin/product/list");
            this.loading = false;
          })
          .catch(e => {
            console.log(e);
            this.loading = false;
          });
    },
  }
};
</script>


<style  scoped>
.tabs {
  width: 100%;
}
.select-categoty {
  max-height: 300px;
  overflow: auto;
  border: 2px solid #ccc;
}

.image-card {
  max-width: 170px;
}
.image-card:hover {
  cursor: s-resize;
}
.checkbox{
  height: 100px;
  overflow: auto;
  background: #f1f1f1;
  margin-bottom: 20px
}
.v-input--selection-controls{
  margin: 5px
}

</style>


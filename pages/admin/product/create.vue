<template>
  <div>
    <app-product-form :product="null" @formHandler="create($event)" />
  </div>
</template>

<script>

import AppProductForm from "@/components/admin/product/productForm"

export default {
  layout: "admin",
  middleware: ["admin-auth"],
  data(){
    return {
      formData: {}
    }
  },

  components: {
      AppProductForm
  },
  methods: {
    async create(formData) {
        await this.$store
          .dispatch("admin/product/create", formData)
          .then (product => {
            this.$store.commit('admin/product/addProduct', product )
            this.$router.push("/admin/product/list?message=success");
            this.loading = false;
          })
          .catch((e) => {
            console.log(e);
            this.loading = false;
          });
      }
  },
};
</script>

<style scoped>

</style>

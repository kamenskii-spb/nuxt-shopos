<template>
  <app-category-form @formHandler="create($event)" :loading="loading" :category="null"  />
</template>

<script>

import AppCategoryForm from "@/components/admin/category/categoryForm"

export default {
  layout: "admin",
  middleware: ["admin-auth"],
  data(){
    return {
      loading: false
    }
  },
  components:{
    AppCategoryForm
  },
  methods: {
    async create(formData) {
        this.loading = true;
        await this.$store
          .dispatch("admin/category/create", formData)
          .then(() => {
            this.$router.push("/admin/category/list?message=success");
            this.loading = false;
          })
          .catch(e => {
            console.log(e);
            this.loading = false;
          });
    },
  },

};
</script>

<style lang="scss" scoped>


</style>




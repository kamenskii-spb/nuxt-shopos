<template>
  <app-category-form
   @formHandler="update($event)"
     :loading="loading"
     :category="category" />
</template>


<script>

import AppCategoryForm from "@/components/admin/category/categoryForm"

  export default {
  layout: "admin",
  middleware: ["admin-auth"],
  head: {
    title: `Категория`
  },
  data(){
    return {
      loading: false
    }
  },
  components:{
    AppCategoryForm
  },
 
  methods: {
    async update(formData) {
       this.loading = true;
        await this.$store
          .dispatch("admin/category/update", formData)
          .then(() => {
            this.$router.push("/admin/category/list");
            this.loading = false;
          })
          .catch(e => {
            console.log(e);
            this.loading = false;
          });
      
    },
  
  },
  async asyncData({ store, params }) {
    const category = await store.dispatch(
      "admin/category/fetchAdminBySeoUrl",
      params.id
    );

    return { category };
  },

};
</script>
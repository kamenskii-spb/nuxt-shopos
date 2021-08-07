<template>
    <div class="breadcrumbs" >
        <v-breadcrumbs  v-if="breadcrumbs.length" :items="breadcrumbs">
        <template v-slot:item="props">
          <v-breadcrumbs-item :to="'/category/' + props.item.seoUrl">{{
            props.item.text.toUpperCase()
          }}</v-breadcrumbs-item>
        </template>
      </v-breadcrumbs>
    </div>
</template>



<script>
export default {
  props: ["category", 'categoryId'],
    data() {
      return {
            breadcrumbs: []
        }
    },
   async mounted() {
          await this.$store.dispatch("category/clearBreadcrumbs");
           // let  cat = await this.$store.dispatch("category/fetchBreadcrumbsById", this.category._id);
           //
           //  console.log(this.category)
        if(this.category) {
            await this.$store.dispatch("category/getBreadcrumbs", this.category);
            this.breadcrumbs = await this.$store.getters["category/categoryBreadcrumbs"];
        }

        if(this.categoryId && !this.category){
          const categories = await this.$store.getters["category/categories"];
           if(categories.length){
             const result =  categories.find(c => c._id === this.categoryId)
               if(result){
                   await this.$store.dispatch("category/getBreadcrumbs", result);
                   this.breadcrumbs = await this.$store.getters["category/categoryBreadcrumbs"];
               }
           }
        }


       if (typeof this.breadcrumbs[0] !== 'undefined'){
           await this.$store.dispatch("category/activeCategory", this.breadcrumbs[0].href);
       }

   }
};
</script>

<style scoped>

.breadcrumbs {
   height: 40px;
}

.v-application ul, .v-application ol,  .v-breadcrumbs{
   padding: 0;
   margin: 5px 0 15px 0;
   text-transform: lowercase;
}
  
</style>
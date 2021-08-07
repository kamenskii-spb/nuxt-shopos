<template>
  <v-flex xs12 class="my-5 mx-2" v-if="categories">
    <h5 class="my-1 ">Подкатегории:</h5>
    <v-layout row wrap>
      <v-flex
        style="padding:5px;"
        v-for="children in categories"
        :key="children._id"
        lg3
        md4
        sm4
        xs6
      >
        <app-category-cards :category="children" />
      </v-flex>
    </v-layout>
  </v-flex>
</template>

<script>
import AppCategoryCards from "@/components/main/category/CategoryCards";
export default {
  props: ["categories"],
  components:{
      AppCategoryCards
  }
};
</script>

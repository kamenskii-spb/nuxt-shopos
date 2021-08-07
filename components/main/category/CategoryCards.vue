<template>
  <nuxt-link :to="`/category/${category.seoUrl}`" no-prefetch>
    <v-hover v-slot:default="{ hover }">
      <v-card
        :elevation="hover ? 5 : 2"
        class="mx-auto"
        max-width="250"
        style="cursor:pointer"
        
      >
        <v-img
          v-if="category.imageSrc"
          :src="`/catalog/categories/${category._id}/${category.imageSrc}`"
          :alt="category.name"
          lazy-src="/lazy.jpg"
          height="190px"
          class="align-end"
          contain
        >
          <template v-slot:placeholder>
            <v-row class="fill-height ma-0" align="center" justify="center">
              <v-progress-circular
                indeterminate
                color="grey lighten-5"
              ></v-progress-circular>
            </v-row>
          </template>

          <v-card-title
            v-text="category.name"
           class="card-title"
          ></v-card-title>
        </v-img>

        <v-img
          v-else
          :src="`/noimage.jpg`"
          class="align-end"
          style="color:#333"
          height="200px"
          contain
          
        >
          <v-card-title
            class="card-title"
            v-text="category.name"
          ></v-card-title>
        </v-img>
      </v-card>
    </v-hover>
  </nuxt-link>
</template>

<script>
export default {
  props: ["category"],
};
</script>

<style scoped>
.card-title{
background-color: rgba(246, 246, 246, 0.70);
 font-size: .9rem;
 line-height: 1.2rem;
 padding: 13px;
}
</style>

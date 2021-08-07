<template>
   <div class="text-center">
      <v-snackbar
      top
      right
       v-model="snackbar" color="#fff"  style="padding:0"
       vertical 
       :timeout="5000">
  <v-card
    class="mx-auto"
    width="100%"
    outlined
  >
    <v-list-item three-line>
      <v-list-item-content >
        <div class="overline mb-0" >Товар добавлен в корзину</div>
         <nuxt-link :to="`/product/${productAdd.seoUrl}`">
        <v-list-item-subtitle >{{ productAdd.name }}</v-list-item-subtitle>
         </nuxt-link>
      </v-list-item-content>

      <v-list-item-avatar
        tile
        size="80"
        color="grey"
        v-if="productAdd.img"
      >
      <v-img :src="productAdd.img"></v-img>
      </v-list-item-avatar>
     
    </v-list-item>

    <v-card-actions style="margin: 0 15px 10px 15px">
    <nuxt-link to="/order" no-prefetch>
      <v-btn text small color="primary" class="mt-0">В корзину</v-btn>
     </nuxt-link>
      <v-spacer></v-spacer>
      <v-btn @click="snackbar = false" text small  color="#ccc" class="mt-0">Закрыть</v-btn>
    </v-card-actions>

  </v-card>
      </v-snackbar>

    </div>

</template>

<script>
export default {
    props: ['productAdd','snackbarOpen'],
    data() {
    return {
      snackbar: false,
    };
  },
   watch: {
    productAdd:  function() {
       this.snackbar = false
       this.snackbar = true
    },
    snackbarOpen:  function() {
       this.snackbar = false
       this.snackbar = true
    }
  },
 
}
</script>
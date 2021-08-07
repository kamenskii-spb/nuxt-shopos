<template>
  <div>
      <client-only>
    <v-container fluid>
      <h1 class="mb-9">Cart Keeper</h1>
      <v-layout row>
        <v-expansion-panels focusable>
          <v-expansion-panel  v-for="(cart, i) in carts" :key="i">
            
            <v-expansion-panel-header>
         
             <div style="display: contents" class="userLink" v-if="cart.cart.user_id" @click.stop="toUser(cart.cart.user_id)" >{{cart.cart.user_name}}</div>  
        
             <div v-else >{{cart.cart.cart_token}}</div>  
              <v-spacer></v-spacer> 
             {{cart.cart.date | date('date')}} | {{cart.cart.type_cart}}
            </v-expansion-panel-header>

            <v-expansion-panel-content>

    <v-simple-table>
      <thead>
        <tr>
          <!-- <th class="text-left">Изображение</th> -->
          <th class="text-left">Модель</th>
          <th class="text-left">Название</th>
          <th class="text-left">Количество</th>
          <th class="text-left">Цена за шт.</th>
          <th class="text-left">Всего</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="product in cart.products" :key="product._id">
          <td>{{ product.model || '-'}}</td>
          <td>
            <nuxt-link :to="`/product/${product._id}`">{{ product.name }}</nuxt-link>
          </td>
          <td>{{product.quantity}}</td>
        <td><nobr>{{product.newPrice? product.newPrice : product.price || '0'  | currency}}</nobr></td>
                  <td> <nobr>{{product.newPrice? Math.floor( product.newPrice * product.quantity) : Math.floor( product.price * product.quantity)  | currency }}</nobr></td>
          <td></td>
        </tr>
      </tbody>
    </v-simple-table>
           
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-layout>
    </v-container>
    </client-only>
  </div>
</template>

<script>
export default {
  layout: "admin",
  middleware: ["admin-auth"],
  data() {
    return {};
  },
 async asyncData({ $axios }) {
   const carts = await $axios.$get(`/api/cart/getAll`)
   return {carts}
  },
  methods: {
    toUser(id){
        this.$router.push('/admin/user/'+id)
    }
  },
};
</script>

<style lang="scss" scoped>
.userLink{
  color: #4B8BF4;
}
.userLink:hover{
  color: #4B8BF4;
  text-decoration: underline;
}
</style>

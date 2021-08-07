<template>
  <div>
       <v-breadcrumbs style="padding-left: 0; padding-top: 0;" >
          <nuxt-link to="/account" no-prefetch>
            <v-breadcrumbs-item  >История заказов</v-breadcrumbs-item>
          </nuxt-link>
         
        </v-breadcrumbs>
               <h3>Заказ {{order.order}}</h3>
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
                <tr v-for="product in order.order_product" :key="product._id">
                  <!-- <td>
                    <v-list-item-avatar tile size="40" color="grey">
                      <v-img :src="product.imageSrc"></v-img>
                    </v-list-item-avatar>
                  </td> -->
                  <td>{{ product.model || '-'}}</td>
                  <td>
                 {{ product.name }}
                  </td>
                  <td>
                 {{product.quantity}}
                  </td>
                  <td>{{ product.price || '0' }} руб</td>
                  <td>{{ product.price * product.quantity }} руб</td>
                  <td>
                 
                  </td>
                </tr>
              </tbody>
            </v-simple-table>
           <p v-if="order.delivery.price > 0" class="text-right mr-10 mt-5" >Доставка: {{order.delivery.price}} руб</p>
           <p  class="text-right mr-10 mt-5" >Итого: {{order.totalPrice}} руб</p>
  </div>
</template>



<script>
export default {
middleware: ["account-auth"],
 async asyncData({ store, params, route }) {
    const id = params.id
    const  order = await store.dispatch("admin/order/fetch", id);
return {order}

},
mounted() {

},

}
</script>

<style>

</style>
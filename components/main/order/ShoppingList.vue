<template>
  <div>
    <!-- //cartorder -->
    <h3 
    v-text="typeCart === 'retail' ?
     'Розничная корзина покупок' :
      'Оптовая корзина покупок'" />

         <v-alert
             class="my-1"
          v-if="typeCart !== 'retail' && productsPrice < 5000 "
      dense
      outlined
      type="warning"

    >
     <span style="color: #000" >
        До оптового заказа осталось добрать на
         <span style="color: red" >{{5000 - productsPrice }} р.</span> 
          </span>
    </v-alert>
    <v-simple-table>
      <thead>
        <tr>
          <th class="text-left">Изображение</th>
          <th class="text-left">Модель</th>
          <th class="text-left">Название</th>
          <th class="text-left">Количество</th>
          <th class="text-left">Цена за шт.</th>
          <th class="text-left">Всего</th>
          <th class="text-left"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="product in products" :key="product._id">
          <td>
            <v-list-item-avatar tile size="40" color="grey">
              <v-img :src="product.imageSrc"></v-img>
            </v-list-item-avatar>
          </td>
          <td>{{ product.model || "-" }}</td>
          <td>
            <nuxt-link :to="`/product/${product._id}`">{{
              product.name
            }}</nuxt-link>
          </td>
          <td>
            <app-number-input
              :value="product.quantity"
              :loading="loading"
              :step="1"
              @inputChange="quantityChange(product._id, $event)"
            />
          </td>
          <td>
            <span class="price">{{
              product.newPrice
                ? product.newPrice
                : product.price || "0" | currency
            }}</span>
          </td>
          <td>
            <span class="price"
              >{{
                product.newPrice
                  ? Math.floor(product.newPrice * product.quantity)
                  : Math.floor(product.price * product.quantity) | currency
              }}
            </span>
          </td>
          <td>
            <span @click="remove(product)" class="del-link">Удалить</span>
          </td>
        </tr>
      </tbody>
    </v-simple-table>

    <ul class="cart-result">
      <!-- <li v-if="discount">Скидка: -</li> -->
      <li>Итого: {{ productsPrice | currency }}</li>
    </ul>
  </div>
</template>

<script>
import AppNumberInput from "@/components/main/NumberInput";
export default {
    data(){
        return{
            loading: false
        }
    },
  props: ["products"],
  computed: {
    productsPrice() {
      return this.$store.getters["cart/totalPrice"];
    },
    typeCart() {
      return this.$store.getters["cart/typeCart"] || "retail";
    },
  },
  components: {
    AppNumberInput,
  },
  methods: {
    async remove(product) {
    const  confirmDel = confirm(`Удалить ${product.name}?`);
      if(!confirmDel) return
       if (!this.loading) {
         this.loading = true
         this.order_product = await this.$store.dispatch("cart/remove", product._id)
       }
        this.loading = false
    },
    async quantityChange(id, quantity) {
      if (!this.loading) {
         this.loading = true
        const data = {id,quantity,}

        this.order_product = await this.$store.dispatch(
          "cart/changeQuantity",
          data
        )
       
      }
       this.loading = false
    },
  },
};
</script>

<style scoped>
a{
    color: rgba(0, 0, 0, 0.87);
}
.price{
    white-space: nowrap;
}
.theme--light.v-data-table
  tbody
  tr:hover:not(.v-data-table__expanded__content) {
  background: #fff;
}
.del-link {
  cursor: pointer;
}

.cart-result {
  list-style-type: none;
  padding: 15px 5px;
  right: 0px;
}

.cart-result li {
  margin-top: 5px;
}
</style>

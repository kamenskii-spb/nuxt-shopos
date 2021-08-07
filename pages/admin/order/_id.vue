<template>
  <div>
    <v-breadcrumbs style="padding-left: 0; padding-top: 0;">
      <nuxt-link to="/admin/">
        <v-breadcrumbs-item>Заказы</v-breadcrumbs-item>
      </nuxt-link>
    </v-breadcrumbs>
    <h3>Заказ {{order.order}}</h3>

    <v-card class="mx-auto" width="100%">
      <v-layout class="mb-3 mt-3" row wrap style="padding: 15px 30px 15px 20px;">
        <v-flex shrink md6 xs6>
          <ul class="order-info">
            <li>
              <strong>Имя:</strong>
              {{order.name}}
            </li>
            <li>
              <strong>Фамилия:</strong>
              {{order.lastName}}
            </li>
            <li>
              <strong>Email:</strong>
              {{order.email}}
            </li>
            <li>
              <strong>Адрес:</strong>
              {{order.address}}
            </li>
               <li>
              <strong>Телефон:</strong>
              {{order.phone}}
            </li>
            <li>
              <strong>Комментарий:</strong>
              {{order.comment}}
            </li>
          </ul>
        </v-flex>
        <v-flex shrink md6 xs6>
          <ul class="order-info">
            <li>
              <strong>Способ оплаты :</strong>
              {{order.payment.label}}
            </li>
            <li>
              <strong>Способ доставки :</strong>
              {{order.delivery.label}} - {{order.delivery.price+'р'}}
            </li>
          </ul>
        </v-flex>
      </v-layout>
    </v-card>
    <v-select
      @change="changeStatus(order._id)"
      style="width:170px"
      v-model="order.status"
      item-text="name"
      :items="orderStatus"
      item-value="id"
      label="Статус заказа"
      outlined
    ></v-select>
    <!-- <v-list-item>
      <v-list-item-content>
        <v-list-item-title>Имя</v-list-item-title>
        <v-list-item-subtitle>{{order.name}}</v-list-item-subtitle>
          <v-list-item-title>Фамилия</v-list-item-title>
        <v-list-item-subtitle>{{order.lastName}}</v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>

    <v-list-item two-line>
      <v-list-item-content>
        <v-list-item-title>Способ оплаты</v-list-item-title>
        <v-list-item-subtitle>вввв</v-list-item-subtitle>
          <v-list-item-title>Способ доставки</v-list-item-title>
        <v-list-item-subtitle>вввв</v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>-->

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
          <td>{{ product.model || '-'}}</td>
          <td>
            <nuxt-link :to="`/product/${product.id}`">{{ product.name }}</nuxt-link>
          </td>
          <td>{{product.quantity}}</td>
        <td><nobr>{{product.newPrice? product.newPrice : product.price || '0'  | currency}}</nobr></td>
                  <td> <nobr>{{product.newPrice? Math.floor( product.newPrice * product.quantity) : Math.floor( product.price * product.quantity)  | currency }}</nobr></td>
          <td></td>
        </tr>
      </tbody>
    </v-simple-table>

    <p class="text-right mr-10 mt-5">Итого {{order.totalPrice}}</p>
  </div>
</template>



<script>
export default {
  layout: "admin",
  middleware: ["admin-auth"],
  data() {
    return {
      orderStatus: ["Отменён", "Завершен", "В обработке", "Ожидание"]
    };
  },
  async asyncData({ store, params, route }) {
    const id = params.id;
    const order = await store.dispatch("admin/order/fetch", id);
    return { order };
  },

  methods: {
    changeStatus(id) {
      const data = {
        id: id,
        status: this.order.status
      };
      this.$store.dispatch("admin/order/changeStatus", data);
    }
  }
};
</script>

<style scoped>
.order-info {
  list-style: none !important;
}
.order-info li {
  padding: 0px 0;
  font-size: 12px;
}
</style>













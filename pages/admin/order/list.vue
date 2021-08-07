<template>
  <div>
    <h3  v-if="orders.length == 0"  >Заказов нет</h3>
      <v-simple-table v-if="orders.length > 0" id="top">
          <thead>
            <tr>
              <th class="text-left">Номер заказа</th>
               <th class="text-left">Клиент</th>
               <th class="text-left">Статус</th>
              <th class="text-left">Дата</th>
              <th class="text-left">Сумма заказа</th>
            </tr>
          </thead>
          <tbody>
            <tr style="cursor: pointer" @click="openOrder(order)" v-for="(order, index) in orders" :key="index" >
              <td>{{order.order}}</td>
               <td>{{order.name}} {{order.lastName}}</td>
               <td>{{order.status}}</td>
              <td>{{order.date | date('date')}}</td>
              <td>{{order.totalPrice}} руб.</td>
            </tr>
          </tbody>
        </v-simple-table>
                   <div class="text-center pagination-t" v-if="paginationLength > 1">
          <v-pagination
            v-model="page"
            :length="paginationLength"
            prev-icon="mdi-menu-left"
            next-icon="mdi-menu-right"
          ></v-pagination>
        </div>
  </div>
</template>

<script>
export default {
    layout: 'admin',
    middleware: ['admin-auth'],
    data() {
      return {
        orders:[],
        paginationLength: 0,
        page: 1,
        limit: 24
      }
    },
  async asyncData({ store, params, route }) {

  const query = {
      getParams: route.query
    };
  const orders = await store.dispatch("admin/order/fetchAll", query);
  const orderCount =  await store.dispatch("admin/order/fetchCount");
  return {
    orders,orderCount
  }
  },
  mounted() {
     this.paginationLength =  Math.ceil(this.orderCount / this.limit);
  },
  methods: {
    openOrder(order){
   this.$router.push(`/admin/order/${order._id}`)
    }
  },
    watch: {
    "$route.params": async function() {
      const query = {
        getParams: this.$route.query
      };
     this.orders = await this.$store.dispatch("admin/order/fetchAll", query);

      // this.products = category.products;
      // this.paginationLength = Math.ceil(this.productsCount / this.limit);
       this.$vuetify.goTo("#top");
    },
    page: async function() {
  
      const start = this.limit * this.page - this.limit;

      this.$router.push(
        `/admin/order/list?start=${start}`
      );

      

    }
  },
}
</script>
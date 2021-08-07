<template>
  <div>
    <h3 v-if="orders.length == 0">Заказов нет</h3>
    <div class="order order-header" style=" margin-bottom: 15px">
      <div class="order-info ">Номер заказа</div>
      <div class="order-info" style="width: 200px; padding-right: 5px">
        Клиент
      </div>
      <div class="order-info">Статус</div>
      <div class="order-info">Дата</div>
      <div class="order-info">Сумма заказа</div>
    </div>

    <div
      v-for="(order, index) in orders"
      :key="index"
      @click="openOrder(order)"
      style="cursor: pointer"
    >
      <v-hover v-slot:default="{ hover }">
        <v-alert
          :elevation="hover ? 5 : 0"
          border="right"
          colored-border
          :type="order.type"
          :color="order.status === 'Отменён' ? 'grey ' : null"
        >
          <div class="order">
            <div class="order-info font-weight-medium">{{ order.order }}</div>
            <div class="order-info" style="width: 200px; padding-right: 5px">
              {{ order.name }} {{ order.lastName }}
            </div>
            <div class="order-info">{{ order.status }}</div>
            <div class="order-info">{{ order.date | date("date") }}</div>
            <div class="order-info">{{ order.totalPrice }} руб.</div>
          </div>
        </v-alert>
      </v-hover>
    </div>

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
  layout: "admin",
  middleware: ["admin-auth"],
  data() {
    return {
      orders: [],
      paginationLength: 0,
      page: 1,
      limit: 24,
    };
  },
  async asyncData({ store, params, route }) {
    const query = {
      getParams: route.query,
    };
    const orders = await store.dispatch("admin/order/fetchAll", query);

    const orderCount = await store.dispatch("admin/order/fetchCount");
    return {
      orders,
      orderCount,
    };
  },
  mounted() {
    this.paginationLength = Math.ceil(this.orderCount / this.limit);
  },
  methods: {
    openOrder(order) {
      this.$router.push(`/admin/order/${order._id}`);
    },
  },
  watch: {
    "$route.params": async function() {
      const query = {
        getParams: this.$route.query,
      };
      this.orders = await this.$store.dispatch("admin/order/fetchAll", query);
    },
    page: async function() {
      const start = this.limit * this.page - this.limit;

      this.$router.push(`/admin/?start=${start}`);
    },
  },
};
</script>

<style scoped lang="scss">
.order {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.order-header {
  padding: 10px 0;
}
.order-header .order-info {
  padding: 0 20px;
  word-break: break-word;
}
.order-info {
  min-width: 100px;
}

@media screen and (max-width: 620px) {
  .order {
    flex-direction: column;
  }
  .order-header {
    display: none;
  }
}
</style>

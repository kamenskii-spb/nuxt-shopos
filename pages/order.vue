<template>
  <div>
    <v-layout
        v-if="order_product.length === 0 && !success"
        align-center
        justify-center
    >
      <h3>Ваша корзина пуста</h3>
    </v-layout>

    <v-layout v-if="success" align-center justify-center>
      <div>
        <h3>Ваш заказ принят!</h3>
        <p>
          Номер заказа <strong>{{ orderNumber }}</strong> <br/>
          Если у Вас возникли вопросы, пожалуйста свяжитесь с нами.<br/>
          Спасибо за покупки в нашем интернет-магазине!<br/>
        </p>
      </div>
    </v-layout>

    <v-stepper v-model="e1" v-if="order_product.length > 0 && !success">
      <v-stepper-header>
        <v-stepper-step
            class="stepper-step"
            @click="e1 = 1"
            :complete="e1 > 1"
            step="1"
        >Корзина покупок
        </v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step :complete="e1 > 2" step="2"
        >Оформление заказа
        </v-stepper-step
        >
      </v-stepper-header>

      <v-stepper-items>
        <v-stepper-content step="1">
          <app-shopping-list :products="order_product"/>
          <v-btn style="margin-top:40px" small color="primary" @click="e1 = 2"
          >Оформить заказ
          </v-btn
          >
        </v-stepper-content>

        <v-stepper-content step="2">
          <v-layout row wrap>
            <v-flex shrink xs12 md6 class="order-data">
              <app-user-form
                  @changeData="userFormData = $event"
                  :delivery="delivery.label"
              />
            </v-flex>

            <v-flex xs12 md6 class="order-data">
              <app-payment-method @changeMethod="payment = $event"/>
              <app-delivery-method @changeMethod="delivery = $event"/>
            </v-flex>

          </v-layout>

          <v-layout column>
            <v-flex>
              <ul class="cart-result order-data">
                <li v-if="delivery.price">
                  Товаров на: {{ totalPrice }} руб
                </li>
                <li v-if="delivery.price">
                  Доставка: {{ delivery.price }} руб
                </li>
                <li>Итого: {{ computedTotalPrice | currency }}</li>
              </ul>
            </v-flex>
            <v-flex>
              <v-btn color="primary"
                     small
                     @click.stop.prevent="orderSuccess"
              >Подтверждение заказа
              </v-btn
              >
            </v-flex>
          </v-layout>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
  </div>
</template>

<script>
import AppShoppingList from "@/components/main/order/ShoppingList";
import AppUserForm from "@/components/main/order/forms/UserForm";
import AppPaymentMethod from "@/components/main/order/forms/PaymentMethod";
import AppDeliveryMethod from "@/components/main/order/forms/DeliveryMethod";

export default {
  data() {
    return {
      userFormData: {
        validate: () => {
          return false
        }
      },
      payment: {
        label: "За наличный расчет",
        price: 0,
      },
      delivery: {
        label: "Самовывоз",
        price: 0,
      },
      success: false,
      orderNumber: "Без номера",
      step: 1,
      loading: true,
      e1: 0,
      order_product: []
    };
  },
  components: {
    AppShoppingList,
    AppUserForm,
    AppPaymentMethod,
    AppDeliveryMethod
  },
  head() {
    return {
      title: `Заказ | Оформление`
    };
  },
  async mounted() {
    this.order_product = await this.$store.dispatch("cart/fetchCart")
    this.$store.watch(
        (state, getters) => getters["cart/cart"],
        async (newValue, oldValue) => {
          if (newValue) {
            this.order_product = await this.$store.getters["cart/cart"]
          }
        }
    );


    this.loading = false;
  },
  computed: {
    computedTotalPrice() {
      return this.$store.getters["cart/totalPrice"] + this.delivery.price
    },
    totalPrice() {
      return this.$store.getters["cart/totalPrice"]
    },
  },
  methods: {
    async orderSuccess() {
      if (!this.userFormData.validate() || !this.order_product.length) return
      const formData = {
        name: this.userFormData.name,
        lastName: this.userFormData.lastName,
        email: this.userFormData.email,
        phone: this.userFormData.phone,
        address: this.userFormData.address,
        comment: this.userFormData.comment,
        delivery: this.delivery,
        payment: this.payment,
        totalPrice: this.totalPrice,
        order_product: this.order_product,
      };
      const user = this.$store.getters["auth/user"]
      if (user._id) formData.userId = user._id

      const order = await this.$store.dispatch("admin/order/create", formData)

      if (order) {
        this.success = true
        this.orderNumber = order.order
        // this.$router.push("/success");
      }
    },
  },
};
</script>

<style scoped>
.stepper-step {
  cursor: pointer;
}

.order-data {
  padding: 15px;
}

.cart-result {
  list-style-type: none;

}
</style>

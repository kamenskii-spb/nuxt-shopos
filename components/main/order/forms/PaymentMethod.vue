<template>
  <div>
    <p>Способ оплаты</p>
    <v-radio-group v-model="payment" :mandatory="false">
      <v-radio
        v-for="(paymentMethod, n) in paymentMethods"
        :key="n"
        :label="paymentMethod.label"
        :value="paymentMethod"
      ></v-radio>
    </v-radio-group>
  </div>
</template>

<script>
export default {
  data() {
    return {
      payment: "За наличный расчет",
      paymentMethods: [
        { label: "Оплата картой (только при самовывозе)" },
        { label: "За наличный расчет" },
        { label: "Перевод на карту сбербанка" },
        { label: "Оплата по счету" },
        { label: "Курьеру при получении заказа" },
      ],
    };
  },
  mounted() {
    this.payment = this.paymentMethods[0];
  },
  updated() {
    this.$emit("changeMethod", this.payment);
  },
};
</script>

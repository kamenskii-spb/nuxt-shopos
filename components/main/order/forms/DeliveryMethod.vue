<template>
  <div>
    <p>Способ доставки</p>
    <v-radio-group
        v-model="delivery"
        :mandatory="false"
    >
      <v-radio
          v-for="(deliveryMethod, n) in deliveryMethods"
          :key="n"
          :label="deliveryMethod.label"
          :value="deliveryMethod"
      ></v-radio>
    </v-radio-group>
  </div>
</template>

<script>
export default {
  data(){
    return {
      delivery: {
        label: "",
      },
      deliveryMethods: [
        {
          label: "Самовывоз",
          price: 0,
        },
        {
          label: "Доставка до СДЭК",
          price: 0,
        },
        {
          label: "По Санкт-Петербургу - 300.00р.",
          price: 300,
        },
        {
          label: "До транспортной компании в Санкт-Петербурге - 300.00р.",
          price: 300,
        },
      ]
    }
  },
  mounted() {
    this.delivery = this.deliveryMethods[0];
  },
  updated() {
    this.$emit("changeMethod", this.delivery);
  }

}
</script>


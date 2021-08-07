<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <div>
        <h3>Ваш заказ принят!</h3> 
        <p>
      Номер заказа <strong>{{order}}</strong>  <br>
      Если у Вас возникли вопросы, пожалуйста свяжитесь с нами.<br>
      Спасибо за покупки в нашем интернет-магазине!<br>
        </p>
  </div>
    </v-layout>
  </v-container>
</template>

<script>


  export default {
    middleware: ['success-order'],
    data () {
      return {
          order: 0
      }
    },
    head(){
    return {
      title: `Завершение`
    }
  },
     mounted() {
        this.order = this.$store.getters["admin/order/orderSuccess"]
        this.$store.commit('admin/order/clearOrderSuccess')

    // this.images = this.product.images
  }

    
  
  }
</script>

<template>
  <div>
    <v-overlay opacity="0.3" :value="cartChangeDialog">
      <div
        @click="closeDialog"
        style="position: fixed; top:0; left:0; right:0; bottom:0"
      ></div>
    </v-overlay>
    <transition name="slide-fade">
      <div
        v-if="cartChangeDialog"
        max-width="330"
        style="position: absolute; z-index:5; margin-left:15px"
      >
        <v-card class="typeCart-wrap">
          <div v-if="typeCart === 'retail'">
            <p class="font-weight-medium">
              Перейти в режим "оптовые покупки"? <br />
              Минимальная сумма оптового заказа 5000 р.
            </p>
          </div>
          <div v-else>
            <p class="font-weight-medium">
              Перейти в режим "розничные покупки"?
            </p>
          </div>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color=" darken-3" text @click.prevent.stop="closeDialog()">
              Отмена
            </v-btn>
            <v-btn
              color="green darken-1"
              text
              @click.prevent="changeCartHandler"
            >
              Перейти
            </v-btn>
          </v-card-actions>
        </v-card>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  computed: {
    cartChangeDialog() {
      return this.$store.getters["dialog/cartChangeDialog"];
      
    },
    typeCart() {
      return this.$store.getters["cart/typeCart"] || "retail";
    },
  },
  methods: {
    changeCartHandler() {
      this.$store.dispatch("cart/changeCartType");
      this.$store.commit("dialog/closeAll", 'cart1');
      
    },
    closeDialog() {
      this.$store.commit("dialog/closeAll", 'cart2');
    },
  },
};
</script>

<style scoped>
.typeCart-wrap {
  padding: 30px 10px 15px 10px;
}

.slide-fade-enter-active {
  transition: all 0.3s ease;
}

.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter, .slide-fade-leave-to
        /* .slide-fade-leave-active до версии 2.1.8 */
 {
  /* transform: translateY(40px); */
  opacity: 0;
}
</style>

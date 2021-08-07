<template>
  <div>
    <v-app-bar :flat="true" clipped-right color="#fff" dense class="app-bar">

      <v-toolbar-items ref="register" class="top-links ">
         <v-btn @click.prevent="loginChangeDialog" v-if="!user._id" text
          ><!--noindex-->Вход | Регистрация<!--/noindex-->
          </v-btn
        >
        <v-btn @click.prevent="goToAcc" v-if="user._id" text
          ><!--noindex-->
          Личный кабинет
          <!--/noindex-->
        </v-btn>
   <!--noindex-->
        <v-btn @click.prevent="changeCartDialog" text class="cart-type">
          <span
            v-text="typeCart === 'retail' ? 'Купить оптом' : 'Купить в розницу'"
          />
        </v-btn>
         <!--/noindex-->
      </v-toolbar-items>
      <v-spacer></v-spacer>

      <div class="d-none d-sm-block d-md-block ">
        <app-cart-info />
      </div>


    </v-app-bar>

    <app-cart-change-dialog />
    <app-login-dialog />
  </div>
</template>

<script>
import AppCartChangeDialog from "@/components/main/navbar/CartChangeDialog";
import AppLoginDialog from "@/components/main/navbar/LoginDialog";
import AppCartInfo from "@/components/main/CartInformation";


export default {
  components: {
    AppCartChangeDialog,
    AppLoginDialog,
    AppCartInfo
  },
  computed: {
    user() {
      return this.$store.getters["auth/user"];
    },
    typeCart() {
      return this.$store.getters["cart/typeCart"] || "retail";
    },
  },
  methods: {
    goToAcc() {
      this.loginDialog = false;
      this.$router.push("/account");
    },
    changeCartDialog() {
    this.$store.commit("dialog/setDialog", {dialog: 'cartChangeDialog', value: true});
    },
    loginChangeDialog() {
      this.$store.commit("dialog/setDialog", {dialog: 'loginDialog', value: true});
    },
  },
};
</script>

<style scoped lang="scss">
@import "@/theme/_variables";
.cart-type{
  color: $main-color;
}

.app-bar {
  border-bottom: 1px solid #e5e5e5 !important;
  border-top: 1px solid #e5e5e5 !important;
}

.v-dialog > .v-card > .v-card__title {
  font-size: 0.8rem;
  padding: 15px;
}
.tooltip{
  z-index: 99999;
}
</style>

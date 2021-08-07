<template>
  <div>
    <!-- <v-overlay opacity="0.3" :value="loginDialog"> -->
      <div
        v-if="loginDialog"
        @click.prevent.stop="closeDialog"
        class="cost-overlay"
      ></div>
    <!-- </v-overlay> -->

    <transition name="slide-fade">
        <v-card
          v-if="loginDialog"
          max-width="420"
          style="position: absolute; z-index:999; margin-left:15px"

         class="pa-5 mx-lg-auto">
          <v-form v-model="valid" ref="form" validation>
            <v-text-field
              name="email"
              label="Email"
              type="email"
              v-model="email"
              :rules="emailRules"
            ></v-text-field>

            <v-text-field
              v-model="password"
              :append-icon="show1 ? 'visibility' : 'visibility_off'"
              :type="show1 ? 'text' : 'password'"
              name="input-10-1"
              label="Пароль"
              @click:append="show1 = !show1"
            ></v-text-field>

            <v-flex xs12 class="d-flex justify-center mb2">
              <v-alert v-if="loginError" type="error">
                {{ loginError }}
              </v-alert>
            </v-flex>

            <v-flex xs12 class="d-flex justify-center mb2">
              <v-btn
                depressed
                @click.prevent.stop="onSubmit"
                :disabled="!valid"
                color="primary"
                >Войти
              </v-btn>
            </v-flex>
            <v-flex xs12 class="d-flex justify-center mb1">
              <v-btn
                text
                @click.prevent.stop="toRegistr"
                small
                color="primary"
                >Зарегистрироваться
              </v-btn>
            </v-flex>
            <v-flex xs12 class="d-flex justify-center mb1">
              <v-btn
                text
                @click.prevent.stop="toRememberPassword"
                small
                color="#909090"
                >Забыли пароль
              </v-btn>
            </v-flex>
          </v-form>
        </v-card>
 
    </transition>
  </div>
</template>

<script>
const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
export default {
  data() {
    return {
      valid: false,
      show1: false,
      email: "",
      password: "",
      emailRules: [
        (v) => !!v || "Введите E-mail ",
        (v) => emailRegex.test(v) || "E-mail не корректный",
      ],
      loginError: null,
    };
  },
  computed: {
    loginDialog() {
      return this.$store.getters["dialog/loginDialog"];
    },
  },
  methods: {
    toRegistr() {
      this.closeDialog();
      this.$router.push("/register");
    },
    toRememberPassword() {
      this.closeDialog();
      this.$router.push("/account/remember");
    },
    async onSubmit() {
      if (this.$refs.form.validate()) {
        const formData = {
          login: this.email,
          password: this.password,
        };

        this.loginError = "";
        await this.$store
          .dispatch("admin/auth/login", formData)
          .then((mess) => {
            if (mess) {
              this.loginError = mess;
            } else {
              this.closeDialog();
              this.$router.push("/account");
            }
          })
          .catch((e) => {
            console.log(e);
          });
      }
    },
    closeDialog() {
      this.$store.commit("dialog/closeAll" , 'login');
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

<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md6>
        <v-card class="elevation-12" style="padding:15px">
          <v-toolbar  >
            <v-toolbar-title>Получить новый пароль</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form v-model="valid" ref="form" validation>
              <v-text-field
                prepend-icon="person"
                name="email"
                label="Email"
                type="email"
                v-model="email"
                :rules="emailRules"
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click="onSubmit" :loading="loading" :disabled="!valid || loading">Отправить</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>



<div class="text-center">
    <v-dialog
      v-model="dialog"
      width="500"
    >

      <v-card style="padding:15px">


        <v-card-text v-if="mess" >
         <h4 class="mt-2">{{mess}}</h4>
         </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <div class="flex-grow-1"></div>
          <v-btn
            color="primary"
            text
            @click="dialog = false"
          >
            Закрыть
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>



    </v-layout>
  </v-container>
</template>



<script>
const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;


export default {
  data() {
    return {
      loading: false,
      dialog: false,
      valid: false,
      email: "",
      mess: '',
      emailRules: [
        v => !!v || "E-mail is required",
        v => emailRegex.test(v) || "E-mail must be valid"
      ]
    };
  },
  async asyncData({ store, params, route, redirect }) {
    if (route.query.key && route.query.email && route.query.id) {
      const data = {
        key: route.query.key,
        email: route.query.email,
        id: route.query.id
      };
      const result = await store.dispatch("admin/user/updatePassword", data);
      const mess = result.message;

      

      // if (!result.user) {
      //   redirect("/account/remember");
        
      // }

     const dialog = true;

      return { mess, dialog, mess };
    }
  },
  methods: {
    async onSubmit() {
      const userId = await this.$store.dispatch(
        "admin/user/rememberPassword",
        this.email
      );
      this.dialog = true
      if(userId){
      this.mess = `Ссылка для сброса пароля была отправлена на вашу почту`
      }else{
        this.mess = `Пользыватель не найден`
      }

    }
  }
};
</script>
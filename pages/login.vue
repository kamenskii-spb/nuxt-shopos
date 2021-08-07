<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md8>
         <h3 class="my-1" v-if="mess">{{mess}}</h3>
        <v-card class="elevation-1" style="margin-top: 50px">
          <v-toolbar>
            <v-toolbar-title>Вход</v-toolbar-title>
          </v-toolbar>
          <v-card-text style="padding: 10px">
            <v-form v-model="valid" ref="form" validation>
              <v-text-field
                outlined
                prepend-icon="person"
                name="email"
                label="Email"
                type="email"
                v-model="email"
                :rules="emailRules"
              ></v-text-field>
              <v-text-field
                outlined
                prepend-icon="lock"
                name="password"
                label="Password"
                type="password"
                :counter="6"
                v-model="password"
                :rules="passwordRules"
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions >
            <v-spacer></v-spacer>
            <v-btn
              style="margin: 10px"
              @click="onSubmit"
              :loading="loading"
              class="success mt1"
              :disabled="!valid || loading"
            >Войти</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/

  export default {
        head(){
    return {
      title: `Вход в личный кабинет | ${process.env.appName}`
    }
  },

    data () {
      return {
        email: '',
        password: '',
        valid: false,
        mess: "",
        emailRules: [
          v => !!v || 'E-mail is required',
          v => emailRegex.test(v) || 'E-mail must be valid'
        ],
        passwordRules: [
          v => !!v || 'Password is required',
          v => (v && v.length >= 6) || 'Password must be equal or more than 6 characters'
        ]
      }
    },
     async asyncData({ store, params, route }) {
        if(route.query.success){
            const mess = "Регистрация прошла успешно для входа введите вашу почту и пароль"
            return {mess}
        }

     },
    
    computed: {
      loading () {
        return false
      }
    },
    mounted() {
      if(this.$store.getters["auth/user"])
      this.$router.push('/account')
    },
    methods: {
     async onSubmit () {
        if (this.$refs.form.validate()) {
          const formData = {
            login: this.email,
            password: this.password
          }
         const responce  =  await this.$store.dispatch('admin/auth/login', formData)

           if(!responce) {
             this.$router.push('/account')
           }else{
             this.mess = responce
           }

        }
      }
    },
    created () {
      if (this.$route.query['loginError']) {
        this.$store.dispatch('setError', 'Please log in to access this page.')
      }
    }
  }
</script>

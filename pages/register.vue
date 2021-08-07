<template>
    <v-layout>
      <v-flex xs12  md10 >
         
        <v-card class="elevation-0">
           <h3 class="my-2">Регистрация</h3>
  
           <!-- <h2 class="mb-3" v-if="mess">{{mess}}</h2>  -->
            <v-form   v-model="valid" ref="form" validation>
               <v-text-field
                  class="mb"
                  name="name"
                  label="Имя*"
                  type="text"
                  v-model="name"
                  required
                  outlined
                  :rules="[v => !!v || 'Введите имя']"
                ></v-text-field>
                <v-text-field
                  class="mb"
                  name="lastName"
                  label="Фамилия*"
                  type="text"
                  v-model="lastName"
                  required
                  outlined
                  :rules="[v => !!v || 'Введите фамилию']"
                ></v-text-field>
              <v-text-field
                name="email"
                label="Email*"
                type="email"
                v-model="email"
                :rules="emailRules"
                outlined
              ></v-text-field>
              <v-text-field
                name="password*"
                label="Пароль"
                type="password"
                :counter="6"
                v-model="password"
                :rules="passwordRules"
                outlined
              ></v-text-field>
                <v-text-field
                name="Телефон*"
                label="Телефон"
                type="phone"
                outlined
              ></v-text-field>
                   <v-textarea
                  filled
                  name="address"
                  label="Адресс"
                  v-model="address"
                  outlined
                ></v-textarea>
            </v-form>
  
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              @click="onSubmit"
              :loading="loading"
              :disabled="!valid || loading"
              class="primary my-2"
            >Зарегистрироваться</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
  



<div class="text-center">
    <v-dialog
      v-model="dialog"
      width="500"
    >

      <v-card class="pa-3 mx-lg-auto">


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
</template>

<script>
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/

  export default {
  
    data () {
      return {
        dialog: false,
        name: "",
        lastName: "",
        email: '',
        password: '',
        phone: "",
        address: "",
        valid: false,
        mess: ``,
        emailRules: [
          v => !!v || 'Введите E-mail',
          v => emailRegex.test(v) || 'Введите E-mail',
        ],
        passwordRules: [
          v => !!v || 'Введите пароль',
          v => (v && v.length >= 6) || 'Пароль не может быть меньше 6 символов'
        ],
        formActiv: true
      }
    },
 head(){
    return {
      title: `Регистрация | ${process.env.appName}`
    }
  },
 async asyncData({ store, params, route, redirect }) {
      
  if(route.query.key && route.query.email){
     const candidateParams = {
          key: route.query.key,
          email: route.query.email
        }
     const result = await store.dispatch('auth/registerUser', candidateParams)
     const mess = result.message

     if(result.user){
       redirect('/login?success=true')
     }

     dialog = true

     return {mess, dialog }
  }

     },
    computed: {
      loading () {
        return false
      }
    },
    methods: {

     async onSubmit () {
        if (this.$refs.form.validate()) {
          const formData = {
            email: this.email,
            password: this.password,
            name: this.name,
            lastName: this.lastName,
            phone: this.phone,
            address: this.address,
          }
            await this.$store.dispatch('auth/registerCandidate', formData)
            .then((result) => {
             
              if(result.message){
               this.mess = result.message
              }
               this.dialog = true
          //  this.mess = `Для завершении регистрации необходимо перейти по ссылке из письма, 
          //  высланного системой на электронный ящик. ${this.email}`
              // this.$router.push('/admin')
            })
            .catch(() => {})
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

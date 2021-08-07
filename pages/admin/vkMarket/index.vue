<template>
<div>

  <div v-if="!vkSettings.token">
      <v-form  ref="form" validation class="mb">
       <v-text-field
        class="mb"
        name="client_id"
        label="client_id*"
        type="text"
        v-model="client_id"
        required
        :rules="[v => !!v || 'Введите client_id']"
        outlined
      ></v-text-field>
      <v-text-field
        class="mb"
        name="client_secret"
        label="client_secret"
        type="text"
        v-model="client_secret"
        required
        :rules="[v => !!v || 'Введите client_secret']"
        outlined
      ></v-text-field>
     <v-text-field
        class="mb"
        name="group_id"
        label="group_id"
        type="text"
        v-model="group_id"
        required
        :rules="[v => !!v || 'Введите group_id']"
        outlined
      ></v-text-field>
           <v-text-field
        class="mb"
        name="redirect_uri"
        label="redirect_uri"
        type="text"
        v-model="redirect_uri"
        placeholder="http://site.com"
        required
        :rules="[v => !!v || 'Введите redirect_uri']"
        outlined
      ></v-text-field>
       </v-form> 
    <div><a @click.prevent="getToken">Получить токен</a></div>
  </div> 
  <div v-else >

    <h2>VK API</h2>
    <ul>
      <li>token: {{vkSettings.token}}</li>
      <li>client_id: {{vkSettings.client_id}}</li>
      <li>client_secret: {{vkSettings.client_secret}}</li>
      <li>group_id: {{vkSettings.group_id}}</li>
      <li>redirect_uri: {{vkSettings.redirect_uri}}</li>
    </ul>
    <a @click.prevent="deleteVkApi">Удалить</a>
  </div>


</div>
</template>


<script>
export default {
    layout: 'admin',
    middleware: ['admin-auth'],
    data() {
      return {
        vkSettings: {},
        // client_id: '7439076',
        // client_secret: '3XiPO6PBhRfCXvqT4CQ9',
        // redirect_uri: 'http://localhost:3000',
        // group_id: '194777788'
      }

    },

 async mounted() {

 await  this.$store.dispatch("vk/getVkMarketSetting")



 this.vkSettings = await this.$store.getters["vk/vkMarketSetting"] || {}





if(!this.vkSettings.token){



      if(this.$route.query.code){
        const form = {
          code: this.$route.query.code,
          client_id: this.client_id,
          client_secret: this.client_secret,
          redirect_uri: this.redirect_uri,
          group_id: this.group_id
        }

      if(this.$route.query.code){
        this.vkSettings = await this.$store.dispatch(
          "vk/setVkMarketSetting",
          form
        );

          if(this.vkSettings.token){
            this.$router.push("/admin/vkmarket")
          }

          
         
      }
    }
}

        


  },
//     async asyncData({ store, params, route, redirect }) {

// console.log(params)
//       if(params.code){
//         console.log(code)
//       }

//     },
  methods: {


    getToken() {



         if (this.$refs.form.validate()) {
          document.location.href = `https://oauth.vk.com/authorize?client_id=${this.client_id}&display=popup&redirect_uri=${this.redirect_uri}/admin/vkmarket&scope=market,photos,offline&response_type=code&v=5.103`
      }    
    },
    async deleteVkApi(){
       await this.$store.dispatch("vk/deleteVkMarketSetting");
      this.vkSettings = {}
    }

  }
}

</script>
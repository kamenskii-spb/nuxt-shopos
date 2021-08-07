<template>
  <div>
    <v-tabs background-color="white" color="#EF6C00 " left>
      <v-tab>История заказов</v-tab>
      <v-tab>Личные данные</v-tab>

      <v-tab-item>
        <v-simple-table v-if="orders.length > 0" >
          <thead>
            <tr>
              <th class="text-left">Номер заказа</th>
               <th class="text-left">Статус</th>
              <th class="text-left">Дата</th>
              <th class="text-left">Сумма заказа</th>
            </tr>
          </thead>
          <tbody>
            <tr style="cursor: pointer" @click="openOrder(order)" v-for="(order, index) in orders" :key="index" >
              <td>{{order.order}}</td>
               <td>{{order.status}}</td>
              <td>{{order.date | date('date')}}</td>
              <td>{{order.totalPrice}} руб.</td>
            </tr>
          </tbody>
        </v-simple-table>
        <h4  v-if="orders.length == 0" class="mt-5" >Список заказов пуст</h4>
      </v-tab-item>

      <v-tab-item>

           <v-form v-model="valid" ref="form" validation>
                <v-text-field
                  class="mb"
                  name="name"
                  label="Имя*"
                  type="text"
                  v-model="user.name"
                  required
                  outlined
                  :rules="[v => !!v || 'Введите имя']"
                ></v-text-field>
                <v-text-field
                  class="mb"
                  name="lastName"
                  label="Фамилия*"
                  type="text"
                  v-model="user.lastName"
                  required
                  outlined
                  :rules="[v => !!v || 'Введите фамилию']"
                ></v-text-field>

                <v-text-field
                  class="mb"
                  name="phone"
                  label="Телефон*"
                  type="text"
                  v-model="user.phone"
                  required
                  outlined
                  :rules="[v => !!v || 'Введите телефон']"
                ></v-text-field>
               <v-text-field
                  class="mb"
                  name="email"
                  label="email*"
                  type="text"
                  v-model="user.email"
                  required
                  disabled
                  outlined
                  :rules="[v => !!v || 'Введите фамилию']"
                ></v-text-field>

                <v-textarea
                  class="mb"
                  filled
                  name="address"
                  label="Адресс"
                  v-model="user.address"
                  outlined
                ></v-textarea>

              </v-form>
          <v-btn color="primary" small :disabled="!valid" @click="editUser()">Изменить</v-btn>


      </v-tab-item>
    </v-tabs>
  </div>
</template>



<script>
export default {
  layout: "admin",
  middleware: ["admin-auth"],
  data() {
    return {
      name: '',
      lastName: '',
      phone: '',
        email: '',
      address: '',
       valid: false,
       orders: [],
       user: {}
    }
  },
  async asyncData({store, params}) {
    const id = params.id
    const user = await store.dispatch("admin/user/getById", id);

  // const user =  store.getters["auth/user"];
  return {
    user
  }
  },
  mounted() {



     this.orders = this.user.orders
     this.name = this.user.name
     this.lastName = this.user.lastName
     this.phone = this.user.phone
     this.email = this.user.email
     this.address = this.user.address
  },
  methods: {
   async editUser(){
      const data = {
        name: this.name,
        lastName: this.lastName,
        phone: this.phone,
        address: this.address,
        id: this.user._id
      }

     this.user = await  this.$store.dispatch("auth/editUser", data);

     console.log(this.user)
 
      
    },
    openOrder(order){
      this.$router.push(`/admin/order/${order._id}`)
    }
  },
};
</script>

<style>
</style>
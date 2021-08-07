<template>
  <v-form    
    ref="form"
    v-model="valid"
    lazy-validation>
    <v-text-field
      class="mb"
      name="name"
      label="Имя*"
      type="text"
      v-model="data.name"
      filled
      :rules="[(v) => !!v || 'Введите имя']"
    ></v-text-field>
    <v-text-field
      class="mb"
      name="lastName"
      label="Фамилия*"
      type="text"
      v-model="data.lastName"
      filled
      :rules="[(v) => !!v || 'Введите фамилию']"
    ></v-text-field>
    <v-text-field
      class="mb"
      name="email"
      label="Email*"
      type="text"
      v-model="data.email"
      filled
      :rules="emailRules"
    ></v-text-field>
    <v-text-field
      class="mb"
      name="phone"
      label="Телефон*"
      type="text"
      v-model="data.phone"
      filled
      :rules="[(v) => !!v || 'Введите телефон']"
    ></v-text-field>
    <v-textarea
      class="mb"
      filled
      name="address"
      label="Адрес"
      v-model="data.address"
      shaped
      v-if="delivery !== 'Самовывоз'"
    ></v-textarea>
    <v-textarea
      class="mb"
      filled
      name="comment"
      label="Комментарий"
      v-model="data.comment"
      shaped
    ></v-textarea>
  </v-form>
</template>

<script>
const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
export default {
  data() {
    return {
      valid: true,  
      emailRules: [
        (v) => !!v || "Введите E-mail ",
        (v) => emailRegex.test(v) || "E-mail не корректный",
      ],
      data: {
      phone: "",
      address: "",
      comment: "",
      name: "",
      lastName: "",
      email: "",
      validate: function(){return true},
      }
    };
  },
  props: ["delivery"],
  mounted() {
    const user = this.$store.getters["auth/user"];
      if (user) {
        (this.data.name = user.name),
        (this.data.lastName = user.lastName),
        (this.data.phone = user.phone),
        (this.data.address = user.address),
        (this.data.email = user.email);
    }
  },
    updated() {
        this.data.validate = this.$refs.form.validate 
         this.$emit('changeData', this.data)
    }
};
</script>

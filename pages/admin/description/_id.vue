<template>
  <div>
     <client-only>
   <v-container grid-list-md fluid>
    <v-layout row>
      <v-card-title class="headline mb">Новый шаблон</v-card-title>
      <v-spacer></v-spacer>
      <v-btn
        :loading="loading"
        class="success mt1"
        @click.prevent="update"
        style="margin-right:10px"
      >Изменить</v-btn>
            <v-btn
        :loading="loading"
        class="mt1"
        @click.prevent="remove"
        style="margin-right:10px"
      >Удалить</v-btn>
    </v-layout>

    <v-card>
          <v-card text>
            <v-card-text>
              <v-layout row>
                <v-flex xs12>
                  <v-form  ref="form" validation class="mb">
                    <v-text-field
                      class="mb"
                      title="title"
                      label="Название*"
                      type="text"
                      v-model="title"
                      required
                      :rules="[v => !!v || 'Введите название']"
                      outlined
                    ></v-text-field>
                    <!-- <v-textarea
                      class="mb"
                      box
                      name="description"
                      label="Описание"
                      v-model="description"
                    ></v-textarea> -->

                      <div class="mb" >
                          <ckeditor v-model="editorData" ></ckeditor>
                      </div>

            
                  </v-form>
                </v-flex>
              </v-layout>
            </v-card-text>
          </v-card>
    </v-card>




   </v-container>
  </client-only>
  </div>
</template>

<script>


export default {
  layout: "admin",
  middleware: ["admin-auth"],
  data() {
    return {
      dialog: false,
      loading: false,
      title: "",
      id: '',
      editorData: ''
    }
  },

  async asyncData({ store, params }) {
    const data = await store.dispatch(
      "admin/description/getById",
      params.id
    );
    return {data};
  },
  async mounted() {
       this.title = this.data.title
       this.editorData = this.data.html
       this.id = this.data._id
    },
    methods: {
    async  update(){
     if (this.$refs.form.validate()) {
         this.loading = true
          const  data = {
                title: this.title,
                html: this.editorData
            }

       await this.$axios.$put(`/api/description/admin/update/${this.id}`, data).then(() => {
            this.$router.push("/admin/description/list")
          })

        this.loading = false
    }
    },
   async remove(){
         const description = await this.$axios.$delete(`/api/description/admin/remove/${this.id}`).then(() => {
            this.$router.push("/admin/description/list")
          })
    },
  }
};
</script>


<style  scoped>


</style>


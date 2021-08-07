<template>
  <div>
    555
  </div>
</template>

<!--<template>
  <div style="width:100%">
    <v-layout row>
      <v-card-title class="headline">Добавить  111</v-card-title>
      <v-spacer></v-spacer>
      <v-btn
        :loading="loading"
        :disabled="!valid || !image || loading"
        class="success mt1"
        @click="create"
      >Добавить  88888</v-btn>
    </v-layout>

    <v-tabs class="tabs" v-model="active" color="#9E9E9E" dark slider-color="#000000
">
      <v-tab ripple>Основное</v-tab>
      <v-tab ripple>Данные</v-tab>

      <v-tab-item>
        <v-card flat>
          <v-card-text>
            <v-layout row>
              <v-flex xs12 sm8>
                <v-form v-model="valid" ref="form" validation class="mb">
                  <v-text-field
                    class="mb"
                    name="name"
                    label="Название*"
                    type="text"
                    v-model="name"
                    required
                    :rules="[v => !!v || 'Введите название']"
                  ></v-text-field>
                  <v-textarea
                    class="mb"
                    box
                    name="description"
                    label="Описание"
                    v-model="description"
                  ></v-textarea>
                  <v-text-field
                    class="mb"
                    name="metaTitle"
                    label="Мета-тег Title*"
                    type="text"
                    v-model="metaTitle"
                    required
                    :rules="[v => !!v || 'Введите мета-тег Title']"
                  ></v-text-field>

                  <v-textarea
                    class="mb"
                    box
                    name="metaDescription"
                    label="Мета-тег Description"
                    v-model="metaDescription"
                  ></v-textarea>

                  <v-textarea
                    class="mb"
                    box
                    name="Мета-тег Keywords"
                    label="Мета-тег Keywords"
                    v-model="metaKeywords"
                  ></v-textarea>
                </v-form>
                <v-layout row class="mb-3">
                  <v-flex xs12>
                    <v-btn color="info m0" @click="triggerUpload">
                      Изображение
                      <v-icon right dark>cloud_upload</v-icon>
                    </v-btn>
                    <input
                      ref="fileInput"
                      type="file"
                      style="display: none;"
                      accept="image/*"
                      @change="onFileChange"
                    />
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-flex xs12>
                    <v-img width="200px" :src="imageSrc"></v-img>
                  </v-flex>
                </v-layout>
              </v-flex>
            </v-layout>
          </v-card-text>
        </v-card>
      </v-tab-item>

      <v-tab-item>
        <v-card flat>
          <v-card-text>
            <v-layout row>
              <v-flex xs12>
                <v-autocomplete
                  class="mb"
                  v-model="parent"
                  :items="items"
                  item-text="state"
                  item-value="id"
                  :label="`Родительская категория`"
                ></v-autocomplete>

                <v-text-field
                 style="width:170px"
                  class="mb"
                  name="sort"
                  label="Порядок сортировки"
                  type="number"
                  v-model="sort"
                  value="0"
                ></v-text-field>

                <v-select
                  style="width:170px"
                  v-model="status"
                  :items="['Включено','Отключено']"
                  label="Статус"
                ></v-select>
              </v-flex>
            </v-layout>
          </v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs>

    <div class="text-xs-center mt-3">
      <v-btn @click="next">Далее</v-btn>
    </div>
  </div>
</template>

<script>
export default {
  layout: "admin",
  middleware: ["admin-auth"],
  data() {
    return {
      parent: { state: "--- Не выбрано ---", id: "0" },
      sort: 0,
      loading: false,
      active: null,
      name: "",
      description: "",
      status: "Включено",
      valid: false,
      image: null,
      imageSrc: "/noimage.jpg",
      metaTitle: "",
      metaDescription: "",
      metaKeywords: "",
      isEditing: true,
      model: null,
      items: [
        { state: " --- Не выбрано --- ", id: "0" },
        { state: "Georgia", id: "GA" },
        { state: "Nebraska", id: "NE", data: 1 },
        { state: "California", id: "CA" },
        { state: "New York", id: "NY" }
      ]
    };
  },
  methods: {
    next() {
      const active = parseInt(this.active);
      this.active = active < 2 ? active + 1 : 0;
    },
   async create() {
      if (this.$refs.form.validate() && this.image) {
        this.loading = true;
        const formData = {
          name: this.name,
          description: this.description,
          metaTitle: this.metaTitle,
          metaDescription: this.metaDescription,
          metaKeywords: this.metaKeywords,
          parent: this.parent.id,
          sort: this.sort,
          status: this.status,
          image: this.image
        };


        await this.$store.dispatch('category/create', formData)
          .then(() => {
            this.$router.push('/admin/categories')
           this.loading = false
          })
          .catch(() => {
        
        })
      }
    },
    triggerUpload() {
      this.$refs.fileInput.click();
    },
    onFileChange(event) {
      const file = event.target.files[0];

      const reader = new FileReader();
      reader.onload = e => {
        this.imageSrc = reader.result;
      };
      reader.readAsDataURL(file);
      this.image = file;
    }
  },
  mounted() {
    
};
</script>

<style  scoped>
.tabs {
  width: 100%;
}
</style>




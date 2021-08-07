<template>
  <div>
    <div>
      <v-layout row>
        <v-card-title
          class="headline mb"
          v-text="category ? category.name : 'Добавить'"
        />
        <v-spacer></v-spacer>
        <v-btn
          :loading="loading"
          :disabled="!valid || loading"
          class="success mt1"
          @click="formHandler"
          style="margin-right:10px"
          v-text="category ? 'Изменить' : 'Добавить'"
        />
      </v-layout>
      <v-card style="padding:10px">
        <v-tabs class="tabs" v-model="active" color="blue">
          <v-tab ripple>Основное</v-tab>
          <v-tab ripple>Данные</v-tab>
          <v-tab-item>
            <v-card text>
              <v-card-text>
                <v-layout row>
                  <v-flex xs12>
                    <v-form v-model="valid" ref="form" validation class="mb">
                      <v-text-field
                        class="mb"
                        name="name"
                        label="Название*"
                        type="text"
                        v-model="name"
                        required
                        :rules="[(v) => !!v || 'Введите название']"
                        outlined
                      ></v-text-field>
                      <div class="mb">
                        <ckeditor v-model="editorData"></ckeditor>
                      </div>
                      <v-text-field
                        class="mb"
                        name="metaTitle"
                        label="Мета-тег Title*"
                        type="text"
                        v-model="metaTitle"
                        required
                        outlined
                        :rules="[(v) => !!v || 'Введите мета-тег Title']"
                      ></v-text-field>

                      <v-textarea
                        class="mb"
                        filled
                        name="metaDescription"
                        label="Мета-тег Description"
                        v-model="metaDescription"
                        outlined
                      ></v-textarea>

                      <v-textarea
                        class="mb"
                        filled
                        name="Мета-тег Keywords"
                        label="Мета-тег Keywords"
                        v-model="metaKeywords"
                        outlined
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
            <v-card text>
              <v-card-text>
                <v-layout row>
                  <v-flex xs12>
                    <v-autocomplete
                      class="mb"
                      v-model="parent"
                      :items="breadcrumbListFromCategories"
                      item-text="name"
                      item-value="_id"
                      :label="`Родительская категория`"
                    ></v-autocomplete>

                    <v-text-field
                      style="width:170px"
                      class="mb"
                      name="sortOrder"
                      label="Порядок сортировки"
                      type="number"
                      v-model="sortOrder"
                      value="0"
                      outlined
                    ></v-text-field>

                    <v-select
                      style="width:170px"
                      v-model="status"
                      item-text="name"
                      :items="statusList"
                      item-value="id"
                      label="Статус"
                    ></v-select>
                  </v-flex>
                </v-layout>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs>
      </v-card>
      <div class="text-xs-center mt-3">
        <v-btn @click="next">Далее</v-btn>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["loading", "category"],
  data() {
    return {
      dialog: false,
      parent: { name: " --- Не выбрано --- ", _id: "0" },
      sortOrder: 0,
      active: null,
      name: "",
      status: { name: "Включено", id: 1 },
      statusList: [{ name: "Включено", id: 1 }, { name: "Отключено", id: 0 }],
      valid: null,
      image: null,
      imageSrc: "/noimage.jpg",
      metaTitle: "",
      metaDescription: "",
      metaKeywords: "",
      isEditing: true,
      model: null,
      breadcrumbListFromCategories: [],
      editorData: "",
      categories: [],
    };
  },
  async mounted() {
    try {
      this.categories = await this.$store.dispatch("admin/category/fetch");

      if (!this.category) {
        this.breadcrumbListFromCategories = await this.$store.dispatch(
          "admin/category/breadcrumbListFromCategories",
          this.categories
        );
      }

      if (this.category) {
        this.categories = this.categories.filter((c) => {
          return c._id !== this.category._id;
        });
        this.breadcrumbListFromCategories = await this.$store.dispatch(
          "admin/category/breadcrumbListFromCategories",
          this.categories
        );

        this.name = this.category.name;
        this.metaTitle = this.category.metaTitle;
        this.metaDescription = this.category.metaDescription;
        this.metaKeywords = this.category.metaKeywords;
        this.editorData = this.category.description;

        if (this.category.parent) {
          this.parent = this.category.parent;
        }
        if (this.category.imageSrc) {
          this.imageSrc =
            `/catalog/categories/${this.category._id}/` +
            this.category.imageSrc;
        }

        this.sortOrder = this.category.sortOrder;
        this.status = this.statusList.filter((status) => {
          return status.id === this.category.status;
        })[0];
      }
    } catch (error) {
      console.log(error);
    }
  },
  methods: {
    next() {
      const active = parseInt(this.active);
      this.active = active < 2 ? active + 1 : 0;
    },
    async formHandler() {
      if (this.$refs.form.validate()) {
        const formData = {
          name: this.name,
          description: this.editorData,
          metaTitle: this.metaTitle,
          metaDescription: this.metaDescription,
          metaKeywords: this.metaKeywords,
          sortOrder: +this.sortOrder || 0,
          image: this.image,
        };

        if (this.parent.length > 3) {
          formData.parent = this.parent;
        }
        if (this.status.id !== undefined) {
          formData.status = this.status.id;
        } else {
          formData.status = this.status;
        }

        if (this.category) formData.id = this.category._id;

        this.$emit("formHandler", formData);
      }
    },
    triggerUpload() {
      this.$refs.fileInput.click();
    },
    onFileChange(event) {
      const file = event.target.files[0];

      const reader = new FileReader();
      reader.onload = (e) => {
        this.imageSrc = reader.result;
      };
      reader.readAsDataURL(file);
      this.image = file;
    },
  },
};
</script>

<style lang="scss" scoped>
.tabs {
  width: 100%;
}
</style>

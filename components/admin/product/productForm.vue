<template>
  <div>
    <v-layout row>
      <v-card-title class="headline mb">Добавить</v-card-title>
      <v-spacer></v-spacer>
      <v-btn
        :loading="loading"
        :disabled="!valid || loading"
        class="success mt1"
        @click="formHandler"
        style="margin-right:10px"
        >Добавить</v-btn
      >
    </v-layout>

    <v-card style="padding:10px" class="my-2 ">
      <v-tabs class="tabs" v-model="active" color="blue">
        <v-tab ripple>Основное</v-tab>
        <v-tab ripple>Данные</v-tab>
        <v-tab ripple>Изображения</v-tab>

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
                      :rules="[
                        (v) =>
                          v.length >= 4 || 'Введите название минимум 4 символа',
                      ]"
                      outlined
                      @change="autoSeoCreate()"
                    />

                    <v-select
                      class="my-2"
                      style="max-width: 300px; margin-bottom: 15px"
                      v-model="tempateDescription"
                      :items="tempatesDescriptions"
                      item-text="title"
                      label="Шаблоны описания"
                      hide-details
                      return-object
                      prepend-icon="map"
                      single-line
                    />

                    <div v-if="!this.tempateDescription._id" class="mb">
                      <ckeditor v-model="editorData"></ckeditor>
                    </div>

                    <v-text-field
                      class="my-2"
                      name="metaTitle"
                      label="Мета-тег Title*"
                      type="text"
                      v-model="metaTitle"
                      required
                      :rules="[(v) => !!v || 'Введите мета-тег Title']"
                      outlined
                    />

                    <v-textarea
                      class="my-2"
                      filled
                      name="metaDescription"
                      label="Мета-тег Description"
                      v-model="metaDescription"
                      outlined
                    />

                    <v-textarea
                      class="my-2"
                      filled
                      name="Мета-тег Keywords"
                      label="Мета-тег Keywords"
                      v-model="metaKeywords"
                      outlined
                    />
                  </v-form>
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
                  <p class="text-start" style="margin: 0">
                    Показывать в категориях
                  </p>
                  <div v-if="categoryCondidats.length > 0">
                    <br />
                    <a @click.stop="selectPrevCategory()"
                      >Выбрать категории из последнего товара</a
                    >
                    <ul
                      v-for="(categoryCondidat, index) in this
                        .categoryCondidats"
                      :key="index"
                    >
                      <li>{{ categoryCondidat.name }}</li>
                    </ul>
                    <br />
                  </div>

                  <v-data-table
                    v-model="selected"
                    :headers="headers"
                    :items="breadcrumbListFromCategories"
                    item-key="_id"
                    show-select
                    hide-default-footer
                    :items-per-page="150"
                    class="select-categoty mb"
                  ></v-data-table>

                  <v-text-field
                    class="my-2"
                    name="model"
                    label="Модель"
                    type="text"
                    v-model="model"
                    :rules="[
                      (v) =>
                        v.length >= 3 || 'Введите модель минимум 3 символа',
                    ]"
                    outlined
                  ></v-text-field>
                  <p v-if="prevProduct">
                    <a @click.stop="selectPrevProduct()">
                      Скопировать цену, минимум, теги, размер с последнего
                      добавленного товара
                    </a>
                  </p>

                  <v-row no-gutters>
                    <v-col cols="col-12" sm="12" md="6">
                      <v-text-field
                        class="my-2 "
                        name="price"
                        label="Стоимость*"
                        type="number"
                        v-model="price"
                        outlined
                      ></v-text-field>
                    </v-col>
                    <v-col cols="col-12" sm="12" md="6">
                      <v-text-field
                        class="my-2 pl-2"
                        name="price"
                        label="Новая цена"
                        type="number"
                        v-model="newPrice"
                        outlined
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-text-field
                    class="my-2"
                    name="wholesalePrice"
                    label="Оптовая цена"
                    type="number"
                    v-model="wholesalePrice"
                    outlined
                  ></v-text-field>

                  <v-text-field
                    class="my-2"
                    name="minimum"
                    label="Минимальное количество"
                    type="number"
                    v-model="minimum"
                    outlined
                  ></v-text-field>

                  <v-text-field
                    class="my-2"
                    name="size"
                    label="Размер"
                    type="string"
                    v-model="size"
                    outlined
                  ></v-text-field>

                  <v-text-field
                    class="my-2"
                    name="sortOrder"
                    label="Порядок сортировки"
                    type="number"
                    v-model="sortOrder"
                    outlined
                  ></v-text-field>

                  <div class="checkbox">
                    <v-checkbox
                      v-model="recommend"
                      label="Подборки товаров"
                    ></v-checkbox>
                    <v-checkbox
                      v-model="superPrice"
                      label="Суперцена"
                    ></v-checkbox>
                    <v-checkbox v-model="stock" label="Акция"></v-checkbox>
                  </div>

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

              <v-text-field
                name="tag"
                label="Тег"
                type="text"
                v-model="tag"
                outlined
              ></v-text-field>
              <v-btn color="primary" class="my-1" @click="tagAdd"
                >Добавит тег</v-btn
              >
              <br />
              <v-chip class="my-2 mr-2 " v-for="(itag, n) in tags" :key="n">
                {{ itag.name }}
                <v-icon @click="closeTag(itag)" style="font-size:18px"
                  >mdi-close-circle</v-icon
                >
              </v-chip>

              <v-checkbox
                v-model="wholesale"
                label="Показывать оптовикам"
              ></v-checkbox>
              <v-checkbox
                v-model="retail"
                label="`Показывать в розницу"
              ></v-checkbox>
            </v-card-text>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card text>
            <v-card-text>
              <v-layout row>
                  <v-flex xs12 class="mb-3">
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

                  <v-flex xs12>
                    <h3 class=".body-2">Основное изображение</h3>
                    <div v-if="images.length > 0">
                      <client-only>
                        <draggable v-model="images">
                          <transition-group>
                            <div v-for="image in images" :key="image._id">
                              <v-card
                                v-if="!image.file"
                                max-width="400"
                                class="mb image-card"
                              >
                                <v-list-item three-line>
                                  <v-img
                                    style="margin: 15px 0;"
                                    width="0"
                                    :src="path + image.src"
                                  ></v-img>

                                  <v-list-item-content>
                                    <v-list-item-title class="headline mb-1">
                                      <v-btn
                                        color="error ml-8"
                                        @click="deleteImageFile(image)"
                                        >Удалить</v-btn
                                      >
                                    </v-list-item-title>
                                  </v-list-item-content>
                                </v-list-item>
                              </v-card>

                              <v-card
                                v-else
                                max-width="400"
                                class="mb image-card"
                              >
                                <v-list-item three-line>
                                  <v-img
                                    style="margin: 15px 0;"
                                    width="0"
                                    :src="image.src"
                                  ></v-img>
                                  <v-list-item-content>
                                    <v-list-item-title class="headline mb-1">
                                      <v-btn
                                        color="error ml-8"
                                        @click="deleteUploadSrc(image._id)"
                                        >Удалить</v-btn
                                      >
                                    </v-list-item-title>
                                  </v-list-item-content>
                                </v-list-item>
                              </v-card>
                            </div>
                          </transition-group>
                        </draggable>
                      </client-only>
                    </div>
                    <div v-else>
                      <v-card max-width="400" class="mb image-card">
                        <v-list-item three-line>
                          <v-list-item-avatar tile size="150px">
                            <v-img
                              style="margin: 15px 0;"
                              src="/noimage.jpg"
                            ></v-img>
                          </v-list-item-avatar>
                        </v-list-item>
                      </v-card>
                    </div>
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
</template>

<script>
export default {
  components: {
    draggable: () =>
      process.client
        ? import("vuedraggable")
        : Promise.resolve({ render: (h) => h("div") }),
  },
  props: ["product"],
  data() {
    return {
      tag: "",
      tags: [],
      dialog: false,
      sortOrder: 0,
      price: null,
      newPrice: null,
      wholesalePrice: null,
      minimum: 1,
      loading: false,
      active: null,
      name: "",
      description: "",
      status: { name: "Включено", id: 1 },
      recommend: false,
      superPrice: false,
      stock: false,
      size: "",
      statusList: [{ name: "Включено", id: 1 }, { name: "Отключено", id: 0 }],
      valid: null,
      images: [],
      metaTitle: "",
      metaDescription: "",
      metaKeywords: "",
      isEditing: true,
      model: "",
      breadcrumbListFromCategories: [],
      selected: [],
      categoryCondidats: false,
      prevProduct: false,
      prevDescription: "",
      wholesale: true,
      retail: true,
      desciptionTemplate: {},
      tempateDescription: { title: "Без шаблона", _id: "" },
      tempatesDescriptions: [],
      categories: [],
      editorData: "",
      headers: [
        {
          text: "Все категории",
          value: "name",
        },
      ],
    };
  },
  async mounted() {
    this.categories = await this.$store.dispatch("admin/category/fetch");
    let breadcrumbListFromCategories = await this.$store.dispatch(
      "admin/category/breadcrumbListFromCategories",
      this.categories
    );
    this.breadcrumbListFromCategories = breadcrumbListFromCategories.splice(1);
    this.tempatesDescriptions = await this.$store.dispatch(
      "admin/description/getAll"
    );

    if (this.product) {
      this.name = this.product.name;
      this.editorData = this.product.description;
      this.metaTitle = this.product.metaTitle;
      this.metaDescription = this.product.metaDescription;
      this.metaKeywords = this.product.metaKeywords;
      this.price = this.product.price;
      this.newPrice = this.product.newPrice;
      this.wholesalePrice = this.product.wholesalePrice;
      this.minimum = this.product.minimum;
      this.model = this.product.model;
      this.images = this.product.images;
      this.recommend = this.product.recommend;
      this.superPrice = this.product.superPrice;
      this.stock = this.product.stock;
      this.size = this.product.size;
      this.status = this.product.status;
      this.tags = this.product.tags;
      this.sortOrder = +this.product.sort_order;
      this.wholesale = this.product.wholesale;
      this.retail = this.product.retail;

      this.path = `/catalog/products/${this.product._id}/`;

        const selectCategoty = this.product.selectCategoty.split(",");
        this.selected = this.breadcrumbListFromCategories.filter((c) => {
          if (selectCategoty.includes(c._id)) {
            return c;
          }
        });
        this.tempatesDescriptions = await this.$store.dispatch(
          "admin/description/getAll"
        );
        this.tempateDescription = this.tempatesDescriptions.find(
          (t) => t._id.toString() === this.product.tempateDescription.toString()
        );
      
    } else {
        this.prevProduct = JSON.parse(localStorage.getItem("prevProduct"));
        this.categoryCondidats = JSON.parse(localStorage.getItem("selectCategory")) || []
    }
  },
  methods: {
    closeTag(tag) {
      this.tags = this.tags.filter((t) => {
        return t.name !== tag.name;
      });
    },
    tagAdd() {
      if (this.tag) {
        const tag = this.tags.filter((t) => {
          return t.name === this.tag;
        });
        if (tag.length !== 0) return;
        this.tags.push({ name: this.tag });
      }
    },
    selectPrevCategory() {
      this.selected = this.categoryCondidats;
      this.categoryCondidats = [];
    },
    async selectPrevProduct() {
      this.size = this.prevProduct.size;
      this.price = this.prevProduct.price;
      this.minimum = this.prevProduct.minimum;
      this.wholesalePrice = this.prevProduct.wholesalePrice;
      if (this.prevProduct.tags.length > 0) {
      }
      this.tags = await JSON.parse(this.prevProduct.tags);
      this.prevProduct = null;
    },
    next() {
      const active = parseInt(this.active);
      this.active = active < 2 ? active + 1 : 0;
    },
    triggerUpload() {
      this.$refs.fileInput.click();
    },
    async deleteImageFile(image) {
      if (!confirm("Удалить изображение?")) return;
      this.loading = true;
      image.productId = this.product._id;
      await this.$store
        .dispatch("admin/product/removeImagebByImageId", image)
        .then(() => {
          this.loading = false;
        })
        .catch((e) => {
          console.log(e);
          this.loading = false;
        });
      this.images = this.images.filter((i) => i._id !== image._id);
    },
    onFileChange(event) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        this.images.push({
          file,
          src: reader.result,
          _id: Math.random()
            .toString(36)
            .substr(2, 12),
        });
      };

      reader.readAsDataURL(file);
    },
    deleteUploadSrc(id) {
      if (!confirm("Удалить изображение?")) return;
      this.images = this.images.filter((i) => i._id !== id);
    },
    autoSeoCreate() {
      if (!this.name) return;

      if (!this.metaTitle) {
        this.metaTitle = this.name;
      }

      if (!this.metaDescription) {
        this.metaDescription = this.name + " купить оптом и в розницу";
      }

      if (!this.metaKeywords) {
        this.metaKeywords = this.name;
      }
    },
    formHandler() {
      if (this.$refs.form.validate()) {


        const files = [];

        if(!this.product){
          if (this.images.length > 0) {
            this.images.map((i) => {
              files.push(i.file);
            });
          }
        }else{
           if (this.images.length > 0) {
          this.images.map(i => {
            if (i.file) {
              files.push(i.file);
            } else if (i.src && !i.file) {
              files.push(i.src);
            }
          });
           }
        }

        const formData = {
          name: this.name,
          description: this.editorData,
          metaTitle: this.metaTitle,
          metaDescription: this.metaDescription,
          metaKeywords: this.metaKeywords,
          model: this.model,
          price: this.price,
          newPrice: this.newPrice,
          wholesalePrice: this.wholesalePrice,
          minimum: this.minimum,
          sortOrder: +this.sortOrder || 0,
          images: files,
          selectCategoty: this.selected,
          recommend: this.recommend,
          superPrice: this.superPrice,
          stock: this.stock,
          size: this.size,
          tempateDescription: this.tempateDescription._id,
          tags: JSON.stringify(this.tags),
          wholesale: this.wholesale,
          retail: this.retail,
        };

         if(!this.product){
        localStorage.setItem("selectCategory", JSON.stringify(this.selected));
        localStorage.setItem("prevProduct", JSON.stringify(formData));
        } else{
          formData.id = this.product._id
          formData.categoriesForClear = this.product.selectCategoty
        }

        if (this.status.id !== undefined) {
          formData.status = this.status.id;
        } else {
          formData.status = this.status;
        }
        if (!this.selected.length) return;
        this.$emit("formHandler", formData);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.tabs {
  width: 100%;
}
.select-categoty {
  max-height: 300px;
  overflow: auto;
  border: 2px solid #ccc;
}
.image-card {
  max-width: 170px;
}
.image-card:hover {
  cursor: s-resize;
}

.checkbox {
  height: 100px;
  overflow: auto;
  background: #f1f1f1;
  margin-bottom: 20px;
}
.v-input--selection-controls {
  margin: 5px;
}
</style>

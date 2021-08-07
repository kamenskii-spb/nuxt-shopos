<template>
  <div>
    <v-layout row>
      <v-card-title class="headline mb">Настройки</v-card-title>
      <v-spacer></v-spacer>
      <v-btn
        :loading="loading"
        :disabled="!valid  || loading"
        class="success mt1"
        @click="update"
        style="margin-right:10px"
      >Применить</v-btn>
    </v-layout>

    <v-card style="padding:10px" >
      <v-tabs class="tabs" v-model="active" color="blue">
        <v-tab ripple>Основное</v-tab>
        <v-tab ripple>Изображение</v-tab>

        <v-tab-item>
          <v-card text>
            <v-card-text>
              <v-layout row>
                <v-flex xs12>
                  <v-form v-model="valid" ref="form" validation class="mb">
                    <v-text-field
                      class="mb"
                      name="name"
                      label="Название магазина*"
                      type="text"
                      v-model="shopName"
                      required
                      :rules="[v => !!v || 'Введите название']"
                      outlined
                    ></v-text-field>

                    <v-text-field
                      class="mb"
                      name="metaTitle"
                      label="Мета-тег Title*"
                      type="text"
                      v-model="metaTitle"
                      required
                      :rules="[v => !!v || 'Введите мета-тег Title']"
                      outlined
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

                    <v-text-field
                      name="email"
                      label="Email*"
                      type="email"
                      v-model="email"
                      :rules="emailRules"
                      outlined
                    ></v-text-field>
                  </v-form>
                </v-flex>
              </v-layout>
            </v-card-text>
          </v-card>
        </v-tab-item>

        <v-tab-item>
        
            <v-card-text>
              <v-layout row>
                <v-flex xs12>
                  <v-form v-model="valid" ref="form" validation class="mb">
                    <div grid-list-xl>
                      <h3>Размер большого изображения товара</h3>
                      <v-layout wrap>
                        <v-flex xs12 md6>
                          <v-text-field
                            v-model="largeImageSizeWidth"
                            type="number"
                            label="Ширина"
                            :rules="numberRules"
                            required
                            outlined
                          ></v-text-field>
                        </v-flex>

                        <v-flex xs12 md6 px-2>
                          <v-text-field
                            v-model="largeImageSizeHeight"
                            type="number"
                            label="Высота"
                            :rules="numberRules"
                            min="1"
                            outlined
                            required
                          ></v-text-field>
                        </v-flex>
                      </v-layout>
                    </div>
                    <div grid-list-xl>
                      <h3>Размер всплывающего изображения товара</h3>
                      <v-layout wrap>
                        <v-flex xs12 md6>
                          <v-text-field
                            v-model="popupImageSizeWidth"
                            type="number"
                            label="Ширина"
                            :rules="numberRules"
                            required
                            outlined
                          ></v-text-field>
                        </v-flex>

                        <v-flex xs12 md6 px-2>
                          <v-text-field
                            v-model="popupImageSizeHeight"
                            type="number"
                            label="Высота"
                            :rules="numberRules"
                            outlined
                            required
                          ></v-text-field>
                        </v-flex>
                      </v-layout>
                    </div>
                     <div grid-list-xl>
                      <h3>Размер изображения в списке товаров</h3>
                      <v-layout wrap>
                        <v-flex xs12 md6>
                          <v-text-field
                            v-model="listImageSizeWidth"
                            type="number"
                            label="Ширина"
                            :rules="numberRules"
                            required
                            outlined
                          ></v-text-field>
                        </v-flex>

                        <v-flex xs12 md6 px-2>
                          <v-text-field
                            v-model="listImageSizeHeight"
                            type="number"
                            label="Высота"
                            :rules="numberRules"
                            outlined
                            required
                          ></v-text-field>
                        </v-flex>
                      </v-layout>
                    </div>
                     <div grid-list-xl  >
                      <h3  px-2>Размер дополнительных изображений товара</h3>
                      <v-layout wrap>
                        <v-flex xs12 md6 >
                          <v-text-field
                            v-model="additionalImageSizeWidth"
                            type="number"
                            label="Ширина"
                            :rules="numberRules"
                            required
                            outlined
                          ></v-text-field>
                        </v-flex>

                        <v-flex xs12 md6 px-2>
                          <v-text-field
                            v-model="additionalImageSizeHeight"
                            type="number"
                            label="Высота"
                            :rules="numberRules"
                            outlined
                            required
                          ></v-text-field>
                        </v-flex>
                      </v-layout>
                       <v-layout wrap>
                         <v-flex xs12 >
                           <v-btn  :loading="processClearCache"
                                   class="success"
                                   @click.stop.prevent="clearCache()"
                           >Очистить кеш</v-btn>
                         </v-flex>
                       </v-layout>
                    </div>
                    
                  </v-form>
                </v-flex>
              </v-layout>
            </v-card-text>
        </v-tab-item>
      </v-tabs>
    </v-card>

    <div class="text-xs-center mt-3">
      <v-btn @click="next">Далее</v-btn>
    </div>
  </div>
</template>


<script>
const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

export default {
  layout: "admin",
  middleware: ["admin-auth"],
  data() {
    return {
      valid: false,
      loading: false,
      active: null,
      shopName: "",
      metaTitle: "",
      metaDescription: "",
      metaKeywords: "",
      email: "",
      processClearCache: false,
      largeImageSizeHeight: 500,
      largeImageSizeWidth: 500,
      popupImageSizeHeight: 800,
      popupImageSizeWidth: 800,
      listImageSizeHeight: 250,
      listImageSizeWidth: 250,
      additionalImageSizeHeight: 100,
      additionalImageSizeWidth: 100,      
      emailRules: [
        v => !!v || "E-mail is required",
        v => emailRegex.test(v) || "E-mail must be valid"
      ],
      numberRules: [v => v >= 50 || "Число должно быть больше 50"]
    };
  },
  async asyncData({ store }) {
    const setting = await store.dispatch("admin/setting/fetch");
    return { setting };
  },
  methods: {
    async update() {
      if (this.$refs.form.validate()) {

        this.loading = true;
        const formData = {
          shopName: this.shopName,
          metaTitle: this.metaTitle,
          metaDescription: this.metaDescription,
          metaKeywords: this.metaKeywords,
          email: this.email,
          largeImageSizeHeight: +this.largeImageSizeHeight,
          largeImageSizeWidth: +this.largeImageSizeWidth,
          popupImageSizeHeight: +this.popupImageSizeHeight,
          popupImageSizeWidth: +this.popupImageSizeWidth,
          listImageSizeHeight: +this.listImageSizeHeight,
          listImageSizeWidth: +this.listImageSizeWidth,
          additionalImageSizeHeight: +this.additionalImageSizeHeight,
          additionalImageSizeWidth: +this.additionalImageSizeWidth
        };


        await this.$store
          .dispatch("admin/setting/update", formData)
          .then(() => {
            this.$router.push("/admin/");
            this.loading = false;
          })
          .catch(e => {
            console.log(e);
            this.loading = false;
          });
      }
    },
   async clearCache(){
     this.processClearCache = true
     await this.$store
              .dispatch("admin/setting/imagesClear")
              .then((data) => {
                console.log(data)
                this.processClearCache = false
              })
              .catch(e => {
                console.log(e);
              });

    },
    next() {
      const active = parseInt(this.active);
      this.active = active < 2 ? active + 1 : 0;
    }
  },

  async mounted() {
    this.email = this.setting.email;
    this.shopName = this.setting.shopName;
    this.metaDescription = this.setting.metaDescription;
    this.metaTitle = this.setting.metaTitle;
    this.metaKeywords = this.setting.metaKeywords;
    this.largeImageSizeHeight = +this.setting.largeImageSizeHeight,
    this.largeImageSizeWidth = +this.setting.largeImageSizeWidth,
    this.popupImageSizeHeight = +this.setting.popupImageSizeHeight,
    this.popupImageSizeWidth = +this.setting.popupImageSizeWidth,
    this.listImageSizeHeight = +this.setting.listImageSizeHeight,
    this.listImageSizeWidth = +this.setting.listImageSizeWidth
  }
};
</script>
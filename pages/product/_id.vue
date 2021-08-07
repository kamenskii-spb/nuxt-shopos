<template>
  <div>
    <h3 v-if="!product">Товар не найден!</h3>

    <v-layout v-if="product" wrap>
      <v-flex md12>
        <app-Breadcrumbs
          :categoryId="product.selectCategoty.split(',')[0]"
          class="d-none d-sm-block d-md-block d-lg-block mx-1"
        />
      </v-flex>

      <v-row class="mb-6" no-gutters>
        <v-col cols="col-12" md="7" class="mx-1">
          <v-row no-gutters>
            <v-col cols="col-12" md="12">
              <!-- style="cursor: pointer" -->
              <v-carousel
                height="auto"
                v-if="cacheImages.length > 1"
                v-model="imageI"
                :hide-delimiters="true"
              >
                <v-carousel-item
                  width="100%"
                  v-for="(image, i) in cacheImages"
                  :key="i"
                >
                  <img
                    class="product-img"
                    @click="visible = !visible"
                    :src="image.src"
                  />
                </v-carousel-item>
              </v-carousel>

              <!-- @click="openImg(image.src)" -->
              <div v-else-if="cacheImages.length == 1">
                <img
                  class="product-img"
                  @click="visible = !visible"
                  :src="cacheImages[0].src"
                />
              </div>

              <!-- @click="openImg(imgs[0].src)"  -->
              <v-img v-else :src="'/noimage.jpg'"></v-img>
            </v-col>

            <v-col cols="col-12" md="12">
              <v-flex>
                <div class="images" v-if="cacheImages.length != 1">
                  <v-layout v-if="images.length > 0" wrap>
                    <v-flex
                      v-for="image in cacheImages"
                      :key="image._id"
                      xs2
                      class="image"
                    >
                      <v-card
                        @click="activImage(image.i)"
                        tile
                        :flat="image.i == imageI"
                      >
                        <v-img :src="image.src" width="150px"></v-img>
                      </v-card>
                    </v-flex>
                  </v-layout>
                </div>
              </v-flex>
            </v-col>
          </v-row>
        </v-col>

        <v-col cols="col-12" class="mx-1">
          <v-flex text-center>
            <v-card outlined class="product-info">
              <v-layout column>
                <v-flex mb="4">
                  <h2>{{ product.name }}</h2>
                </v-flex>
                <v-flex>
                  <ul class="product-page-attrs">
                    <li v-if="product.model">
                      Артикул: <strong>{{ product.model }}</strong>
                    </li>
                    <li v-if="product.minimum > 1">
                      Минимум: <strong>{{ product.minimum }}</strong>
                    </li>
                    <li v-if="product.size">
                      Размер: <strong>{{ product.size }}</strong>
                    </li>
                    <li style="margin: 10px 0" v-if="price">
                      Цена: <strong>{{ price | currency }}</strong>
                    </li>
                  </ul>
                </v-flex>
                <v-flex mb="4">

                  <app-number-input
                    :value="quantity"
                    :step="step"
                    @inputChange="quantity = $event"
                  />
                </v-flex>
                <v-flex mb="4">
                  <div class="my-2">
                    <v-btn
                      outlined
                      color=" lighten-1 white--text"
                      @click="addToCart(product)"
                      >В корзину</v-btn
                    >
                  </div>
                </v-flex>
              </v-layout>
            </v-card>
          </v-flex>
        </v-col>
      </v-row>

      <v-flex md12 xs12>
        <div v-if="product.description" style="padding: 20px">
          <v-list-item-title class="headline mb-2">Описание</v-list-item-title>
          <div v-html="product.description"></div>
        </div>
      </v-flex>
    </v-layout>

    <client-only>
      <vue-easy-lightbox
        :visible="visible"
        :imgs="lightboxImg"
        @hide="handleHide"
      ></vue-easy-lightbox>
    </client-only>

    <app-Cart-Snackbar :productAdd="productAdd" />
  </div>
</template>

<script>
import AppCartSnackbar from "@/components/main/CartSnackbar";
import AppBreadcrumbs from "@/components/main/Breadcrumbs";
import AppNumberInput from "@/components/main/NumberInput";

export default {
  head() {
    return {
      title: `${this.product.metaTitle}`,
      meta: [
        {
          hid: `product-d-${this.product._id}`,
          name: "description",
          content: this.product.metaDescription,
        },
        {
          hid: `product-k-${this.product._id}`,
          name: "keywords",
          content: this.product.metaKeywords,
        },
      ],
    };
  },
  data() {
    return {
      imgs: [],
      images: [],
      imageI: 0,
      visible: false,
      dialog: null,
      openImgSrc: "",
      product: false,
      quantity: 1,
      step: 1,
      productAdd: {},
    };
  },
  components: {
    AppCartSnackbar,
    AppBreadcrumbs,
    AppNumberInput,
    VueEasyLightbox: () =>
      process.client
        ? import("vue-easy-lightbox")
        : Promise.resolve({ render: (h) => h("div") }),
  },
  async asyncData({ store, params, redirect }) {
    const product = await store.dispatch(
      "admin/product/fetchAdminById",
      params.id
    );

    if (!product._id) {
      redirect("/");
    }

    const setting = await store.getters["setting"];
    const images = product.images || [];
    const cacheImages = [];

    if (product.images.length) {
      product.images.map((i) => {
        const cacheImage =
          i.src.split(".")[0] +
          "-size-" +
          setting.popupImageSizeWidth +
          "_" +
          setting.popupImageSizeHeight +
          "." +
          i.src.split(".")[1];
        cacheImages.push({
          src: `/cache/products/${product._id}/${cacheImage}`,
        });
      });
    }

    const lightboxImg = [];

    let i = 0;

    if (cacheImages.length) {
      cacheImages.map((image) => {
        image.i = i++;
        lightboxImg.push(image.src);
        return image;
      });
    }

    const imgs = [];
    if (cacheImages.length) {
      cacheImages.map((i) => {
        imgs.push({
          src: i.src,
        });
      });
    }

    let n = 0;
    if (imgs.length) {
      imgs.map((image) => {
        image.n = n++;
        return image;
      });
    }

    if (product.tempateDescription) {
      const tempatesDescriptions = await store.dispatch(
        "admin/description/getAll"
      );
      const tempateDescription = tempatesDescriptions.find(
        (t) => t._id.toString() === product.tempateDescription.toString()
      );

      if (tempateDescription) {
        product.description = tempateDescription.html;
      }
    }
    return { product, images, cacheImages, setting, lightboxImg, imgs };
  },
  computed: {
    price() {
      return this.$store.getters["cart/typeCart"] === "retail"
        ? this.product.price
        : this.product.wholesalePrice;
    },
  },
  mounted() {
    this.quantity = this.product.minimum;
    this.step = this.product.minimum;
  },
  methods: {
    handleHide() {
      this.visible = false;
    },
    activImage(id) {
      this.imageI = id;
    },
    async addToCart(product) {
      const data = {
        _id: product._id,
        price: product.price,
        wholesalePrice: product.wholesalePrice,
        quantity: +this.quantity,
      };
      await this.$store.dispatch("cart/addToCart", data);
      this.productAdd = product;
      // this.snackbar = true;
    },
  },
};
</script>

<style scoped>
.product-img {
  width: 100%;
}

.product-img-wrap {
  padding: 5px 20px 5px 20px;
}

.product-info {
  padding: 15px;
  margin-bottom: 15px;
}

.product-info h2 {
  font-size: 1rem;
}

.product-attrs {
  padding: 0 0 5px 0;
  margin: 0;
}
.product-page-attrs {
  padding: 0;
  margin: 0;
}

.product-page-attrs li {
  list-style-type: none;
  font-size: 14px;
  padding-bottom: 3px;
}
.images {
  margin-top: 30px;
}
.image {
  padding: 15px 15px 15px 0;
  margin: 0px 0 0 15px;
}
</style>

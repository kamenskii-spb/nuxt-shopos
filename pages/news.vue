<template>
  <v-layout column>
    <v-card style="max-width:1920px">
      <v-container grid-list-md fluid>
        <v-layout wrap align-center id="option">
          <v-flex xs12 sm6 d-flex style="max-width:230px">
            <v-select
              filled
              @change="selectSortHandler"
              :items="sorts"
              :value="sort"
              label="Сортировка"
            ></v-select>
          </v-flex>

          <v-flex xs12 sm6 d-flex style="max-width:150px">
            <v-select
              filled
              @change="selectLimitHandler"
              :items="limits"
              :value="limit"
              label="Показать"
            ></v-select>
          </v-flex>
        </v-layout>

        <div class="text-center pagination-t" v-if="paginationLength > 1">
          <v-pagination
            v-model="page"
            :length="paginationLength"
            prev-icon="mdi-menu-left"
            next-icon="mdi-menu-right"
          ></v-pagination>
        </div>

        <v-container style="padding: 0; " grid-list-md fluid>
        
           <v-flex text-center v-if="productLoading" > Загрузка... </v-flex>
           
          <v-layout wrap>
            <v-flex
              v-for="product in products"
              :key="product._id"
              class="product-cart"
              xs6
              sm4
              md3
              lg3
            >

            <app-Product-Cart v-if="products.length > 0" :product="product" />

             


            </v-flex>
          </v-layout>
        </v-container>

        <div class="text-center pagination-b" v-if="paginationLength > 1">
          <v-pagination
            v-model="page"
            :length="paginationLength"
            prev-icon="mdi-menu-left"
            next-icon="mdi-menu-right"
          ></v-pagination>
        </div>
      </v-container>
    </v-card>



  </v-layout>
</template>



<script>

import AppProductCart from "@/components/main/ProductCart";


export default {
  data() {
    return {
      breadcrumbs: [],
      products: [],
      page: 1,
      limit: 12,
      sort: "По умолчанию",
      getSort: "",
      paginationLength: 0,
      limits: [12, 24, 36, 48],
      sorts: ["По умолчанию", "По цене", "По названию"],
      productLoading: false
      // productAdd: {}
    };
  },
    components: {
    AppProductCart
  },
   head(){
    return {
      title: `Новинки | ${process.env.appName}`,
          meta: [
      { hid: `news-d-`, name: 'description', content: 'Новинки последние поступления игрушек и подарков'  },
      { hid: `news-k-`, name: 'keywords', content: 'последние поступления, игрушки, подарки' },
      ]
    }
  },
  async asyncData({ store, params, route }) {
    const query = {
      getParams: route.query
    };
   // const category = await store.dispatch("category/fetchCategory", query);
     const products = await store.dispatch("product/fetchNews", query);

  const count  = await store.dispatch("product/fetchNews", {
      getParams: {limit: 60}
    });

   // const products = category.products;
    const setting = await store.getters["setting"];


    const productsCount = count.length



   

    return {
      productsCount,
      products,
      setting
    };
  },
  async mounted() {
    this.limit = +localStorage.getItem("limit") || 12;
    // this.page = +localStorage.getItem("page") || 1;
    this.sort = localStorage.getItem("sort") || "По умолчанию";
    this.paginationLength = await Math.ceil(this.productsCount / this.limit);
  },
  watch: {
    "$route.params": async function() {


      const query = {
        getParams: this.$route.query
      };

      this.products = await this.$store.dispatch("product/fetchNews", query);
      this.productLoading = false

      this.paginationLength = Math.ceil(this.productsCount / this.limit);
      // this.$vuetify.goTo("#option");
    },
    page: async function() {
      // localStorage.setItem("page", this.page);
      this.$vuetify.goTo("#option");

      this.products = []
       this.productLoading = true

      const start = this.limit * this.page - this.limit;

      let limit = "";
      if (this.limit) limit = `&limit=${this.limit}`;

      let sort = "";
      if (this.getSort) sort = `&sort=${this.getSort}`;

      this.$router.push(
        `/news?start=${start}${sort}${limit}`
      );
    }
  },
  methods: {
    async selectSortHandler(event) {
      this.sort = event;

      localStorage.setItem("sort", this.sort);

      switch (this.sort) {
        case "По цене":
          this.getSort = "price";
          break;
        case "По названию":
          this.getSort = "name";
          break;
        case "По умолчанию":
          this.getSort = "sort_order";
          break;
      }

      let limit = "";
      if (this.limit) limit = `&limit=${this.limit}`;

      this.$router.push(
        `/news?sort=${this.getSort}${limit}`
      );
    },
    async selectLimitHandler(event) {
      this.limit = event;

      localStorage.setItem("limit", this.limit);

      let sort = "";
      if (this.getSort) sort = `&sort=${this.getSort}`;

      this.$router.push(
        `/news?limit=${this.limit}${sort}`
      );
    },
    async addToCart(product) {
      this.snackbar = false;
      const data = {
        _id: product._id,
        price: product.price,
        quantity: +this.$refs[product._id + "-quantity"][0].$refs.input.value
      };
      await this.$store.dispatch("cart/addToCart", data);
      this.productAdd = product;
      // this.snackbar = true;
    }
  }
};
</script>




<style scoped>
a {
  text-decoration: none;
}
.disabled {
  color: grey;
  pointer-events: none;
}
.v-input__slider {
  width: 100%;
}
.pagination-b {
  margin-top: 20px;
}
.pagination-t {
  margin-bottom: 20px;
}

.sab-category {
  font-size: 16;
  color: #ef6c00;
  font-weight: bold;
}

.snackbar {
  color: #000;
  margin: 0;
  max-width: 200px;
}
.snackbar-btn {
  color: #000 !important;
  margin: 0 !important;
  padding-left: 0 !important;
}

</style>


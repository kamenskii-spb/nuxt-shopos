<template>
  <v-layout column>
    <div>
      <!-- <v-card style="max-width:1920px"> -->
      <h3 v-if="!category">Категория не найдена!</h3>
      <div grid-list-md fluid v-if="category">
        <app-Breadcrumbs
          :category="category"
          class="d-none d-sm-block d-md-block d-lg-block"
        />

        <h4 style="margin: 0px 0 40px 0;" v-text="category.name " />
        
        <app-category-list :categories="category.sCategory.children" />

        <app-product-filtre
          v-if="products.length || textLoading"
          :sorts="sorts"
          :sort="sort"
          :limits="limits"
          :limit="limit"
          :products="products.length"
          @selectSortHandler="selectSortHandler($event)"
          @selectLimitHandler="selectLimitHandler($event)"
        />

        <app-tag
          v-if="tagsList.length"
          :tagsList="tagsList"
          :products="products.length"
          :activTags="activTags"
          :loading="textLoading"
          @tagFilter="tagFilter($event)"
        />

        <div class="text-center pagination-t">
          <v-pagination
            v-if="paginationLength > 1 "
            v-model="page"
            color="#ef6c00"
            :length="paginationLength"
            prev-icon="mdi-menu-left"
            next-icon="mdi-menu-right"
          ></v-pagination>
        </div>


        <div grid-list-md fluid>
          <app-product-list :loading="textLoading" :products="products" />
        </div>

        <div
          class="text-center pagination-b"
          v-if="paginationLength > 1 && !textLoading"
        >
          <v-pagination
            v-model="page"
            color="#ef6c00"
            :length="paginationLength"
            prev-icon="mdi-menu-left"
            next-icon="mdi-menu-right"
          ></v-pagination>
        </div>
          <app-description  :length="paginationLength" class="my-3" :description="category.description" />
      </div>
    </div>
  </v-layout>
</template>

<script>
import AppProductList from "@/components/main/product/ProductList";
import AppBreadcrumbs from "@/components/main/Breadcrumbs";
import AppTag from "@/components/main/category/Tag";
import AppProductFiltre from "@/components/main/category/ProductFiltre";
import AppDescription from "@/components/main/category/Description";
import AppCategoryList from "@/components/main/category/CategoryList";

export default {
  head() {
    return {
      title: `${this.category.metaTitle}`,
      meta: [
        {
          hid: `category-d-${this.category._id}`,
          name: "description",
          content: this.category.metaDescription,
        },
        {
          hid: `category-k-${this.category._id}`,
          name: "keywords",
          content: this.category.metaKeywords,
        },
      ],
    };
  },
  data() {
    return {
      activTags: ["Всё"],
      breadcrumbs: [],
      products: [],
      page: 1,
      limit: 24,
      sort: "По умолчанию",
      getSort: "",
      paginationLength: 0,
      limits: [12, 24, 36, 48],
      sorts: ["По умолчанию", "По цене", "По названию"],
      category: null,
      productLoading: false,
      pageLoading: true,
      textLoading: false,
      fetchPriducts: function() {},

      // snackbarOpen: false
    };
  },
  components: {
    AppProductList,
    AppBreadcrumbs,
    AppTag,
    AppProductFiltre,
    AppDescription,
    AppCategoryList,
  },
  async asyncData({ store, params, route, redirect }) {
    if (!params.id) {
      redirect("/");
    }
    const query = {
      id: params.id,
      getParams: route.query,
    };

    const category = await store.dispatch("category/fetchCategory", query);

    if (!category) {
      redirect("/");
      return;
    }
    const products = category.products;

    if (!products.length && typeof route.query.tag !== "undefined") {
      redirect("/category/" + category.seoUrl);
    }

    const page = +route.query.page || 1;
    const setting = await store.getters["setting"];

    //await store.dispatch("category/getBreadcrumbs", category);
    // const breadcrumbs = await store.getters["category/categoryBreadcrumbs"];
    // if (typeof breadcrumbs[0] !== 'undefined'){
    //     await store.dispatch("category/activeCategory", breadcrumbs[0].href);
    //   }

    const productsCount = category.productsCount;
    const tagsList = category.tags;

    let activTags = ["Всё"];
    if (route.query.tag) {
      activTags = [route.query.tag];
    }

    return {
      page,
      tagsList,
      category,
      productsCount,
      products,
      setting,
      activTags,
    };
  },
  mounted() {
    // this.limit = +localStorage.getItem("limit") || 24;
    this.sort = localStorage.getItem("sort") || "По умолчанию";
    this.paginationLength = Math.ceil(this.productsCount / this.limit);
    this.pageLoading = false;

    this.fetchPriducts = async () => {
      this.textLoading = true;
      const query = {
        id: this.category.seoUrl,
        getParams: this.$route.query,
      };
      const category = await this.$store.dispatch(
        "category/fetchCategory",
        query
      );

      if (this.tagsList.length > 0) {
        this.productsCount = await category.productsCount;
      }
      this.products = category.products;
      this.paginationLength = Math.ceil(this.productsCount / this.limit);

      // this.$vuetify.goTo("#scroll", {
      //   duration: 600,
      //   easing: "linear",
      // });
      this.textLoading = false;
    };
  },
  watch: {
    // "$route.params": async function () {
    //     this.fetchPriducts()
    // },

    page: async function() {
      this.products = [];
      const start = this.limit * this.page - this.limit;
      this.$router.push(
        {
          path: this.category.seoUrl,
          query: {
            start: start,
            sort: this.getSort || "",
            limit: this.limit || "",
            tag: this.activTags || "",
            page: this.page,
          },
        },
        this.fetchPriducts
      );
    },
  },
  methods: {
    async tagFilter(tag) {
      this.page = 1;
      this.productLoading = true;
      const start = this.limit * this.page - this.limit;
      let limit = "";
      if (this.limit) limit = `&limit=${this.limit}`;
      let sort = "";
      if (this.getSort) sort = `&sort=${this.getSort}`;

      if (this.activTags.indexOf(tag) === -1) {
        if (tag === "Всё") {
          this.activTags = ["Всё"];
        } else {
          this.activTags = [];
          this.activTags.push(tag);
          if (this.activTags.includes("Всё"))
            this.activTags.splice(this.activTags.indexOf("Всё"), 1);
        }
      } else {
        this.activTags.splice(this.activTags.indexOf(tag), 1);
      }
      this.products = [];
      let rout = `/category/${
        this.category.seoUrl
      }?start=${start}${sort}${limit}&page=${this.page}`;

      this.activTags.forEach((t) => {
        rout = rout + "&tag=" + t;
      });
      this.productLoading = false;
      this.$router.push(rout, this.fetchPriducts);
    },
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
      let rout = `/category/${this.category.seoUrl}?sort=${
        this.getSort
      }${limit}`;
      if (this.activTags.length) {
        this.activTags.forEach((t) => {
          rout = rout + "&tag=" + t;
        });
      }
      this.$router.push(rout, this.fetchPriducts);
    },
    async selectLimitHandler(event) {
      this.limit = event;
      localStorage.setItem("limit", this.limit);
      let sort = "";
      if (this.getSort) sort = `&sort=${this.getSort}`;
      this.page = 1;
      let rout = `/category/${this.category.seoUrl}?limit=${
        this.limit
      }${sort}&page=${this.page}`;
      if (this.activTags.length) {
        this.activTags.forEach((t) => {
          rout = rout + "&tag=" + t;
        });
      }
      this.$router.push(rout, this.fetchPriducts);
    },
  },
};
</script>

<style scoped>
a {
  text-decoration: none;
}

.pagination-b {
  margin-top: 20px;
}

.pagination-t {
  margin-bottom: 20px;
}

.v-card-title {
  font-size: 0.8rem;
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  height: 60px;
  overflow: hidden;
  font-weight: 500;
  letter-spacing: 0.0125em;
  line-height: 1.1rem;
  word-break: break-all;
}
</style>

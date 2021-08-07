<template>
  <div>
    <h3 v-if="products.length == 0">Продуктов нет</h3>
    <v-layout row>
      <v-card-title class="headline mb">Товары</v-card-title>
      <v-spacer></v-spacer>
      <v-btn
        color="error"
        :loading="loading"
        :disabled="!!!productSelected.length > 0 || loading"
        class="mt1"
        @click="remove()"
        style="margin-right:10px"
        >Удалить</v-btn
      >
    </v-layout>
    <client-only>
      <v-card-title>
        Товары
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="search"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
      </v-card-title>

      <div>Сортировка по категории</div>
      <select
        ref="selectCategories"
        class="selectCategories"
        @change="sortHandler()"
      >
        <option
          v-for="cat in breadcrumbListFromCategories"
          :key="cat._id"
          :value="cat._id"
          >{{ cat.name }}
        </option>
      </select>

      <v-data-table
        :single-select="false"
        :headers="headers"
        :items="products"
        :items-per-page="48"
        :search="search"
      >
        <template v-slot:item="{ item }">
          <tr>
            <td>
              <v-checkbox
                v-model="item.selected"
                @click.stop="selectProduct(item)"
                class="v-checkbox"
              ></v-checkbox>
            </td>
            <td>{{ item.name }}</td>
            <td>
              <input
                type="text"
                :value="item.wholesalePrice"
                style="width: 50px"
                @change="shangePriceHandler('wholesale', item._id, $event)"
              />
            </td>
            <td>
              <input
                type="text"
                :value="item.price"
                style="width: 50px"
                @change="shangePriceHandler('retail', item._id, $event)"
              />
            </td>
            <td>
              <v-sheet>
                <!-- <v-switch
                  v-model="item.status"
                  @change="shangeStatusHandler(item.status, item._id)"
                ></v-switch> -->
                
               <v-switch  
                v-if="item.status"
                :disabled="switchLoading"
                @change="shangeStatusHandler(0, item._id)"
                 value input-value="true" />
               <v-switch 
                @change="shangeStatusHandler(1, item._id)" 
                v-else />
                
              </v-sheet>
            </td>
            <td>
              <strong>{{ item.model }}</strong>
            </td>
            <td>
              <nuxt-link :to="`/admin/product/${item.seoUrl}`">
                <span style="cursor: pointer">Изменить</span>
              </nuxt-link>
            </td>
          </tr>
        </template>
      </v-data-table>
    </client-only>
  </div>
</template>

<script>
export default {
  layout: "admin",
  middleware: ["admin-auth"],
  data() {
    return {
      switchLoading: false,
      loading: false,
      productSelected: [],
      search: "",
      headers: [
        {
          text: "",
          align: "left",
          value: "568",
        },
        {
          text: "Название",
          align: "left",
          value: "name",
        },
        { text: "Цена опт.", value: "wholesalePrice" },
        { text: "Цена розн.", value: "price" },
        { text: "Статус", value: "status" },
        { text: "Модель", value: "model" },
        { text: "Изменить", sortable: false },
      ],
    };
  },
  async asyncData({ store }) {
    const categories = await store.dispatch("admin/category/fetch");

    let breadcrumbListFromCategories = await store.dispatch(
      "admin/category/breadcrumbListFromCategories",
      categories
    );

    breadcrumbListFromCategories = breadcrumbListFromCategories.splice(1);

    breadcrumbListFromCategories.unshift({ name: "Показать все", _id: "" });

    const products = await store.dispatch("admin/product/fetch");

   
    return { products, breadcrumbListFromCategories };
  },
  methods: {
    async sortHandler() {
      let category = {};
      if (this.$refs["selectCategories"].value) {
        category = await this.$store.dispatch(
          "admin/category/fetchAdminByid",
          this.$refs["selectCategories"].value
        );

        if (category.products) {
          this.products = category.products;
        }
      } else {
        this.products = await this.$store.dispatch("admin/product/fetch");
      }
    },
    shangePriceHandler(typePrice, id, event) {
      const data = {
        type: typePrice,
        id,
        price: event.target.value,
      };

      if (!data.price || data.price > 10000000 || !id) return;
      this.$store.dispatch("admin/product/changePrice", data);
      this.$store.commit('admin/product/changePrice', data )
    },
   async shangeStatusHandler(status, id) {
      this.switchLoading = true
      const data = {
        status,
        id,
      };
     await this.$store.dispatch("admin/product/changeStatus", data)
      this.switchLoading = false
    },
    async remove() {
      const formData = {
        ids: this.productSelected,
      };
      await this.$store.dispatch("admin/product/remove", formData).then(()=>{
          this.productSelected.forEach(id => {
          this.$store.commit('admin/product/removeProduct', id )
      });
      })
      this.productSelected = [];
    },
    selectProduct(product) {
      const idx = this.products.findIndex((p) => p._id === product._id);
       //this.products[idx].selected = !this.products[idx].selected;
    this.$store.commit('admin/product/shangeSelected', idx )
      if (this.products[idx].selected) {
        this.productSelected.push(this.products[idx]._id);
      } else {
        const sidx = this.productSelected.findIndex(
          (id) => id === this.products[idx]._id
        );
        this.productSelected.splice(sidx, 1);
      }
    },
  },
};
</script>

<style scoped>
.selectCategories {
  border: 1px solid #cccc;
  margin-bottom: 10px;
  background-color: #fff;
  width: 100%;
  padding: 5px 10px;
  border-radius: 5px;
}

.theme--light.v-sheet {
  background-color: transparent;
  border-color: transparent;
  color: rgba(0, 0, 0, 0.87);
}
</style>

<template>
  <div>
     <h3  v-if="categoruesTree.length == 0"  >Категорий нет</h3>
    <v-layout row>
      <v-card-title class="headline mb">Категории</v-card-title>
      <v-spacer></v-spacer>
      <v-btn
        color="error"
        :loading="loading"
        :disabled=" !!!categorySelected.length > 0  || loading"
        class="mt1"
        @click="remove()"
        style="margin-right:10px"
      >Удалить</v-btn>
    </v-layout>

    <v-card>
      <v-treeview :items="categoruesTree" >
        <template v-slot:label="{ item }">
          <a @click.prevent="categoryOpen(item.seoUrl)">{{item.name.trim()}}</a>
        </template>

        <template v-slot:prepend="{ item }">
          <v-checkbox
            :disabled="item.checkDesabled"
            @change="checkboxOnChange(item)"
            v-model="categorySelected"
            :value="item._id"
            class="v-checkbox"
          ></v-checkbox>
        </template>
      </v-treeview>
    </v-card>
    <div class="text-xs-center">
      <v-snackbar class="snackbar" v-model="snackbar" :timeout="4000" :top="true" color="success">
        <span>{{snackbarText}}</span>
      </v-snackbar>
    </div>
  </div>
</template>

<script>
export default {
  layout: "admin",
  middleware: ["admin-auth"],
  head: {
    title: `Все категории`
  },
  data: () => ({
    categories: [],
    snackbar: false,
    snackbarText: "",
    categoruesTree: [],
    dense: true,
    hoverable: true,
    openOnClick: true,
    color: "primary",
    selectedColor: "accent",
    selectable: false,
    categorySelected: [],
    loading: false,
    checkDesabled: false
  }),
  async asyncData({ store }) {
    const categories = await store.dispatch("admin/category/fetch");
    return { categories };
  },
  methods: {
    open(seoUrl) {
      this.$router.push(`/admin/category/${seoUrl}`);
    },
    checkboxOnChange(category) {
      
      if (this.categorySelected.indexOf(category._id) != -1) {
        this.checkDesabled = true;
      } else {
        this.checkDesabled = false;
      }

      if (category.children) {
        this.findChildren(category);
      }

      this.categorySelected = Array.from(new Set(this.categorySelected));
    },
    findChildren(category) {
      category.children.forEach(children => {
        this.categorySelected.findIndex(id => id === category._id);

        this.categorySelected.push(children._id);
        children.checkDesabled = this.checkDesabled;
        if (!this.checkDesabled) {
          this.categorySelected = this.categorySelected.filter(function(item) {
            return item !== children._id;
          });
        }

        if (children.children) {
          this.findChildren(children);
        }
      });
    },

    async remove() {
      const formData = {
        ids: this.categorySelected
      };

      try {
        await this.$store.dispatch("admin/category/remove", formData);

        
        const categories = await this.$store.dispatch("admin/category/fetch");
        this.categoruesTree = await this.$store.dispatch(
          "admin/category/buildTree",
          categories
        );
        this.snackbarText = "Категория удалена";
        this.snackbar = true;

        // await this.$confirm('Удалить ?', 'Внимание!', {
        //   confirmButtonText: 'Да',
        //   cancelButtonText: 'Отменить',
        //   type: 'warning'
        // })
        // await this.$store.dispatch('post/remove', id)
        // this.posts = this.posts.filter(p => p._id !== id)

        // this.$message.success('Пост удален')
      } catch (e) {
        console.log(e);
      }
    },
    categoryOpen(seoUrl) {
      this.$router.push(`/admin/category/${seoUrl}`);
    }
  },
  async mounted() {
    if (this.categories.length > 0)
      this.categoruesTree = await this.$store.dispatch(
        "admin/category/buildTree",
        this.categories
      );
    // const { message } = this.$route.query;
    // switch (message) {
    //   case "success":
    //     this.snackbarText = "Категория добавлена";
    //     this.snackbar = true;
    //     break;
    // }
  }
};
</script>


<style lang="scss" scoped>
.v-checkbox {
  flex: 0 1 0%;
  margin: 0;
  padding: 0;
  position: relative;
  top: 10px;
  max-height: 40px;
}
</style>

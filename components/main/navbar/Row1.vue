<template>
  <v-app-bar elevation-0 clipped-right color="#fff" dense>
    <div @click="openDrawer()" class="d-none d-sm-block d-md-none d-lg-none">
      <v-toolbar-title style="cursor: pointer" >
        <v-app-bar-nav-icon />
      </v-toolbar-title>
    </div>
    <logo :logoStyle="logoStyle" class="d-none d-sm-block d-md-none" />
    <v-toolbar-title class="phone d-none d-sm-flex d-sm-none d-md-flex"
      >+7 (812)454-60-75 
      <span class="phone d-none d-sm-none d-md-flex">,</span>
    </v-toolbar-title>
        <v-toolbar-title style="margin-left:20px" class="phone d-none d-sm-none d-md-flex"
      >+7 (931)203-60-75 
    </v-toolbar-title>

    <div class="slogan" >Оптово-розничный интернет-магазин сувениров и подарков</div>
    
    <v-spacer></v-spacer>
    <v-toolbar-items v-if="pages.length <= 2">
      <v-toolbar-title
        class="top-links d-none d-sm-flex"
        style="margin-top:5px"
      >
        <nuxt-link
          v-for="(page, n) in pages"
          :key="n"
          :to="`/page/${page.url}`"
          no-prefetch
        >
          <v-btn text>{{ page.title }}</v-btn>
        </nuxt-link>
      </v-toolbar-title>
    </v-toolbar-items>

    <v-menu offset-y v-else>
      <template v-slot:activator="{ on }">
        <v-btn
          v-on="on"
          text
          class="top-links d-none d-sm-flex"
          style="margin-top:5px"
        >
          Информация
        </v-btn>
      </template>
      <v-list>
        <v-list-item v-for="(page, n) in pages" :key="n">
          <nuxt-link :to="`/page/${page.url}`" no-prefetch>
            {{ page.title }}
          </nuxt-link>
        </v-list-item>
      </v-list>
    </v-menu>

    <v-menu offset-y>
      <template v-slot:activator="{ on }">
        <v-btn class="d-flex d-sm-none" v-on="on" text>
          Информация
        </v-btn>
      </template>
      <v-list>
        <v-list-item v-for="(page, n) in pages" :key="n">
          <nuxt-link :to="`/page/${page.url}`" no-prefetch>
            {{ page.title }}
          </nuxt-link>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script>
import logo from "@/components/main/logo";
export default {
 data() {
   return { 
    logoStyle: {
      width: "10px",
      height: "20px",
      marginRight: "20px"
    },
    test: '555dd'
   }
  },
  components: {
    logo,
  },
  computed: {
    pages() {
      return this.$store.getters["page/pages"];
    },
  },
  methods: {
    openDrawer() {
      this.$emit("drawerOpen");
    },
  },
  // mounted(){
  //   console.log(this.logoStyle)
  // }
};
</script>

<style lang="scss" scoped>
@import "@/theme/_variables";
.phone {
  color: $main-color;
  cursor: default;
}

.slogan{
    position: absolute;
    top: 55px;
}

.top-links a {
  text-decoration: none;
}
</style>


<template>
  <v-app id="inspire">
    <v-navigation-drawer
      v-model="drawer"
      absolute
      temporary
      class="d-flex d-sm-none d-none d-sm-flex d-md-none"
    >
      <app-aside />
    </v-navigation-drawer>
    <v-content>
      <v-container fluid>
    <v-card
    color="grey lighten-4"
    flat
    height="45px"
    tile
  >
    <v-toolbar dense>
      <v-app-bar-nav-icon  class="d-flex d-sm-none d-none d-sm-flex d-md-none"  @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title style="padding-left: 0px">Панель администратора </v-toolbar-title>

      <v-spacer></v-spacer>
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">

     <nuxt-link style="color: #fff" :to="`/`" no-prefetch target="_blank">
      <v-btn icon>
        <v-icon
                v-bind="attrs"
                v-on="on"
        >mdi-export</v-icon>
      </v-btn>
      </nuxt-link>
        </template>
        <span>К витрине магазина</span>
      </v-tooltip>
    </v-toolbar>


  </v-card>


      <!-- <v-app-bar-nav-icon @click.stop="drawerRight = !drawerRight"></v-app-bar-nav-icon> -->
        <v-row>
          <v-col cols="col-12" md="3" sm="12" class="d-none d-md-block">
            <app-aside />
          </v-col>
          <v-col cols="col-12" md="9" sm="12">
            <nuxt />
          </v-col>
        </v-row>
      </v-container>
    </v-content>

    <v-navigation-drawer v-model="right" fixed right temporary></v-navigation-drawer>

    <v-footer app color="blue-grey" class="white--text">
      <span>Vuetify</span>
      <v-spacer></v-spacer>
      <span>&copy; 2019</span>
    </v-footer>
  </v-app>
</template>

<script>
import AppAside from "@/components/admin/Aside";

export default {
  props: {
    source: String
  },
  data: () => ({
    drawer: false,
    drawerRight: false,
    right: false,
    left: false,
    cacheLoader: false
  }),
  components: {
    AppAside
  }
};
</script>



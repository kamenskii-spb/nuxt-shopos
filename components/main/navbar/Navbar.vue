<template>
  <div>
    <v-row no-gutters class="header">
      <logo
        :logoStyle="logoStyle"
        class="d-none d-sm-none d-md-block d-lg-block"
      />
      <app-row1
        class="d-none d-sm-block d-md-block"
        @drawerOpen="drawerOpen()"
      />

      <v-layout row wrap no-gutters>
        <v-flex xs12 sm5 class="d-none d-sm-block d-md-block ">
          <app-search />
        </v-flex>
        <v-flex xs12 sm7>
          <app-row2 v-if="!serachDialog" />
          <app-search
            v-if="serachDialog"
            style="position: relative; z-index:6; width:100%;"
          />
          <div
            v-if="serachDialog"
            @click="closeDialog"
            class="cost-overlay"
          ></div>
        </v-flex>
      </v-layout>
    </v-row>
  </div>
</template>

<script>
import AppRow1 from "@/components/main/navbar/Row1";
import AppRow2 from "@/components/main/navbar/Row2";
import AppSearch from "@/components/main/navbar/Search";
import logo from "@/components/main/logo";

export default {
  data() {
    return {
      mobileSearch: false,
      logoStyle: {
        zIndex: 9999,
        background: "#fff",
        width: "190px",
        height: "100px",
        padding: "5px",
        zIndex: 0,
      },
    };
  },
  computed: {
    serachDialog() {
      return this.$store.getters["dialog/serachDialog"];
    },
  },
  methods: {
    closeDialog() {
      this.$store.commit("dialog/closeAll", "nav");
    },
    drawerOpen() {
      this.$emit("drawerOpen");
    },
  },
  components: {
    AppRow1,
    AppRow2,
    AppSearch,
    logo,
  },
};
</script>

<style lang="scss" scoped>
.header {
  background: #fff;
}
// .row1{
//   height: 500px;
// }
</style>

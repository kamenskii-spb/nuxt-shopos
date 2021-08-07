<template>
  <v-app id="inspire" style="margin: 0 auto; padding: 0 10px">
    <!-- <v-container  class="main-content"> -->

    <client-only>
      <v-navigation-drawer
        width="240"
        class="drawer hidden-md-and-up"
        v-model="drawer"
        app
      >
        <app-left-list :isInDriver="true" />
      </v-navigation-drawer>
    </client-only>

    <div
      style="min-height:100px"
      class="mobile-header d-flex d-sm-none d-none d-lg-none"
    >
      <div class="nav-icon">
        <div @click.stop="drawerHandler()">
          <v-toolbar-title style="cursor: pointer">
            <v-app-bar-nav-icon />
          </v-toolbar-title>
        </div>
        <client-only>
          <div @click.stop="openSearch()">
            <div style="cursor: pointer; margin-left:20px">
              <font-awesome-icon icon="search" />
            </div>
          </div>
        </client-only>
      </div>
      <div>
        <logo
          :logoStyle="logoStyle"
          class="d-block d-sm-none d-none d-sm-block d-md-none"
        />
      </div>
      <div>
        <app-cart-info />
      </div>
    </div>

 
   

    <!-- <v-content :style="[true ? {'padding-left': '220px'} : {'padding-left': '0px'}]"> -->
    <div class="content">
       <app-navbar @drawerOpen="drawerOpen($event)" />
      <!-- <v-content> -->
      <div style="min-height: 100%" class="main">
        <div style="padding-bottom: 90px; display: flex">
          <div>
            <div class="destop-sidebar-wrapper">
              <client-only>
                <app-left-list />
              </client-only>
            </div>
          </div>
          <div style="margin: 20px 0; width: 100%;">
            <!-- <div id="scroll" /> -->
            <nuxt />
          </div>
        </div>
      </div>
      <!-- </v-content> -->
      <div class="footer">
        <app-footer />
      </div>
    </div>

    <!-- </v-container> -->
  </v-app>
</template>

<script>
import AppLeftList from "@/components/main/LeftList";
import AppNavbar from "@/components/main/navbar/Navbar";
import AppFooter from "@/components/main/Footer";
import logo from "@/components/main/logo";
import AppCartInfo from "@/components/main/CartInformation";

// import _ from 'lodash'

export default {
  props: {
    source: String,
  },
  components: {
    AppLeftList,
    AppNavbar,
    AppFooter,
    logo,
    AppCartInfo,
  },
  data: () => ({
    drawer: false,
    loading: true,
    subcategoryBackground: false,
    logoStyle: {
      backgroundColor: "#fff",
      width: "130px",
      paddingBottom: "15px",
      margin: "0, auto",
    },
    sidebar: {
      height: 0,
      windowHeight: 0,
      windowScrollTop: 0,
      distop: true,
    },
  }),
  async mounted() {
    await this.$store.dispatch("cart/setCart");

    this.loading = false;
    if (process.client) {
      var _tmr = window._tmr || (window._tmr = []);
      _tmr.push({
        id: "3185677",
        type: "pageView",
        start: new Date().getTime(),
      });
      (function(d, w, id) {
        if (d.getElementById(id)) return;
        var ts = d.createElement("script");
        ts.type = "text/javascript";
        ts.async = true;
        ts.id = id;
        ts.src = "https://top-fwz1.mail.ru/js/code.js";
        var f = function() {
          var s = d.getElementsByTagName("script")[0];
          s.parentNode.insertBefore(ts, s);
        };
        if (w.opera == "[object Opera]") {
          d.addEventListener("DOMContentLoaded", f, false);
        } else {
          f();
        }
      })(document, window, "topmailru-code");

      window.onresize = () => {
        this.$store.commit("dialog/closeAll");
      };
    }
  },
  methods: {
    drawerHandler() {
      this.drawer = !this.drawer;
    },
    openSearch() {
      this.$store.commit("dialog/setDialog", {
        dialog: "serachDialog",
        value: true,
      });
    },
    drawerOpen() {
      this.drawer = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.destop-sidebar-wrapper {
  width: 220px;
  margin: 15px 15px 15px 0;
}

.main-content {
  padding: 0;
}

.mobile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 10px 0px 10px;
  background-color: #fff;
}

.nav-icon {
  background-color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-right: 10px;
  width: 38px;
}

.ps {
  height: 100vh;
}

.footer {
  width: 100%;
}

$color-4: #eead68;
$color-3: #eec368;
$color-2: #eece68;
$color-1: #eed968;
$color-5: #ee8c68;

$color: $color-1, $color-2, $color-3, $color-4, $color-5;

@mixin anim() {
  @keyframes scale {
    0% {
      transform: scale(1);
    }
    50%,
    75% {
      transform: scale(2.5);
    }
    78%,
    100% {
      opacity: 0;
    }
  }
}

body {
  overflow: hidden;
}

@for $i from 1 through 5 {
  .item-#{$i} {
    width: 20px;
    height: 20px;
    background: #f583a1;
    border-radius: 50%;
    @include anim();
    background-color: nth($color, $i);
    margin: 7px;
    display: flex;
    justify-content: center;
    align-items: center;

    &:before {
      content: "";
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background-color: nth($color, $i);
      opacity: 0.7;
      animation: scale 2s infinite cubic-bezier(0, 0, 0.49, 1.02);
      animation-delay: 200ms * $i;
      transition: 0.5s all ease;
      transform: scale(1);
    }
  }
}
</style>

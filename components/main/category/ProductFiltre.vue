<template>
  <v-layout wrap style="align-items: baseline;">
    <v-flex xs6 sm6 d-flex style="max-width:230px; margin-right: 10px">
      <v-select
        @change="selectSortHandler"
        :items="sorts"
        :value="sort"
        label="Сортировка"
        :disabled="!products"
        dense
        height="25px"
      ></v-select>
    </v-flex>

    <v-flex xs6 sm6 d-flex style="max-width:150px">
      <v-select
        @change="selectLimitHandler"
        :items="limits"
        :value="limit"
        label="Показать"
        :disabled="!products"
        dense
        width="200px"
        height="25px"
      ></v-select>
    </v-flex>

    <v-flex
      class="text-right font-weight-bold"
      @click="changeProductView('_', $event)"
    >
      <v-icon
        @mouseenter="tooltipHandler('grid')"
        @mouseleave="removeTooltips()"
        v-ripple
        class="icon icon-list"
        data-view="grid"
        ref="grid"
        left
        dark
        >mdi-view-grid-outline</v-icon
      >
      <v-icon
        @mouseenter="tooltipHandler('list')"
        @mouseleave="removeTooltips()"
        v-ripple
        class="icon icon-list"
        data-view="list"
        ref="list"
        left
        dark
        >mdi-format-list-checkbox</v-icon
      >
    </v-flex>
  </v-layout>
</template>

<script>
import Tooltip from "@kamenskii/tooltip";
import "@kamenskii/tooltip/dist/umd/tooltip.css";

export default {
  data() {
    return {
      tooltipGrid: {},
    };
  },
  props: ["sorts", "sort", "products", "limits", "limit"],
  methods: {
    selectSortHandler(event) {
      this.$emit("selectSortHandler", event);
    },
    selectLimitHandler(event) {
      this.$emit("selectLimitHandler", event);
    },
    changeProductView(cl, event) {
      if (!event.target.dataset.view) return;
      this.$store.commit("product/setView", event.target.dataset.view);
    },
    tooltipHandler(handler) {
      if (handler === "grid") {
        this.tooltipGrid.open("Сетка");
      } else if (handler === "list") {
        this.tooltipList.open('Список')
      }
      this.tooltipOpen = true;
    },
    removeTooltips() {
      this.tooltipGrid.close();
      this.tooltipList.close();
    },
  },
  mounted() {
      const options = { position: "top" }
      this.tooltipGrid = new Tooltip(this.$refs.grid.$el, options );
      this.tooltipList = new Tooltip(this.$refs.list.$el, options);
  },
};
</script>

<style>
.icon-list {
  color: #494949 !important;
  border: 1px solid #f1f1f1;
}
.icon-list:hover {
  cursor: pointer;
}


.km-tooltip{
  width: 80px !important
}

</style>


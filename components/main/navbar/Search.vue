<template>
  <div class="search" style=" margin-left:0px">
    <autocomplete
        aria-label="Поиск по товарам"
        placeholder="Поиск по товарам"
        :search="search"
        :get-result-value="getResultValue"
    >
      <template v-slot:result="{ result, props }">
        <div
            v-if="result.name !== 'Ничего не найдено'"
           @click="goTo(`/product/${result.seoUrl}`)"
        >
          <li
              v-ripple
              v-bind="props"
              class="autocomplete-result wiki-result"
          >
            <div class="wiki-title">
              <v-list-item>
                <v-img
                    style="margin-right: 10px "
                    max-width="40"
                    :src="result.imageSrc"
                >
                </v-img>
                <v-list-item-content>
                  <v-list-item-title>{{ result.name }}</v-list-item-title>
                  <v-list-item-subtitle
                      v-if="typeof result.model !== 'undefined'"
                  >
                    {{ "Модель: " + result.model }}
                  </v-list-item-subtitle
                  >
                </v-list-item-content>
              </v-list-item>
            </div>
          </li>
        </div>
        <div
            v-else
            v-ripple
            v-bind="props"
            class="autocomplete-result wiki-result"
        >
          <span>{{ result.name }}</span>
        </div>
      </template>
    </autocomplete>
  </div>
</template>

<script>
import Autocomplete from "@trevoreyre/autocomplete-vue";
import "@trevoreyre/autocomplete-vue/dist/style.css";
export default {
  components:{
    Autocomplete,
  },
  methods: {
    async search(input) {
      const res = encodeURI(input);
      if (input.length >= 3) {
        const responce = await this.$store.dispatch("cart/search", res);
        document.querySelector('.autocomplete-result-list').style.zIndex = 9
        return responce.length > 0
            ? responce
            : [{name: "Ничего не найдено", seoUrl: "/"}];
      } else {
        return [];
      }
    },
    getResultValue(result) {
      return result.title
    },
    goTo(link){
      this.$store.commit("dialog/closeAll", 'search')
      this.$router.push(link)
    }
  }
}
</script>

<style scoped>
.search {
  z-index: 5;
}

.search a {
  text-decoration: none;
}

.wiki-result {
  border-top: 1px solid #eee;
  padding: 5px 0;
  background: transparent;
  cursor: pointer;
}

.wiki-title {
  font-size: 20px;
  margin-bottom: 8px;
}

.wiki-snippet {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.54);
}
</style>
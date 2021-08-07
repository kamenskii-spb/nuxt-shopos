<template>
  <div>
    <div class="destop-sidebar" ref="stickySidebar"
      :style="[
              { width: isInDriver ? '100%' : '220px' }
            ]">
      <div class="inner-wrapper-sticky">
        <perfect-scrollbar>
          <div
            class="accordion"
            v-if="categories.length"
            @click="childrenWrapClose()"
            :style="[
              { height: isInDriver ? '100vh' : '100%' },
              { overflow: 'visible' },
            ]"
          >
            <div class="categories-wrap">
              <ul>
                <div
                  v-for="(category, index) in categories"
                  :key="index"
                  @mouseenter="openChildren(category.children || [], $event)"
                  data-categories="dd"
                >
                  <nuxt-link
                    :class="{ activ: categoryActiv.includes(category.seoUrl) }"
                    no-prefetch
                    :to="'/category/' + category.seoUrl"
                  >
                    <li>
                      {{ category.name }}
                      <div v-if="category.children && !isInDriver">
                        <font-awesome-icon icon="chevron-right" />
                      </div>
                    </li>
                  </nuxt-link>
                </div>
              </ul>
            </div>

            <div
              v-if="isInDriver"
              class="modile-nav d-flex d-sm-none d-none d-sm-flex d-md-none"
            >
              <div>
                <div class="modile-nav-item" v-if="!user._id" text>
                  <nuxt-link to="/login" no-prefetch>
                    Вход
                  </nuxt-link>
                </div>
                <div class="modile-nav-item" v-if="!user._id" text>
                  <nuxt-link to="/register" no-prefetch>
                    Регистрация
                  </nuxt-link>
                </div>

                <div class="modile-nav-item" v-else text>
                  <nuxt-link to="/account" no-prefetch>
                    Личный кабинет
                  </nuxt-link>
                </div>

                <div class="modile-nav-item-contact" text>
                  <nuxt-link to="/page/kontakti" no-prefetch>
                    Контакты
                  </nuxt-link>
                </div>
              </div>
            </div>

            <!-- <div class="list-footer"></div> -->
          </div>
        </perfect-scrollbar>
      </div>
    </div>

    <transition name="slide-fade">
      <div
        v-if="open && !isInDriver"
        class="children-wrap d-none d-sm-none d-md-block d-lg-block"
        :style="{
          width: childrenWrapWidth,
          top: top,
          paddingTop: paddingTop,
        }"
        @click="childrenWrapClose()"
      >
        <div>
          <ul>
            <li
              v-for="sabCategory in subCategories"
              :key="sabCategory._id"
              ref="li"
            >
              <nuxt-link
                :to="'/category/' + sabCategory.seoUrl"
                no-prefetch
                :class="{ activ: categoryActiv.includes(sabCategory.seoUrl) }"
              >
                {{ sabCategory.name }}
              </nuxt-link>
              <ul class="sab-children">
                <li
                  v-for="sabSubCategory in sabCategory.children"
                  :key="sabSubCategory._id"
                >
                  <nuxt-link
                    :to="'/category/' + sabSubCategory.seoUrl"
                    no-prefetch
                    :class="{
                      activ: categoryActiv.includes(sabSubCategory.seoUrl),
                    }"
                  >
                    {{ sabSubCategory.name }}
                  </nuxt-link>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { PerfectScrollbar } from "vue2-perfect-scrollbar";
import { scroll } from "@/assets/js/scroll";
import "vue2-perfect-scrollbar/dist/vue2-perfect-scrollbar.css";

export default {
  props: ["isInDriver"],
  data() {
    return {
      open: false,
      top: "101px",
      paddingTop: "5px",
      childrenWrapWidth: "250px",
      subCategories: [],
    };
  },
  components: {
    PerfectScrollbar,
  },
  computed: {
    user() {
      return this.$store.getters["auth/user"];
    },
    categories() {
      return this.$store.getters["category/categoriesTree"];
    },
    categoryActiv() {
      const categoryActiv = [];
      this.$store.getters["category/categoryBreadcrumbs"].map((b) => {
        categoryActiv.push(b.seoUrl);
      });
      return categoryActiv;
    },
  },
  updated() {
    const pageYOffset = window.pageYOffset;
    this.top = !pageYOffset ? "148px" : window.pageYOffset + "px";
    this.paddingTop = pageYOffset ? "70px" : "5px";
    if (this.$refs.li && this.$refs.li.length) {
      // this.childrenWrapWidth =
      //   this.$refs.li[this.$refs.li.length - 1].getBoundingClientRect().x -
      //   60 +
      //   "px";

      const sizeLi = [];
      this.$refs.li.forEach((element) => {
        sizeLi.push(element.getBoundingClientRect().x);
      });

      let unique = [...new Set(sizeLi)];

      this.childrenWrapWidth = 220 * unique.length + 1 + "px";
    }
    // console.log(this.$refs.li[this.$refs.li.length - 1].getBoundingClientRect())
  },
  mounted() {
    if (!this.isInDriver) {
      new StickySidebar(this.$refs.stickySidebar, {
        topSpacing: 0,
        bottomSpacing: 120,
        containerSelector: ".main",
        innerWrapperSelector: ".inner-wrapper-sticky",
        stickyClass: false,
        minWidth: 220,
      });
    }
  },
  methods: {
    openChildren(children) {
      scroll(true);
      const $childrenWrap = this.$refs.childrenWrap;
      if (!children.length) {
        this.open = false;
        return;
      }
      this.subCategories = children;
      scroll(false);

      this.open = true;

      if (!document.querySelector(".subcategory-background")) {
        const $subcategoryBackground = document.createElement("div");
        $subcategoryBackground.classList.add("subcategory-background");
        document
          .querySelector("body")
          .insertAdjacentElement("afterbegin", $subcategoryBackground);
        $subcategoryBackground.addEventListener("mousemove", (e) => {
          this.open = false;
          scroll(true);
          $subcategoryBackground.remove();
        });
      }
    },
    childrenWrapClose() {
      this.open = false;
      scroll(true);
    },
  },
};
</script>

<style scoped lang="scss">
@import "@/theme/_variables";

.destop-sidebar {
  width: 220px;
  overflow: visible;
  z-index: 4;
  position: absolute;
  // top: 100px;
}

.modile-nav {
  margin-top: 20px;
  font-weight: 500;
  border-top: 1px solid #ccc;
  padding: 10px 0;
}

.modile-nav .modile-nav-item,
.modile-nav-item-contact {
  padding: 10px;
  color: #4b8bf4;
  cursor: pointer;
}
.modile-nav-item-contact a {
  color: rgba(0, 0, 0, 0.87);
}
.modile-nav .modile-nav-item:hover {
  background-color: #f1f1f1;
}

.list-footer {
  height: 200px;
}

.activ {
  color: $main-color !important;
  border-color: $main-color !important;
}

.accordion {
  // margin-top: 10px;

  ul {
    list-style: none;
  }

  .categories-wrap {
    a {
      text-decoration: none;
      color: rgba(0, 0, 0, 0.87);
      word-wrap: break-word;
    }

    ul {
      padding: 0px;

      li {
        position: relative;
        display: flex;
        justify-content: space-between;
        padding: 10px 10px 10px 10px;
        cursor: pointer;
        background-color: #fff;
      }

      li:hover {
        background-color: #f1f1f1;
      }
    }
  }
}

.children-wrap {
  position: absolute;
  // padding: 10px 5px 15px 5px;
  bottom: 0;
  left: 220px;
  min-width: 260px;
  height: 100vh;
  border-right: 1px solid #f1f1f1;
  background-color: #fff;
  z-index: 9;
  padding-bottom: 15px;

  ul {
    margin-top: 3px;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    list-style: none;
    padding-bottom: 150px;

    li {
      padding: 5px;
      max-width: 150px;

      a {
        color: rgba(0, 0, 0, 0.87);
        font-weight: 600;
        font-size: 0.8rem;
        text-decoration: none;
        border-bottom: 1px solid rgba(0, 0, 0, 0.7);
      }

      a:hover {
        color: $main-color;
        border-color: $main-color;
      }

      .sab-children {
        padding: 0;
        font-size: 0.7rem;

        ul {
          margin-top: 5px;
        }

        li {
          padding: 2px 0px;

          a {
            font-weight: normal;
            border: none;
          }
        }
      }
    }
  }
}

.slide-fade-enter-active {
  transition: all 0.3s ease;
}

.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter, .slide-fade-leave-to
        /* .slide-fade-leave-active до версии 2.1.8 */
 {
  transform: translateX(40px);
  opacity: 0;
}
</style>

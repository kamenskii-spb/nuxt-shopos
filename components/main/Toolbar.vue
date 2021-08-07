<template>
    <div>
        <v-row no-gutters style="background: #fff">

            <v-col cols="col-12" md="12">
                <v-app-bar elevation-0 clipped-right color="#fff" dense>
                    <div
                            @click.stop="drawerHandler()"
                            class="d-flex d-sm-none d-none d-sm-flex d-md-none"
                    >
                        <v-toolbar-title style="cursor: pointer" class="mr-3"
                        >
                            <v-app-bar-nav-icon></v-app-bar-nav-icon>
                            Каталог
                        </v-toolbar-title
                        >
                    </div>
                    <v-toolbar-title class="phone d-none d-sm-flex d-sm-none d-md-flex"
                    >+7 (812)454-60-75
                    </v-toolbar-title
                    >
                    <v-spacer></v-spacer>
                    <v-toolbar-items   v-if="pages.length <= 2">
                        <v-toolbar-title
                                class="top-links d-none d-sm-flex"
                                style="margin-top:5px"
                        >

                            <nuxt-link
                                    v-for="(page, n) in pages"
                                    :key="n"
                                    :to="`/page/${page.url}`"
                                    no-prefetch>
                                <v-btn text>{{page.title}}</v-btn>
                            </nuxt-link>

                        </v-toolbar-title>
                    </v-toolbar-items>


                        <v-menu offset-y v-else>
                            <template v-slot:activator="{ on }">
                                <v-btn v-on="on" text
                                       class="top-links d-none d-sm-flex"
                                       style="margin-top:5px">
                                    Информация
                                </v-btn>
                            </template>
                            <v-list>
                                <v-list-item v-for="(page, n) in pages"
                                             :key="n">
                                    <nuxt-link :to="`/page/${page.url}`" no-prefetch>
                                        {{page.title}}
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
                            <v-list-item v-for="(page, n) in pages"
                                         :key="n">
                                <nuxt-link :to="`/page/${page.url}`" no-prefetch>
                                    {{page.title}}
                                </nuxt-link>
                            </v-list-item>
                        </v-list>
                    </v-menu>

                </v-app-bar>

                <v-layout row wrap no-gutters>
                    <v-flex xs12 sm5>
                        <div class="search" style=" margin-left:0px">
                            <autocomplete
                                    aria-label="Поиск по товарам"
                                    placeholder="Поиск по товарам"
                                    :search="search"
                                    :get-result-value="getResultValue"
                            >
                                <template v-slot:result="{ result, props }">
                                    <nuxt-link
                                            no-prefetch
                                            v-if="result.name !== 'Ничего не найдено'"
                                            :to="`/product/${result.seoUrl}`"
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
                                    </nuxt-link>
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
                    </v-flex>

                    <v-flex xs12 sm7>
                        <v-app-bar
                                :flat="true"
                                clipped-right
                                color="#fff"
                                dense
                                class="app-bar"
                        >
                            <!-- <v-spacer></v-spacer> -->
                            <v-toolbar-items class="top-links">
                                <!-- <nuxt-link to="/about">
                              <v-btn text>Вход | Регистрация</v-btn>
                            </nuxt-link>-->

                                <v-btn @click.prevent="loginDialog = true" v-if="!user._id" text
                                ><!--noindex-->Вход | Регистрация<!--/noindex--></v-btn
                                >

                                <v-btn @click.prevent="goToAcc" v-if="user._id" text
                                ><!--noindex-->
                                    Личный кабинет<!--/noindex-->
                                </v-btn>


                                <v-btn @click.prevent.stop="cartChangeDialog = !cartChangeDialog"
                                       text
                                ><!--noindex-->
                                    <span v-if="typeCart === 'retail'" >Купить оптом</span>
                                    <span v-else >Купить в розницу</span>
                                    <!--/noindex-->
                                </v-btn>


                            </v-toolbar-items>
                            <v-spacer></v-spacer>

                            <nuxt-link to="/order" class="cart-wrap" no-prefetch>
                                <v-icon class="top-cart">mdi-cart</v-icon>
                                <div class="cart-total-price">
              <span class="cart-items" v-if="cart.length == 1">
                <!--noindex-->
                1 товар
                  <!--/noindex-->
              </span>
                                    <span class="cart-items" v-else>
                <!--noindex-->
                {{ cart.length }} товаров
                                        <!--/noindex-->
              </span>
                                    <!--noindex-->
                                    <span class="cart-price"> &nbsp;{{ totalPrice | currency }} </span
                                    ><!--/noindex-->
                                </div>
                            </nuxt-link>
                        </v-app-bar>
                    </v-flex>
                </v-layout>
            </v-col>

        </v-row>


        <v-dialog v-model="loginDialog" max-width="400">
            <v-card class="pa-5 mx-lg-auto">
                <v-form v-model="valid" ref="form" validation>
                    <v-text-field
                            name="email"
                            label="Email"
                            type="email"
                            v-model="email"
                            :rules="emailRules"
                    ></v-text-field>

                    <v-text-field
                            v-model="password"
                            :append-icon="show1 ? 'visibility' : 'visibility_off'"
                            :type="show1 ? 'text' : 'password'"
                            name="input-10-1"
                            label="Пароль"
                            @click:append="show1 = !show1"
                    ></v-text-field>

                    <v-flex xs12 class="d-flex justify-center mb2">
                        <v-alert v-if="loginError" type="error">
                            {{ loginError }}
                        </v-alert>
                    </v-flex>

                    <v-flex xs12 class="d-flex justify-center mb2">
                        <v-btn
                                depressed
                                @click.prevent="onSubmit"
                                :disabled="!valid"
                                color="primary"
                        >Войти
                        </v-btn
                        >
                    </v-flex>
                    <v-flex xs12 class="d-flex justify-center mb1">
                        <v-btn text @click.prevent.stop="toRegistr()" small color="primary"
                        >Зарегистрироваться
                        </v-btn
                        >
                    </v-flex>
                    <v-flex xs12 class="d-flex justify-center mb1">
                        <v-btn
                                text
                                @click.prevent="toRememberPassword()"
                                small
                                color="#909090"
                        >Забыли пароль
                        </v-btn
                        >
                    </v-flex>
                </v-form>
            </v-card>
        </v-dialog>


        <v-dialog
                v-model="cartChangeDialog"
                max-width="330"
        >
            <v-card>
                <v-card-title v-if="typeCart === 'retail'"
                > Перейти в режим "оптовые покупки"? <br/>
                    Минимальная сумма оптового заказа 5000 р.
                </v-card-title>
                <v-card-title v-else
                >Перейти в режим "розничные покупки"?
                </v-card-title>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn style="padding: 35px"
                           color=" darken-3"
                           text
                           @click.prevent.stop="cartChangeDialog = false"
                    >
                        Отмена
                    </v-btn>
                    <v-btn style="padding: 35px"
                           color="green darken-1"
                           text
                           @click.prevent.stop="changeCartHandler"
                    >
                        Перейти
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    import Autocomplete from "@trevoreyre/autocomplete-vue";
    import "@trevoreyre/autocomplete-vue/dist/style.css";

    export default {
        data() {
            return {
                valid: false,
                typeCart: true,
                loginDialog: false,
                cartChangeDialog: false,
                cart: [],
                drawer: false,
                totalPrice: null,
                searchResolve: [],
                show1: false,
                email: "",
                password: "",
                user: {},
                emailRules: [
                    (v) => !!v || "Введите E-mail ",
                    (v) => emailRegex.test(v) || "E-mail не корректный",
                ],
                loginError: null,
            };
        },
        components: {
            Autocomplete,
        },
        computed: {
            pages() {
                return this.$store.getters["page/pages"]
            }
        },
        async mounted() {
            this.cart = await this.$store.getters["cart/cart"];
            this.typeCart = await this.$store.getters["cart/typeCart"];
            this.totalPrice = await this.$store.getters["cart/totalPrice"];
            this.user = await this.$store.getters["auth/user"];

            this.$store.watch(
                (state, getters) => getters["cart/totalPrice"],
                (newValue, oldValue) => {
                    this.totalPrice = newValue;
                }
            );

            this.$store.watch(
                (state, getters) => getters["cart/cart"],
                (newValue, oldValue) => {
                    if (newValue) this.cart = newValue;
                }
            );

            this.$store.watch(
                (state, getters) => getters["auth/user"],
                (newValue, oldValue) => {
                    this.user = newValue;
                }
            );
        },
        methods: {
            drawerHandler() {
                this.$emit("drawerChanged", !this.drawer);
            },
            async search(input) {
                const res = encodeURI(input);
                if (input.length >= 3) {
                    const responce = await this.$store.dispatch("cart/search", res);
                    console.log(responce)
                    return responce.length > 0
                        ? responce
                        : [{name: "Ничего не найдено", seoUrl: "/"}];
                } else {
                    return [];
                }
            },

            getResultValue(result) {
                return result.title;
            },

            handleSubmit(result) {
                window.open(`${wikiUrl}/wiki/${encodeURI(result.title)}`);
            },
            async onSubmit() {
                if (this.$refs.form.validate()) {
                    const formData = {
                        login: this.email,
                        password: this.password,
                    };

                    this.loginError = "";
                    await this.$store
                        .dispatch("admin/auth/login", formData)
                        .then((mess) => {
                            if (mess) {
                                this.loginError = mess;
                            } else {
                                this.loginDialog = false;
                                this.$router.push("/account");
                            }
                        })
                        .catch((e) => {
                            console.log(e);
                        });
                }
            },
            toRegistr() {
                this.loginDialog = false;
                this.$router.push("/register");
            },
            goToAcc() {
                this.$router.push("/account");
            },
            toRememberPassword() {
                this.loginDialog = false;
                this.$router.push("/account/remember");
            },
            changeCartHandler() {

                this.cartChangeDialog = false

                this.$store.dispatch("cart/changeCartType")
                this.typeCart = this.$store.getters["cart/typeCart"]


            }
        },
    };
</script>

<style lang="scss" scoped>
@import "@/theme/_variables";

    .top-links a {
        text-decoration: none;
    }

    .top-cart {
        font-size: 30px;
        margin: 0 5px 0 0px;
        color: $main-color;
        cursor: pointer;
    }

    .cart-items {
        color: $main-color;
        text-decoration: underline;
        cursor: pointer;
        font-size: 11px;
    }

    .cart-price {
        text-decoration: none;
        color: $main-color;
        font-size: 11px;
    }

    .phone {
        color: $main-color;
    }

    .cart-wrap {
        display: flex !important;
        text-decoration: none;
    }

    .app-bar {
        border-bottom: 1px solid #e5e5e5 !important;
        border-top: 1px solid #e5e5e5 !important;
    }

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

    .v-dialog > .v-card > .v-card__title {
        font-size: 0.8rem;
        padding: 15px;
    }

</style>

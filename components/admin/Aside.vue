<template>
    <v-list shaped class="aside">
        <v-list-item-group color="primary">
            <div  v-for="item in items"
                  :key="item.title">
        <v-list-group
                v-model="item.active"
                :prepend-icon="item.action"
                v-if="item.items.length"
                no-action
        >
            <template v-slot:activator>
                <v-list-item-content>
                    <v-list-item-title v-text="item.title" />
                </v-list-item-content>
            </template>
            <div v-for="subItem in item.items" :key="subItem.href">
                <nuxt-link :to="subItem.href" no-prefetch>
                    <v-list-item :key="subItem.title" class="mx-3">
                        <v-list-item-content>
                            <v-list-item-title v-text="subItem.title" />
                        </v-list-item-content>
                    </v-list-item>
                </nuxt-link>
            </div>
        </v-list-group>
        <nuxt-link v-else :to="item.href" no-prefetch>
            <v-list-item>
                <v-list-item-title v-text="item.title" />
            </v-list-item>
        </nuxt-link>
            </div>
        </v-list-item-group>
    </v-list>
</template>


<script>
    export default {
        data() {
            return {
                items: [
                    {
                        title: "Заказы",
                        href: "/admin/",
                        items: []
                    },
                    {
                        title: "Категории",
                        items: [
                            {title: "Список категорий", href: "/admin/category/list"},
                            {title: "Добавить категорию", href: "/admin/category/create"}
                        ]
                    },
                    {
                        title: "Товары",
                        items: [
                            {
                                title: "Список товаров",
                                href: "/admin/product/list"
                            },
                            {
                                title: "Добавить товар",
                                href: "/admin/product/create"
                            }
                        ]
                    },
                    {
                        title: "Пользователи",
                        href: "/admin/user/list",
                        items: []
                    },
                    {
                        title: "Настройки",
                        href: "/admin/system/setting",
                        items: []
                    },
                    {
                        title: "Шаблоны описаний",
                        href: "/admin/description/list",
                        items: []
                    },
                    {
                        title: "Страницы",
                        href: "/admin/page/list",
                        items: []
                    },
                    {
                        title: "Изображения",
                        href: "/admin/modules/image",
                        items: []
                    },
                       {
                        title: "Cart Keeper",
                        href: "/admin/modules/cartkeeper",
                        items: []
                    },
                    {
                        title: "VKМаркет",
                        href: "/admin/vkmarket",
                        items: []
                    },
                ],
            };
        }
    };
</script>

<style scoped lang="scss">
    .aside{
        width: 100%;
        a {
            text-decoration: none;
        }

    }
</style>
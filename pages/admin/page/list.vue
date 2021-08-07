<template>
    <div>
        <nuxt-link to='/admin/page/create'>
            <div class="my-2 pa-4">
                <v-btn small color="primary">Создать страницу</v-btn>
            </div>
        </nuxt-link>
        <h4>Страницы</h4>

        <div v-if="pages.length">
            <v-simple-table>
                <template v-slot:default>
                    <thead>
                    <tr>
                        <th class="text-left">Название</th>
                        <th class="text-left">SeoUrl</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr class="pages" v-for="page in pages" :key="page._id" @click.prevent="goEdit(page.url)">
                        <td>{{ page.title }}</td>
                        <td>{{ page.url }}</td>
                    </tr>
                    </tbody>
                </template>
            </v-simple-table>

        </div>
        <div v-else>
            <p>Нет доступных страниц</p>
        </div>
    </div>
</template>

<script>
    export default {
        layout: 'admin',
        middleware: ['admin-auth'],
        data() {
            return {
                loading: false,
                pages: []
            };
        },
        async asyncData({$axios}) {
            const pages = await $axios.$get(`/api/page/admin/`) || []
            return {pages}
        },
        methods: {
            goEdit(url) {
                this.$router.push(`/admin/page/${url}`);
            }
        },

    }
</script>

<style scoped>
    .pages p {
        padding: 5px;
    }

    .pages:hover {
        cursor: pointer;
    }
</style>
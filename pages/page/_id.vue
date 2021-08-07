<template>
    <div>
        <div v-html="html"/>
        <iframe v-if="title === 'Контакты'"
                src="https://yandex.ru/map-widget/v1/?um=constructor%3A34a14e59f93307a3250a7bda3025cf7fdb2cb51b6c925845ae5951762a5d343c&amp;source=constructor"
                width="100%" height="350" frameborder="0"></iframe>
    </div>
</template>

<script>
    export default {
        head() {
            return {
                title: `${
                    this.metaTitle
                }`,
                meta: [
                    {
                        hid: `category-d-${this.id}`,
                        name: "description",
                        content: this.metaDescription,
                    },
                    {
                        hid: `category-k-${this.id}`,
                        name: "keywords",
                        content: this.metaKeywords,
                    },
                ],
            };
        },
        async asyncData({params, $axios}) {
            const page = await $axios.$get(`/api/page/admin/${params.id}`)
            const title = page.title
            const html = page.html
            const metaTitle = page.metaTitle
            const metaDescription = page.metaDescription
            const metaKeywords = page.metaKeywords
            return {title, html, metaTitle, metaDescription, metaKeywords}
        },
    }
</script>

<style scoped>

</style>
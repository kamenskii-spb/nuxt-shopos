<template>
    <div :style="{...logoStyle}">
        <nuxt-link :to="`/`" no-prefetch>
            <v-img class="logo" width="100%" src="/l121020.jpg" alt="Бестгифт"></v-img>
        </nuxt-link>
    </div>
</template>

<script>
    export default {
        props: ["logoStyle"]
    }
</script>

<style scoped>
    .logo {
        display: block;
        margin: 0 auto;
    }
</style>
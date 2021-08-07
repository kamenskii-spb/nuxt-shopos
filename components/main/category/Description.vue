<template>
  <v-card
    class="mb-3 d-none d-sm-flex d-sm-none d-md-flex pa-3"
    outlined
    v-if="description"
  >
    <div class="description-category ">
      <div v-html="description"></div>
    </div>
  </v-card>
</template>

<script>
export default {
  props: ["description"],
};
</script>

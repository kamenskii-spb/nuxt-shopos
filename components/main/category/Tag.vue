<template>
  <div v-if="tagsList.length > 1">
    <v-chip
      v-for="(tag, n) in tagsList"
      :key="n"
      @click="tagFilter(tag)"
      :class="{
         'my-3': true,
         'mr-2': true,
      }"
      :disabled="loading || (tag === 'Всё' && activTags.includes('Всё'))"
      :color="activTags.indexOf(tag) !== -1 ? 'primary' : ''"
      >{{ tag }}
    </v-chip>
  </div>
</template>

<script>
export default {
  props: ["tagsList", "loading", "activTags"],
  methods: {
    tagFilter(tag) {
      this.$emit("tagFilter", tag);
    },
  },
};
</script>



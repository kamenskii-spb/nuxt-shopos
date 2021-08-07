<template>
  <div>
      <nuxt-link to='/admin/description/create'>
      <div class="my-2 pa-4">
        <v-btn small color="primary">Создать шаблон</v-btn>
      </div>
      </nuxt-link>
<!--  <div class="description"  v-for="description in descriptions"-->
<!--      :key="description._id">-->
<!--    <p class="text-left"            -->
<!--      @click.prevent="goEdit(description._id)"-->
<!--      style="cursor: pointer;" -->
<!--      v-if="description.title !== 'Без шаблона'"-->
<!--      >-->
<!--      {{description.title}}-->
<!--    </p>-->
<!--    </div>-->
      <div v-if="descriptions.length">
          <v-simple-table>
              <template v-slot:default>
                  <thead>
                  <tr>
                      <th class="text-left">Название</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr class="description" v-for="description in descriptions" :key="description._id" @click.prevent="goEdit(description._id)">
                      <td>{{ description.title }}</td>
                  </tr>
                  </tbody>
              </template>
          </v-simple-table>

      </div>
      <div v-else>
          <p>Нет доступных шаблонов</p>
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
      descriptions: []
    };
  },
   async asyncData({store}) {

   const descriptions = await store.dispatch("admin/description/getAll")
       return { descriptions };
  },
  methods: {
    goEdit(id){
 
      this.$router.push(`/admin/description/${id}`);
    }
 },
  
}
</script>

<style  scoped>


.description:hover{
  cursor: pointer;
}
</style>
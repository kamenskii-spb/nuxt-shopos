<template>
  <div>
    <v-container fluid>
      <h1 class="mb-9">Изображения</h1>
      <v-layout row>
        <div class="handler-list">
        
           <v-btn
              color="accent"
              x-large
              @click="load"
              :loading="loading"
            >
              Скачать изображения
            </v-btn>
                <v-btn
              color="accent"
              x-large
              @click="clear"
              :loading="cacheLoading"
            >
              Очистить кеш
            </v-btn>
          <!-- <div @click="clear">Очистить кеш</div> -->
        
        </div>
   
       
     
      </v-layout>
    </v-container>
  </div>
</template>

<script>
export default {
  layout: "admin",
  middleware: ["admin-auth"],
  data(){
    return{
      loading: false,
      cacheLoading: false
    }
  },
  methods: {
      forceFileDownload(response){
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'images.zip') //or any other extension
      document.body.appendChild(link)
      link.click()
       this.loading = false
    },
     async load() {
      this.loading = true
     await this.$axios.post('/api/module/admin/loader').then(() =>{
       this.$axios({
        method: 'get',
        url: '/cache/images.zip',
        responseType: 'arraybuffer'
      })
      .then(response => {
        this.forceFileDownload(response)
      })
      .catch(() => {this.loading = false})
     })

      },
     async clear(){
         this.cacheLoading = true
         await this.$axios.delete('/api/module/admin/clear-cache')
         this.cacheLoading = false
      }
  }
};
</script>

<style lang="scss" scoped>
.handler-list{
    display: flex;
    flex-direction: column;
}
button{
  margin: 20px;
}


</style>

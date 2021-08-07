<template>
  <div>
 
        <v-flex xs12 >
          <v-carousel
            hide-delimiters
            cycle
            show-arrows-on-hover
            height="275px"
          >
                
              <v-carousel-item >
         <nuxt-link to="/category/tvorchestvo" no-prefetch>
           <img src="/b4.jpg" alt="Картины по номерам " width="100%" />
            </nuxt-link>
            </v-carousel-item>

               <!-- <v-carousel-item >
           <nuxt-link to="/category/novogodnie-skaterti" no-prefetch>
           <img src="/skatert.jpg" alt="Новогодние скатерти" width="100%"> 
            </nuxt-link>
            </v-carousel-item> -->


              
            <!-- <v-carousel-item >
              <nuxt-link to="/category/kartini-raskraski--po-nomeram" no-prefetch>
            <v-img height="280" src="/b3.png" aspect-ratio="1" contain
           alt="картины по номерам">
            </v-img>
             </nuxt-link>
            </v-carousel-item>
             -->
         

          <v-carousel-item >
           <nuxt-link to="/category/golovolomki" no-prefetch>
            <v-img height="250" src="/3b.jpg" aspect-ratio="1" contain
            alt="Головоломки">
            </v-img>
            </nuxt-link>
            </v-carousel-item>
          </v-carousel>
        </v-flex>
     

  </div>

</template>




<script>
export default {
  data() {
    return {
      items: [
        {
          src: "/superprice2.png"
        },
        {
          src: "/ht.jpg"
        }
      ]
    };
  }
};
</script>

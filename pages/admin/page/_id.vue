<template>
    <div>
        <client-only>
            <v-container grid-list-md fluid>
                <v-layout row>
                    <v-card-title class="headline mb">{{title}}</v-card-title>
                    <v-spacer></v-spacer>
                    <v-btn
                            :loading="loading"
                            color="blue"
                            class="mt1"
                            @click="update"
                            style="margin-right:10px; color: #fff"
                    >Сохранить
                    </v-btn>
                    <v-btn
                            :loading="loading"
                            color="red"
                            class="mt1"
                            @click="remove"
                            style="margin-right:10px; color: #fff"
                    >Удалить
                    </v-btn>
                </v-layout>

                <v-card>
                    <v-card text>
                        <v-card-text>
                            <v-layout row>
                                <v-flex xs12>
                                    <v-form ref="form" validation class="mb">
                                        <v-text-field
                                                class="mb"
                                                title="title"
                                                label="Название*"
                                                type="text"
                                                v-model="title"
                                                required
                                                :rules="[v => !!v || 'Введите название']"
                                                outlined
                                        ></v-text-field>
                                        <v-text-field
                                                class="mb"
                                                name="metaTitle"
                                                label="Мета-тег Title*"
                                                type="text"
                                                v-model="metaTitle"
                                                required
                                                outlined
                                                :rules="[v => !!v || 'Введите мета-тег Title']"
                                        ></v-text-field>
                                        <v-textarea
                                                class="mb"
                                                filled
                                                name="metaDescription"
                                                label="Мета-тег Description"
                                                v-model="metaDescription"
                                                outlined
                                        ></v-textarea>

                                        <v-textarea
                                                class="mb"
                                                filled
                                                name="Мета-тег Keywords"
                                                label="Мета-тег Keywords"
                                                v-model="metaKeywords"
                                                outlined
                                        ></v-textarea>
                                        <v-text-field
                                                style="width:170px"
                                                class="mb"
                                                name="sortOrder"
                                                label="Порядок сортировки"
                                                type="number"
                                                v-model="sortOrder"
                                                value="0"
                                                outlined
                                        ></v-text-field>
                                        <div class="mb">
                                            <ckeditor v-model="editorData" ></ckeditor>
                                        </div>
                                    </v-form>
                                </v-flex>
                            </v-layout>
                        </v-card-text>
                    </v-card>
                </v-card>
            </v-container>
        </client-only>
    </div>
</template>

<script>


    export default {
        layout: "admin",
        middleware: ["admin-auth"],
        data() {
            return {
                id: '',
                loading: false,
                title: "",
                html: "",
                sortOrder: 0,
                editorData: '',
                metaTitle: '',
                metaDescription: '',
                metaKeywords: ''
            }
        },async asyncData({params, $axios}) {
            const page = await $axios.$get(`/api/page/admin/${params.id}`)
            const id = page._id
            const title = page.title
            const editorData = page.html
            const sortOrder = page.sortOrder
            const metaTitle = page.metaTitle
            const metaDescription = page.metaDescription
            const metaKeywords = page.metaKeywords
             return {title,editorData,sortOrder, id, metaTitle,metaDescription,metaKeywords}
        },
        async mounted() {

            // console.log(this.page)
            // const page = await this.$axios.get(`/api/page/admin/${this.params.id}`)
            //
            //
            // console.log(page)
            // this.title = this.data.title
            // this.editorData = this.data.html
            // this.id = this.data._id
        },
        methods: {
            async  update(){
                if (this.$refs.form.validate()) {
                    this.loading = true
                    const data = {
                        id: this.id,
                        title: this.title,
                        html: this.editorData,
                        sortOrder: +this.sortOrder || 0,
                        metaTitle: this.metaTitle,
                        metaDescription: this.metaDescription,
                        metaKeywords: this.metaKeywords
                    }

                    await this.$axios.$put(`/api/page/admin/update/`, data).then(() => {
                        this.$router.push("/admin/page/list")
                    })

                    this.loading = false
                }
            },
            async remove(){
                this.loading = true
               await this.$axios.$delete(`/api/page/admin/${this.id}`).then(() => {
                    this.$router.push("/admin/page/list")
                })
                this.loading = false
            },
        }
    };
</script>


<style  scoped>


</style>


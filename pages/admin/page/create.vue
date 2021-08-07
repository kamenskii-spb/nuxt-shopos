<template>
    <div>
        <client-only>
            <v-container grid-list-md fluid>
                <v-layout row>
                    <v-card-title class="headline mb">Новая Страница</v-card-title>
                    <v-spacer></v-spacer>
                    <v-btn
                            :loading="loading"
                            class="success mt1"
                            @click="create"
                            style="margin-right:10px"
                    >Создать
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
        layout: 'admin',
        middleware: ['admin-auth'],
        data() {
            return {
                loading: false,
                title: "",
                html: "",
                sortOrder: 0,
                editorData: '',
                metaTitle: '',
                metaDescription: '',
                metaKeywords: ''
            };
        },
        methods: {
            async create() {
                if (this.$refs.form.validate()) {
                    this.loading = true
                    const data = {
                        title: this.title,
                        html: this.editorData,
                        sortOrder: +this.sortOrder || 0,
                        metaTitle: this.metaTitle,
                        metaDescription: this.metaDescription,
                        metaKeywords: this.metaKeywords
                    }
                    await this.$axios.$post(`/api/page/admin/create`, data).then(() => {
                        this.$router.push("/admin/page/list")
                    })

                    this.loading = false
                }
            },
        }
    }

</script>
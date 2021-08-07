<template>
    <div>
        <client-only>
            <v-container grid-list-md fluid>
                <v-layout row>
                    <v-card-title class="headline mb">Новый шаблон</v-card-title>
                    <v-spacer></v-spacer>
                    <v-btn
                            :loading="loading"
                            class="success mt1"
                            @click="create"
                            style="margin-right:10px"
                    >Добавить
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
                dialog: false,
                loading: false,
                title: "",
                description: "",
                editorData: ''
            };
        },
        methods: {
            async create() {
                if (this.$refs.form.validate()) {
                    this.loading = true
                    const data = {
                        title: this.title,
                        html: this.editorData
                    }

                    await this.$axios.$post(`/api/description/admin/create`, data).then(() => {
                        this.$router.push("/admin/description/list")
                    })

                    this.loading = false
                }
            },
        }
    }

</script>
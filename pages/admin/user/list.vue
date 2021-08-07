<template>
  <div id="top">
    <v-simple-table v-if="users.length > 0" id="top">
      <thead>
        <tr>
          <th class="text-left">Имя Фамилия</th>
          <th class="text-left">Почта</th>
          <th class="text-left">Дата реристрации</th>
        </tr>
      </thead>
      <tbody>
        <tr
          style="cursor: pointer"
          @click="openUserInfo(user)"
          v-for="(user, index) in users"
          :key="index"
        >
          <td>{{user.name}} {{user.lastName}}</td>
          <td>{{user.email}}</td>
          <td>{{user.date | date('date')}}</td>
        </tr>
      </tbody>
    </v-simple-table>

    <div class="text-center pagination-t" v-if="paginationLength > 1">
      <v-pagination
        v-model="page"
        :length="paginationLength"
        prev-icon="mdi-menu-left"
        next-icon="mdi-menu-right"
      ></v-pagination>
    </div>
  </div>
</template>

<script>
export default {
  layout: "admin",
  middleware: ["admin-auth"],
  data() {
    return {
      users: [],
      paginationLength: 0,
      page: 1,
      limit: 24
    };
  },
  async asyncData({ store, params, route }) {
    const query = {
      getParams: route.query
    };
    const users = await store.dispatch("admin/user/fetch", query);
    const usersCount = await store.dispatch("admin/user/fetchCount");
    return {
      usersCount,
      users
    };
  },
  mounted() {
    this.paginationLength = Math.ceil(this.usersCount / this.limit);
  },
  methods: {
    openUserInfo(user) {
      this.$router.push(`/admin/user/${user._id}`);
    }
  },
  watch: {
    "$route.params": async function() {
      const query = {
        getParams: this.$route.query
      };
      this.users = await this.$store.dispatch("admin/user/fetch", query);

      this.paginationLength = Math.ceil(this.usersCount / this.limit);
      this.$vuetify.goTo("#top");
    },
    page: async function() {
      const start = this.limit * this.page - this.limit;

      this.$router.push(`/admin/user/list?start=${start}`);
    }
  }
};
</script>
<template>
  <v-app dark>
    <v-navigation-drawer
      v-if="this.isUserLoggedIn"
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app>
      <v-list>
        <v-list-item
            @click.stop="miniVariant = !miniVariant"
            class="v-list-item--link">
          <v-list-item-action>
            <v-icon>mdi-{{ `chevron-${miniVariant ? 'right' : 'left'}` }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="'SSPUD'" />
          </v-list-item-content>
        </v-list-item>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact>
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-main>
      <v-container fluid>
        <Nuxt />
      </v-container>
    </v-main>
    <v-footer
      :absolute="!fixed"
      app>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: 'DefaultLayout',
  data () {
    return {
      clipped: false,
      drawer: true,
      fixed: false,
      items: [
        {
          icon: 'mdi-apps',
          title: 'Welcome',
          to: '/'
        },
        {
          icon: 'mdi-chart-bubble',
          title: 'Inspire',
          to: '/inspire'
        },
        {
          icon: 'mdi-chart-bubble',
          title: 'Manage Categories',
          to: '/categories/manage'
        },
        {
          icon: 'mdi-chart-bubble',
          title: 'Link Categories',
          to: '/categories/link'
        },
        {
          icon: 'mdi-chart-bubble',
          title: 'Manage Brands',
          to: '/brands/manage'
        },
        {
          icon: 'mdi-chart-bubble',
          title: 'Link Brands',
          to: '/brands/link'
        },
        {
          icon: 'mdi-chart-bubble',
          title: 'Scraped Products',
          to: '/products/scraped/list'
        },
        {
          icon: 'mdi-chart-bubble',
          title: 'Staged Products',
          to: '/products/staged/list'
        },
        {
          icon: 'mdi-chart-bubble',
          title: 'Published Products',
          to: '/products/published/list'
        },
        {
          icon: 'mdi-chart-bubble',
          title: 'Published Products',
          to: '/products/deleted/list'
        },
        {
          icon: 'mdi-chart-bubble',
          title: 'Users',
          to: '/users/manage'
        },
      ],
      miniVariant: true,
      right: true,
      rightDrawer: false,
      title: 'Vuetify.js'
    }
  },
  beforeMount() {
    this.$nextTick(async function () {

    })
  },
  computed: {
    isUserLoggedIn() {
      // return this.$store.state.auth.user != null;
      return true;
    },
    userEmail() {
      if (this.$store.state.auth.user) {
        return this.$store.state.auth.user.email
      }
      return 'Not logged in'
    },
  },
}
</script>

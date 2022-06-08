<template>
  <v-app dark>
    <v-navigation-drawer
      v-if="this.isUserLoggedIn"
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
    >
      <v-list>
        <v-list-item
          @click.stop="miniVariant = !miniVariant"
          class="v-list-item--link"
        >
          <v-list-item-action>
            <v-icon
              >mdi-{{ `chevron-${miniVariant ? "right" : "left"}` }}</v-icon
            >
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
          exact
        >
          <v-list-item-action>
            <v-icon :color="item.colour ? item.colour : 'blue'">{{
              item.icon
            }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <template v-slot:append>
        <v-list>
          <v-list-item
              :to="'/analytics/processLogs'"
              router
              exact
              class="v-list-item--link">
            <v-list-item-action>
              <v-icon :color="'orange'" >mdi-sine-wave</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title v-text="'Process Logs'" />
            </v-list-item-content>
          </v-list-item>
          <v-list-item
              class="v-list-item--link">
            <v-list-item-action>
              <v-icon :color="'yellow'" >mdi-alert</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title v-text="userEmail" />
            </v-list-item-content>
          </v-list-item>
          <v-list-item
              v-on:click="signOut()"
              class="v-list-item--link">
            <v-list-item-action>
              <v-icon :color="'yellow'" >mdi-alert</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title v-text="'Sign out'" />
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </template>
    </v-navigation-drawer>
    <v-main style="background-color: #FAFBFC !important;">
      <v-container fluid style="padding: 0px">
        <Nuxt />
      </v-container>
    </v-main>
    <v-footer
        v-if="this.isUserLoggedIn"
      :absolute="!fixed"
      app>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: "DefaultLayout",
  data() {
    return {
      clipped: false,
      drawer: true,
      fixed: false,
      items: [
        {
          icon: "mdi-shape",
          title: "Manage Categories",
          to: "/categories/manage",
          colour: "purple",
        },
        {
          icon: "mdi-shape",
          title: "Link Categories",
          to: "/categories/link",
          colour: "purple",
        },
        {
          icon: "mdi-watermark",
          title: "Manage Brands",
          to: "/brands/manage",
          colour: "green",
        },
        {
          icon: "mdi-watermark",
          title: "Link Brands",
          to: "/brands/link",
          colour: "green",
        },
        {
          icon: "mdi-cart-variant",
          title: "Scraped Products",
          to: "/products/scraped/list",
          colour: "red",
        },
        {
          icon: "mdi-cart-variant",
          title: "Staged Products",
          to: "/products/staged/list",
          colour: "red",
        },
        {
          icon: "mdi-cart-variant",
          title: "Published Products",
          to: "/products/published/list",
          colour: "red",
        },
        {
          icon: "mdi-cart-variant",
          title: "Deleted Products",
          to: "/products/deleted/list",
          colour: "red",
        },
        {
          icon: "mdi-train-car",
          title: "Transport Rates",
          to: "/transportRates/mainTransportRates",
          colour: "blue",
        },
        {
          icon: "mdi-account-group",
          title: "Users",
          to: "/users/manage",
          colour: "blue",
        },
      ],
      miniVariant: true,
      right: true,
      rightDrawer: false,
      title: "Vuetify.js",
    };
  },
  beforeMount() {
    this.$nextTick(async function () {});
  },
  computed: {
    isUserLoggedIn() {
      return this.$store.state.auth.user != null;
      // return true;
    },
    userEmail() {
      if (this.$store.state.auth.user) {
        return this.$store.state.auth.user.email;
      }
      return "Not logged in";
    },
  },

  methods: {
    signOut() {
      this.loading = true
      this.$store.dispatch('reset')
      this.$router.push('/login')
      this.loading = false
    },
  },
  created() {
    this.$root.$refs.default = this
  }
}

</script>

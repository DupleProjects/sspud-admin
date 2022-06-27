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
            >mdi-{{ `chevron-${miniVariant ? "right" : "left"}` }}
            </v-icon
            >
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="'SSPUD'"/>
          </v-list-item-content>
        </v-list-item>

        <!-- Navigation List -->
        <v-list-group
            v-for="item in items"
            :key="item.title"
            v-model="item.active"
            :color="item.colour ? item.colour : 'blue'"
            :prepend-icon="item.action"
            no-action
            v-if="item.items"
        >
          <template v-slot:activator>
            <v-list-item-action style="margin-right:12px">
              <v-icon @click.stop="miniVariant = false" :color="item.colour ? item.colour : 'blue'">{{
                  item.icon
                }}
              </v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title v-text="item.title"></v-list-item-title>
            </v-list-item-content>
          </template>

          <v-list-item
              v-for="child in item.items"
              :key="child.title"
              link
              :to="child.to"
              style="padding-left:45px;" >
              <v-list-item-action style="margin-right:12px" >
              <v-icon :color="child.colour ? child.colour : 'blue'">{{
                  child.icon
                }}
              </v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title v-text="child.title"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>
        <v-list-item
            v-for="(item, i) in items"
            :key="i"
            :to="item.to"
            router
            exact
            v-if="!item.items"
            
        >
          <v-list-item-action>
            <v-icon :color="item.colour ? item.colour : 'blue'">{{
                item.icon
              }}
            </v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title"/>
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
              <v-icon :color="'orange'">mdi-sine-wave</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title v-text="'Process Logs'"/>
            </v-list-item-content>
          </v-list-item>
          <v-list-item
              class="v-list-item--link">
            <v-list-item-action>
              <v-icon :color="'yellow'">mdi-alert</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title v-text="userEmail"/>
            </v-list-item-content>
          </v-list-item>
          <v-list-item
              v-on:click="signOut()"
              class="v-list-item--link">
            <v-list-item-action>
              <v-icon :color="'yellow'">mdi-alert</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title v-text="'Sign out'"/>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </template>
    </v-navigation-drawer>
    <v-main style="background-color: #FAFBFE !important;">
      <v-container fluid style="padding: 0px">
        <Nuxt/>
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
          title: 'Categories',
          icon: "mdi-shape",
          colour: "purple",
          items: [
            {
              icon: "mdi-shape",
              title: "Manage Categories",
              to: "/categories/manage",
              colour: "purple",
            },
            {
              icon: "mdi-link-variant",
              title: "Link Categories",
              to: "/categories/link",
              colour: "purple",
            },
          ]
        },
        {
          title: 'Brands',
          icon: "mdi-watermark",
          colour: "green",
          items: [
            {
              icon: "mdi-watermark",
              title: "Manage Brands",
              to: "/brands/manage",
              colour: "green",
            },
            {
              icon: "mdi-link-variant",
              title: "Link Brands",
              to: "/brands/link",
              colour: "green",
            },
          ]
        },
        {
          title: 'Products',
          icon: "mdi-cart-variant",
          colour: "red",
          items: [
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
              icon: "mdi-publish",
              title: "Published Products",
              to: "/products/published/list",
              colour: "red",
            },
            {
              icon: "mdi-trash-can",
              title: "Deleted Products",
              to: "/products/deleted/list",
              colour: "red",
            },
          ]
        },
        {
          title: 'Orders',
          icon: "mdi-dropbox",
          items: [
            {
              icon: "mdi-dropbox",
              title: "Orders",
              to: "/orders/list",
              colour: "blue",
            }
          ]
        },
        {
          title: 'Settings',
          icon: "mdi-cog",
          colour: "blue",
          items: [
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
            {
              icon: "mdi-cog",
              title: "Process Variables",
              to: "/setup/processVariables",
              colour: "blue",
            },
            {
              icon: "mdi-store",
              title: "Shops",
              to: "/shops/manage",
              colour: "blue",
            },
          ]
        },
      ],
      miniVariant: true,
      right: true,
      rightDrawer: false,
      title: "Vuetify.js",
    };
  },
  beforeMount() {
    this.$nextTick(async function () {
      await this.$store.dispatch("setToken", {
        token: this.$store.state.auth.user.token
      });
    });
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

<style scoped>

</style>

<template>
  <v-layout justify-center align-center>
    <v-card class="elevation-10" style="flex: 0 1 400px">
      <v-card-title class="headline">Log In</v-card-title>
      <v-card-text>
        <v-form @submit.prevent="submit">
          <v-alert v-if="alert" :type="alert.type" value="true">{{alert.message}}</v-alert>
          <v-text-field label="Email" v-model="email"></v-text-field>
          <v-text-field label="Password" v-model="password" type="password"></v-text-field>
          <div style="text-align:right;">
              <p><span><a href="/forgotPassword">Forgot password? </a></span></p>
          </div>
          <v-btn type="submit" color="primary" :loading="loading" :disabled="loading">Log in</v-btn>
        </v-form>
        <br>
        <p>Don't have an account? <span><a href="https://tmm-go.com/#contact-us" target="_blank">Contact Us </a></span> to find out how you can sign up</p>
      </v-card-text>
    </v-card>
  </v-layout>
</template>

<script>
import cookie from 'cookie'
export default {
  layout: 'fullscreen',
  data () {
    return {
      email: '',
      password: '',
      alert: null,
      loading: false,
    }
  },
  mounted () {

  },
  methods: {
    async submit () {
      this.alert = null
      this.loading = true
      this.$store.dispatch('login', {
        email: this.email,
        password: this.password
      }).then(result => {
        this.loading = false;
        this.$router.push("/");
      }).catch(error => {
        this.loading = false
        if (error.response && error.response.data) {
          this.alert = {type: 'error', message: error.response.data.message || error.response.status}
        }
      })
    },
    register (){
        this.$router.push('/register');
    }
  }
}
</script>

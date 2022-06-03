<template>
  <v-layout justify-center align-center>
    <v-card class="elevation-10" style="flex: 0 1 400px">
      <v-card-title class="headline">Reset Password</v-card-title>
      <v-card-text>
        <v-form @submit.prevent="submit">
          <v-alert v-if="alert" :type="alert.type" value="true" style="color:#000000 !important">{{alert.message}}</v-alert>
          <v-text-field label="Email" v-model="email"></v-text-field>
          <v-btn type="submit" :loading="loading" :disabled="loading">Send Email</v-btn>
        </v-form>
        <br>
        <p>Back to <span><a href="/login">login </a></span></p>
      </v-card-text>
    </v-card>
  </v-layout>
</template>

<script>
export default {
  layout: 'fullscreen',
  data () {
    return {
      email: '',
      alert: null,
      loading: false,
    }
  },
  mounted () {

  },
  methods: {
    submit () {
      this.alert = null
      this.loading = true
      this.$store.dispatch('callMiddlewareRoute', {
        email: this.email,
        route: 'users/resetPassword'
      }).then(result => {
        console.log(result);
        this.alert = {type: 'success', message: result.message}
        this.loading = false
      }).catch(error => {
        this.loading = false
        if (error.response && error.response.data) {
          this.alert = {type: 'error', message: error.response.data.message || error.response.status}
        }
      })
    }
  }
}
</script>

<style>

</style>

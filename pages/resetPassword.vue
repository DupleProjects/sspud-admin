<template>
  <v-layout justify-center align-center>
    <v-card class="elevation-10" style="flex: 0 1 400px">
      <v-card-title class="headline">Enter New Password</v-card-title>
      <v-card-text>
        <v-form @submit.prevent="submit">
          <v-alert v-if="alert" :type="alert.type" value="true">{{alert.message}}</v-alert>
          <v-text-field label="Password" v-model="password" type="password"></v-text-field>
          <div class="progress">
            <div
                class="progress-bar"
                v-bind:class="{ 'bg-danger': passwordPower === 1, 'bg-warning': passwordPower === 2, '': passwordPower === 3, 'bg-success': passwordPower === 4 }"
                role="progressbar"
                :style="`width: ${strengthWidth}%`"
                aria-valuenow="75"
                aria-valuemin="0"
                aria-valuemax="100"></div>
          </div>
          <v-text-field label="Confirm Password" v-model="confirmPassword" type="password"></v-text-field>
          <v-btn type="submit" :loading="loading" :disabled="loading">Save</v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-layout>
</template>

<script>
import { passwordStrength } from 'check-password-strength'
export default {
  layout: 'fullscreen',
  data () {
    return {
      password: '',
      confirmPassword: '',
      alert: null,
      loading: false,
      passwordPower: 1,
      strengthWidth: 0
    }
  },
  mounted () {

  },
  methods: {
    submit () {
      if(this.password !== this.confirmPassword) {
        this.alert = {type: 'error', message: 'Passwords do not match!'}
      } else {
        this.alert = null
        this.loading = true
        console.log(this.$route.query.token);
        this.$store.dispatch('callMiddlewareRoute', {
          route: 'users/updatePassword',
          password: this.password,
          token: this.$route.query.token
        }).then(result => {
          console.log("Success");
          this.alert = {type: 'success', message: "Successfully updated password"}
          this.loading = false
          this.$router.push('/')
        }).catch(error => {
          console.log("Error");
          console.log(error)
          this.loading = false
          if (error.response && error.response.data) {
            this.alert = {type: 'error', message: error.response.data.message || error.response.status}
          }
        })
      }
    },
    register (){
      this.$router.push('/register');
    }
  },
  watch: {
    password: function(val, oldVal) {
      if (val.length === 0) {
        this.strengthWidth = 0;
      } else if (passwordStrength(val).value === 'Too weak') {
        this.strengthWidth = 25;
        this.passwordPower = 1;
      } else if (passwordStrength(val).value === 'Weak') {
        this.strengthWidth = 50;
        this.passwordPower = 2;
      } else if (passwordStrength(val).value === 'Medium') {
        this.strengthWidth = 75;
        this.passwordPower = 3;
      } else if (passwordStrength(val).value === 'Strong') {
        this.strengthWidth = 100;
        this.passwordPower = 4;
      }
    }
  }
}
</script>

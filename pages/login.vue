<template>

  <div class="header">
    <div class="container">
      <div class="inner-header d-flex flex-row justify-content-center">
        <div class="d-flex flex-column justify-content-center">
          <h1 class="display-4 fw-bold lh-1 mb-3">SSPUD</h1>
          <v-form @submit.prevent="submit">
            <v-alert v-if="alert" :type="alert.type" value="true">{{alert.message}}</v-alert>
            <div class="card p-3 login-card">
              <v-text-field label="Email" v-model="email"></v-text-field>
              <v-text-field label="Password" v-model="password" type="password"></v-text-field>
              <v-btn type="submit" color="primary" :loading="loading" :disabled="loading">Log in</v-btn>
            </div>
            <br>
            <p><a  class="mt-5 white--text" href="/forgotPassword">Forgot password? </a></p>
          </v-form>
        </div>
      </div>
    </div>

    <!--Waves Container-->
    <div>
      <svg class="waves" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
           viewBox="0 24 150 28" preserveAspectRatio="none" shape-rendering="auto">
        <defs>
          <path id="gentle-wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
        </defs>
        <g class="parallax">
          <use xlink:href="#gentle-wave" x="48" y="0" fill="rgba(255,255,255,0.7" />
          <use xlink:href="#gentle-wave" x="48" y="3" fill="rgba(255,255,255,0.5)" />
          <use xlink:href="#gentle-wave" x="48" y="5" fill="rgba(255,255,255,0.3)" />
          <use xlink:href="#gentle-wave" x="48" y="7" fill="#fff" />
<!--        <g class="parallax">-->
<!--          <use xlink:href="#gentle-wave" x="48" y="0" fill="rgba(51, 62, 72,0.7)" />-->
<!--          <use xlink:href="#gentle-wave" x="48" y="3" fill="rgba(51, 62, 72,0.5)" />-->
<!--          <use xlink:href="#gentle-wave" x="48" y="5" fill="rgba(51, 62, 72,0.3)" />-->
<!--          <use xlink:href="#gentle-wave" x="48" y="7" fill="rgba(51, 62, 72,0.3)" />-->
<!--        </g>-->
        </g>
      </svg>
    </div>
    <!--Waves end-->
  </div>
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

<style>

@-webkit-keyframes gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.header {
  position:relative;
  text-align:center;
  background: linear-gradient(60deg, rgba(84,58,183,1) 0%, rgba(0,172,193,1) 100%);
  /*background: linear-gradient(60deg, #FFD800, #3D7349);*/
  color:white;
}

.inner-header {
  height:77.5vh;
  width: 100%;
}

.waves {
  position:relative;
  width: 100%;
  height:20vh;
  margin-bottom:-7px; /*Fix for safari gap*/
  min-height:100px;
  max-height:150px;
}
/* Animation */

.parallax > use {
  animation: move-forever 25s cubic-bezier(.55,.5,.45,.5)     infinite;
}
.parallax > use:nth-child(1) {
  animation-delay: -2s;
  animation-duration: 7s;
}
.parallax > use:nth-child(2) {
  animation-delay: -3s;
  animation-duration: 10s;
}
.parallax > use:nth-child(3) {
  animation-delay: -4s;
  animation-duration: 13s;
}
.parallax > use:nth-child(4) {
  animation-delay: -5s;
  animation-duration: 20s;
}
@keyframes move-forever {
  0% {
    transform: translate3d(-90px,0,0);
  }
  100% {
    transform: translate3d(85px,0,0);
  }
}
/*Shrinking for mobile*/
@media (max-width: 768px) {
  .waves {
    height:40px;
    min-height:40px;
  }
  .content {
    height:30vh;
  }
  h1 {
    font-size:24px;
  }
}

.login-card {
  width: 700px;
  max-width: 700px;
  color: black;
}

</style>

<template>
  <div id="app">
    <div class="container py-6">
      <transition name="fade">
        <router-view />
      </transition>
    </div>
    <!-- <div @click="signout">logout</div> -->
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  methods: {
    ...mapActions('auth', { signout: 'signout' })
  }
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

.fullscreen {
  height: 100vh;
  width: 100vw;
  background-color: #fff;
  position: fixed;
  z-index: 10;
  top: 0;
  left: 0;
  padding: 2rem 1rem;
  box-shadow: 0px -4px 0 10px rgba(0, 0, 0, .2);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease-in-out;
}

.fade-enter,
.fade-leave {
  transform: scale(1.2);
  opacity: 0;
}
</style>

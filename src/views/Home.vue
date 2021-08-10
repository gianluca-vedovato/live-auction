<template>
  <div class="home" v-if="user">
    <Navigation/>
    <h1 class="text-4xl text-blue-600 font-bold">Benvenuto, {{ user.nickname || user.uid }}</h1>
    <div v-if="!isLive && !startNewAuction" class="my-10">
      <div>Nessuna asta live al momento</div>
      <div class="flex justify-center my-10">
        <MainButton @click.native="startNewAuction = true">
          Inizia nuova asta
        </MainButton>
      </div>
    </div>
    <transition name="slide-in">
      <LiveAuction v-if="isLive" />
    </transition>
    <transition name="slide-in">
      <NewAuction v-if="startNewAuction" @close="closeNewAuction" />
    </transition>
  </div>
</template>

<script>
import { auth } from '@/plugins/firebase'
import store from '@/store'
import { mapGetters } from 'vuex'

import Navigation from '@/components/Navigation'
import MainButton from '@/components/MainButton'
import NewAuction from '@/components/NewAuction'
import LiveAuction from '@/components/LiveAuction'

export default {
  components: {
    MainButton,
    NewAuction,
    LiveAuction,
    Navigation
  },
  data: () => ({
    startNewAuction: false
  }),
  computed: {
    ...mapGetters('liveAuction', { auction: 'auction', isLive: 'isLive' }),
    ...mapGetters('auth', { user: 'user' })
  },
  methods: {
    closeNewAuction () {
      this.startNewAuction = false
    }
  },
  async beforeRouteEnter (to, from, next) {
    await auth
    if (!store.getters['auth/uid']) return next({ name: 'Login' })
    await store.dispatch('auth/bindUser', store.getters['auth/uid'])
    await store.dispatch('auth/bindUsers')
    if (!store.getters['auth/user']) return next({ name: 'CreateUser' })
    await store.dispatch('liveAuction/bindAuction')
    return next()
  }
}
</script>

<style lang="scss" scoped>
.slide-in-enter-active,
.slide-in-leave-active {
  transition: opacity 0.32s ease-in-out, transform 0.32s ease-in-out;
}

.slide-in-enter,
.slide-in-leave {
  transform: translateY(100%);
  opacity: 0;
}
</style>

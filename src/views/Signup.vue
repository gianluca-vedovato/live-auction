<template>
  <div class="signup">
    <h1 class="text-4xl text-blue-600 font-bold">Registrati</h1>
    <transition name="fade" mode="out-in">
      <div v-if="!signedUp">
        <form @submit.prevent="submit" class="flex flex-col items-center mt-10">
          <label for="email" class="text-blue-600 font-bold text-s">E-mail</label>
          <input type="text" name="email" id="email" v-model="email" class="my-2" placeholder="email">
          <label for="email" class="mt-4 text-blue-600 font-bold text-s">Password</label>
          <input type="password" name="password" id="password" v-model="password" class="my-2" placeholder="password">
          <button type="submit" class="mt-5">
            <MainButton>
              Registrati
            </MainButton>
          </button>
        </form>
        <div v-if="error" class="text-red-500 text-xs mt-4">
          {{ error }}
        </div>
        <div class="mt-10 font-gray-400 text-s">
          Sei già registrato? <router-link class="font-bold underline" :to="{ name: 'Login' }">Login</router-link>
        </div>
      </div>
      <div v-else class="mt-10 font-gray-400 text-s">
        Registrazione avvenuta con successo. Vai al <router-link class="font-bold underline" :to="{ name: 'Login' }">login</router-link>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import MainButton from '@/components/MainButton'

export default {
  components: {
    MainButton
  },
  name: 'signUp',
  data: () => ({
    email: '',
    password: '',
    signedUp: false,
    error: undefined
  }),
  methods: {
    ...mapActions('auth', { signup: 'signup' }),
    async submit () {
      try {
        await this.signup({ email: this.email, password: this.password })
        this.signedUp = true
      } catch (e) {
        console.error(e)
        this.error = e
      }
      await this.signup({ email: this.email, password: this.password })
    }
  }
}
</script>

<style lang="scss" scoped>
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

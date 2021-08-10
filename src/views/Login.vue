<template>
  <div class="login">
    <h1 class="text-4xl text-blue-600 font-bold">Login</h1>
    <form @submit.prevent="submit" class="flex flex-col items-center mt-10">
      <label for="email" class="text-blue-600 font-bold text-s">E-mail</label>
      <input type="text" name="email" id="email" v-model="email" class="my-2" placeholder="email">
      <label for="email" class="mt-4 text-blue-600 font-bold text-s">Password</label>
      <input type="password" name="password" id="password" v-model="password" class="my-2" placeholder="password">
      <button type="submit" class="mt-5">
        <MainButton>
          Login
        </MainButton>
      </button>
    </form>
    <div v-if="error" class="text-red-500 text-xs mt-4">
      {{ error }}
    </div>
    <div class="mt-10 font-gray-400 text-s">
      Non sei registrato? <router-link class="font-bold underline" :to="{ name: 'Signup' }">Registrati</router-link>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import MainButton from '@/components/MainButton'

export default {
  components: {
    MainButton
  },
  data: () => ({
    email: '',
    password: '',
    error: undefined
  }),
  computed: {
    ...mapGetters('auth', { user: 'user' })
  },
  methods: {
    ...mapActions('auth', { login: 'login' }),
    async submit () {
      try {
        await this.login({ email: this.email, password: this.password })
        this.$router.push({ name: 'Home' })
      } catch (e) {
        console.error(e)
        this.error = e
      }
    }
  }
}
</script>

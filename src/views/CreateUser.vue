<template>
  <div class="login">
    <h1 class="text-4xl text-blue-600 font-bold">Inserisci il tuo nickname</h1>
    <transition name="fade" mode="out-in">
      <div v-if="!created">
        <form @submit.prevent="submit" class="flex flex-col items-center mt-10">
          <label for="nickname" class="text-blue-600 font-bold text-s">Nickname</label>
          <input type="text" name="nickname" id="nickname" v-model="nickname" class="my-2" placeholder="nickname">
          <button type="submit" class="mt-5">
            <MainButton>
              Salva
            </MainButton>
          </button>
        </form>
      </div>
      <div v-else class="mt-10 font-gray-400 text-s">
        Nickname salvato. Vai alla <router-link class="font-bold underline" :to="{ name: 'Home' }">home</router-link>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import firebase from 'firebase'
import MainButton from '@/components/MainButton'

export default {
  components: {
    MainButton
  },
  data: () => ({
    nickname: undefined,
    created: false
  }),
  computed: {
    ...mapGetters('auth', { uid: 'uid' })
  },
  methods: {
    ...mapActions('auth', { createUser: 'createUser', bindUser: 'bindUser' }),
    async submit () {
      await this.createUser({
        uid: this.uid,
        nickname: this.nickname,
        createdAt: firebase.firestore.Timestamp.fromDate(new Date()),
        goalkeepers: {},
        defenders: {},
        midfielders: {},
        strikers: {}
      })
      await this.bindUser(this.uid)
      this.created = true
    }
  }
}
</script>

<template>
  <div class="user" v-if="user">
    Crediti rimanenti: <strong class="text-blue-600">{{ remainingCredits }}</strong>
    <div v-for="role of roles" :key="role" class="my-6 border-b border-gray-200">
      <h2 class="text-xl font-bold pb-4">
        {{ rolesTranslations[role] }} <span class="text-sm" :class="{ 'text-blue': Object.keys(user[role]).length === maxPlayers[role] }">({{ Object.keys(user[role]).length }}/{{ maxPlayers[role] }})</span>
      </h2>
      <div v-if="user[role]" class="block mb-6">
        <p class="block mb-4 text-s" v-for="(player, i) of Object.keys(user[role])" :key="i">
          <strong class="text-xs">{{ (i + 1) }}</strong>. {{ player }}: {{ user[role][player] }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { auth } from '@/plugins/firebase'
import store from '@/store'

export default {
  data: () => ({
    maxCredits: 500,
    roles: [
      'goalkeepers',
      'defenders',
      'midfielders',
      'strikers'
    ],
    maxPlayers: {
      goalkeepers: 3,
      defenders: 8,
      midfielders: 8,
      strikers: 6
    },
    rolesTranslations: {
      goalkeepers: 'Portieri',
      defenders: 'Difensori',
      midfielders: 'Centrocampisti',
      strikers: 'Attaccanti'
    }
  }),
  computed: {
    ...mapGetters('auth', { user: 'user' }),
    totalCreditsUsed: {
      get () {
        const array = []
        this.roles.forEach((r) => {
          if (Object.values(this.user[r]).length) array.push(Object.values(this.user[r]))
        })
        console.log(array.flat())
        return array.flat().reduce((acc, curr) => acc + curr)
      }
    },
    remainingCredits: {
      get () {
        return this.maxCredits - this.totalCreditsUsed
      }
    }
  },
  async beforeRouteEnter (to, from, next) {
    await auth
    if (!store.getters['auth/uid']) return next({ name: 'Login' })
    await store.dispatch('auth/bindUser', store.getters['auth/uid'])
    await store.dispatch('auth/bindUsers')
    return next()
  }
}
</script>

<template>
  <div class="fullscreen">
    <div class="absolute top-8 right-8 close cursor-pointer transition-all duration-200 hover:opacity-60" @click="$emit('close')">
      <span />
      <span />
    </div>
    <h1 class="text-4xl font-bold">Nuova asta</h1>
    <form @submit.prevent="startNewAuction" class="flex flex-col items-center mt-10">
      <label for="role" class="text-blue-600 font-bold text-s">Ruolo</label>
      <select name="role" id="role" v-model="role">
        <option :value="role.key" v-for="role of roles" :key="role.key">{{ role.name }}</option>
      </select>
      <div v-if="role" class="inline-block relative">
        <label for="player" class="block mt-4 text-blue-600 font-bold text-s">Giocatore</label>
        <input type="text" name="player" id="player" v-model="player" class="my-2" placeholder="Ricerca squadra o giocatore" @focus="showSuggestions = true" @blur="handleBlur" autocomplete="off" @input="handleInput">
        <div class="suggestions absolute left-0 bg-white shadow-md z-10 w-full max-h-60 overflow-y-auto" v-if="player && player.length > 0 && showSuggestions">
          <span class="cursor-pointer transition-all duration-200 hover:opacity-60 block py-4 text-xs text-gray-800 border-bottom border-gray-300" @click="selectPlayer(suggestion)" v-for="(suggestion, i) of suggestions" :key="i">
            {{ suggestion.__2 }} ({{ suggestion.__3 }})
          </span>
        </div>
      </div>
      <label for="value" class="text-blue-600 font-bold text-s mt-4">Prezzo di partenza</label>
      <input type="number" name="value" id="value" v-model="value" class="my-2" placeholder="Prezzo di partenza" min="0" max="400">
      <button type="submit" class="mt-5">
        <MainButton>
          Inizia
        </MainButton>
      </button>
    </form>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import MainButton from '@/components/MainButton'

import quot from './dataset/quot.json'

export default {
  components: {
    MainButton
  },
  data: () => ({
    role: 'goalkeepers',
    player: undefined,
    value: 1,
    showSuggestions: true,
    quot,
    roles: [
      {
        key: 'goalkeepers',
        name: 'Portiere'
      },
      {
        key: 'defenders',
        name: 'Difensore'
      },
      {
        key: 'midfielders',
        name: 'Centrocampista'
      },
      {
        key: 'strikers',
        name: 'Attaccante'
      }
    ]
  }),
  computed: {
    ...mapGetters('auth', { uid: 'uid' }),
    suggestions: {
      get () {
        const roles = {
          goalkeepers: 'P',
          defenders: 'D',
          midfielders: 'C',
          strikers: 'A'
        }
        const role = roles[this.role]
        const player = this.player.toUpperCase()
        return this.quot
          .filter((p) => p.__1 === role && (p.__2.includes(player) || p.__3.toUpperCase().includes(player.toUpperCase())))
      }
    }
  },
  methods: {
    ...mapActions('liveAuction', { startAuction: 'startAuction' }),
    startNewAuction () {
      this.$emit('close')
      this.startAuction({
        player: {
          name: this.player,
          role: this.role
        },
        value: parseInt(this.value),
        uid: this.uid
      })
    },
    handleInput (e) {
      this.player = e.target.value
    },
    selectPlayer (player) {
      this.player = player.__2
      this.showSuggestions = false
    },
    handleBlur () {
      setTimeout(() => {
        this.showSuggestions = false
      }, 200)
    }
  }
}
</script>

<style lang="scss" scoped>
.zoom-out-enter-active,
.zoom-out-leave-active {
  transition: opacity 0.2s ease-in-out, transform 0.2s ease-out;
}

.zoom-out-enter,
.zoom-out-leave {
  transform: scale(1.2);
  opacity: 0;
}

.close {
  span {
    @apply bg-gray-600 h-0.5 w-6 relative block;
    &:first-child {
      @apply mt-0.5;
      transform: rotate(45deg);
    }
    &:last-child {
      @apply -mt-0.5;
      transform: rotate(-45deg);
    }
  }
}
</style>

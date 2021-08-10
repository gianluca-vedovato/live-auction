<template>
  <div class="fullscreen flex justify-center">
    <div class="card">
      <h1 class="text-4xl font-bold">Asta live</h1>
      <h2 class="text-xl my-5">Asta per {{ currentPlayer.name }}</h2>
      <transition name="zoom-out" mode="out-in">
        <p :key="currentValue">Prezzo offerto: <strong>{{ currentValue }}</strong> <span class="text-gray-500" v-if="currentUser">({{ currentUserNickname }})</span></p>
      </transition>
      <span class="progress inline-block my-2 h-1 bg-blue-400" :style="{ animationDuration: `${timer / 1000}s` }" :key="edited" v-if="edited > 1 && countdown === 0 && !end"></span>
      <transition name="zoom-out" mode="out-in">
        <div class="timer my-4 text-2xl text-pink-600 font-bold" :key="countdown" v-if="(timeout && countdown > 0) || end">
          {{ countdownMessage }}
        </div>
      </transition>
      <div class="flex items-center justify-center my-6">
        <MainButton class="mx-4" @click.native="handleOffer(1)" :status="isMyOffer || this.end ? 'disabled' : 'active'">
          +1
        </MainButton>
         <MainButton class="mx-4" @click.native="handleOffer(5)" :status="isMyOffer || this.end ? 'disabled' : 'active'">
          +5
        </MainButton>
         <MainButton class="mx-4" @click.native="handleOffer(10)" :status="isMyOffer || this.end ? 'disabled' : 'active'">
          +10
        </MainButton>
      </div>
      <div class="flex justify-center my-5">
        <MainButton type="secondary" :status="isMyOffer || this.end ? 'disabled' : 'active'">
          Passo
        </MainButton>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import * as firebase from 'firebase'
import MainButton from '@/components/MainButton'

export default {
  components: {
    MainButton
  },
  data: () => ({
    timeout: undefined,
    interval: undefined,
    end: false,
    countdown: 0
  }),
  computed: {
    ...mapGetters('liveAuction', {
      isLive: 'isLive',
      currentPlayer: 'currentPlayer',
      currentValue: 'currentValue',
      currentUser: 'currentUser',
      lastEdited: 'lastEdited',
      edited: 'edited'
    }),
    ...mapGetters('auth', { uid: 'uid', userById: 'userById' }),
    currentUserNickname: {
      get () {
        return this.userById(this.currentUser)
      }
    },
    isMyOffer: {
      get () {
        return this.currentUser === this.uid
      }
    },
    countdownMessage: {
      get () {
        return this.end ? `Aggiudicato a ${this.currentUserNickname} a ${this.currentValue}` : this.countdown
      }
    },
    timer: {
      get () {
        return this.edited === 1
          ? 6000
          : this.edited < 5
            ? 4500
            : 2500
      }
    }
  },
  watch: {
    lastEdited: {
      handler (v) {
        console.log(v, v.toDate())
        console.log(new firebase.Timestamp())
      },
      immediate: true
    }
  },
  methods: {
    ...mapActions('liveAuction', { offer: 'offer', stopAuction: 'stopAuction' }),
    ...mapActions('auth', { addPlayer: 'addPlayer' }),
    async handleOffer (amount) {
      await this.offer({ value: this.currentValue + amount, uid: this.uid, edited: (this.edited + 1) })
    },
    startTimer () {
      this.interval = setInterval(() => {
        if (this.countdown === 3) {
          if (this.isMyOffer) {
            this.addPlayer({ uid: this.uid, player: this.currentPlayer, value: this.currentValue })
            this.stopAuction()
          }
          this.stopTimer()
          this.end = true
          return
        }
        this.countdown++
      }, 1000)
    },
    stopTimer () {
      if (this.interval) clearInterval(this.interval)
      if (this.timeout) clearTimeout(this.timeout)
      this.countdown = 0
      this.timeout = undefined
      this.interval = undefined
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

.card {
  max-width: calc(100vw - 2rem);
  width: 400px;
}

.progress {
  width: 0;
  animation-name: progress;
  animation-timing-function: linear;
  animation-fill-mode: both;
}

@keyframes progress {
  from {
    width: 0%;
  }
  to {
    width: 100%;
  }
}
</style>

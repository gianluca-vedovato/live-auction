import { database } from '@/plugins/firebase'
import { firestoreAction } from 'vuexfire'
import firebase from 'firebase/app'
import 'firebase/functions'

export default ({
  namespaced: true,
  state: {
    auction: undefined,
    id: undefined
  },
  getters: {
    isLive: (state) => state.auction.isLive,
    currentPlayer: (state) => state.auction.currentPlayer,
    currentValue: (state) => state.auction.currentValue,
    currentUser: (state) => state.auction.currentUser,
    lastEdited: (state) => state.auction.lastEdited,
    edited: (state) => state.auction.edited,
    countdown: (state) => state.auction.countdown,
    end: (state) => state.auction.end
  },
  mutations: {
    setAuction (state, auction) {
      state.auction = auction
    },
    setId (state, id) {
      state.id = id
    }
  },
  actions: {
    bindAuction: firestoreAction(async ({ commit, bindFirestoreRef }, uid) => {
      const snapshot = await database
        .collection('liveAuction')
        .get()

      if (!snapshot.docs[0]) return
      commit('setId', snapshot.docs[0].id)
      return bindFirestoreRef('auction', snapshot.docs[0].ref, { wait: true })
    }),
    startAuction: async ({ state }, { player, value, uid }) => {
      const data = {
        isLive: true,
        currentPlayer: player,
        currentValue: value,
        currentUser: uid,
        edited: 1,
        countdown: 0
      }
      const startTimer = await firebase
        .app()
        .functions('europe-west1')
        .httpsCallable('startTimer')

      startTimer({
        edited: 0,
        currentValue: value
      })
      return database
        .collection('liveAuction')
        .doc(state.id)
        .update(data)
    },
    offer: async ({ state }, { value, uid, edited }) => {
      const data = {
        currentValue: value,
        currentUser: uid,
        edited
      }

      const startTimer = await firebase
        .app()
        .functions('europe-west1')
        .httpsCallable('startTimer')
      startTimer({
        edited: 0,
        currentValue: value
      })

      return database
        .collection('liveAuction')
        .doc(state.id)
        .update(data)
    }
  }
})

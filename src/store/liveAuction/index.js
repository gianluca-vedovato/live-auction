import { database } from '@/plugins/firebase'
import { firestoreAction } from 'vuexfire'
import * as firebase from 'firebase'

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
    edited: (state) => state.auction.edited
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

      // no space found
      admin.database().ref('/messages').push({
        text: sanitizedMessage,
        author: { uid, name, picture, email },
      })
      if (!snapshot.docs[0]) return
      commit('setId', snapshot.docs[0].id)
      await firebase.functions().httpsCallable('startTimer', {
        edited: snapshot.docs[0].edited,
        currentValue: snapshot.docs[0].currentValue
      })
      return bindFirestoreRef('auction', snapshot.docs[0].ref, { wait: true })
    }),
    stopAuction: ({ state }) => {
      const data = {
        isLive: false,
        edited: 0
      }
      setTimeout(() => {
        return database
          .collection('liveAuction')
          .doc(state.id)
          .update(data)
      }, 4000)
    },
    startAuction: ({ state }, { player, value, uid }) => {
      const data = {
        isLive: true,
        currentPlayer: player,
        currentValue: value,
        currentUser: uid,
        edited: 1
      }
      return database
        .collection('liveAuction')
        .doc(state.id)
        .update(data)
    },
    offer: ({ state }, { value, uid, edited }) => {
      const data = {
        currentValue: value,
        currentUser: uid,
        edited
      }
      return database
        .collection('liveAuction')
        .doc(state.id)
        .update(data)
    }
  }
})

import firebase from 'firebase'
import { database } from '@/plugins/firebase'
import { firestoreAction } from 'vuexfire'

export default ({
  namespaced: true,
  state: {
    metadata: undefined,
    user: undefined,
    allUsers: undefined
  },
  getters: {
    uid: (state) => state.metadata?.uid,
    user: (state) => state.user,
    userById: state => id => state.allUsers?.find(u => u.uid === id).nickname,
    allUsers: state => state.allUsers
  },
  mutations: {
    setMetadata (state, metadata) {
      state.metadata = metadata
    },
    setUserId (state, id) {
      state.user = Object.assign(state.user, { id }, {})
    },
    resetUser (state) {
      state.user = undefined
    }
  },
  actions: {
    async signup (ctx, { email, password }) {
      await firebase
        .auth()
        .setPersistence(firebase.auth.Auth.Persistence.LOCAL)

      const meta = await firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)

      return meta
    },
    async login (ctx, { email, password }) {
      await firebase
        .auth()
        .setPersistence(firebase.auth.Auth.Persistence.LOCAL)

      const meta = await firebase
        .auth()
        .signInWithEmailAndPassword(email, password)

      ctx.commit('login')
      return meta
    },
    bindUser: firestoreAction(async ({ commit, bindFirestoreRef }, uid) => {
      commit('resetUser')
      const snapshot = await database
        .collection('users')
        .where('uid', '==', uid)
        .limit(1)
        .get()

      // no space found
      if (!snapshot.docs[0]) return

      return bindFirestoreRef('user', snapshot.docs[0].ref, { wait: true })
    }),
    async signout () {
      return firebase.auth().signOut()
    },
    createUser (context, data) {
      return database.collection('users').add(data)
    },
    bindUsers: firestoreAction(({ state, bindFirestoreRef }) =>
      bindFirestoreRef(
        'allUsers',
        database
          .collection('users'),
        { wait: true }
      )
    ),
    addPlayer: ({ state }, { uid, player, value }) => {
      const newPlayers = Object.assign(state.user[player.role], { [player.name]: value })
      const data = {
        [player.role]: newPlayers
      }
      return database
        .collection('users')
        .doc(state.user.id)
        .update(data)
    }
  }
})

import firebase from 'firebase'
import 'firebase/firestore'
import store from '@/store'

const firebaseConfig = {
  apiKey: 'AIzaSyAKhzzDQ18WoiTQEgkY8sP4b85aH2rRAw0',
  authDomain: 'fantacalcio-3836a.firebaseapp.com',
  projectId: 'fantacalcio-3836a',
  storageBucket: 'fantacalcio-3836a.appspot.com',
  messagingSenderId: '149906309176',
  appId: '1:149906309176:web:cdb18d43fc2db2573026cd'
}

firebase.initializeApp(firebaseConfig)

export const database = firebase.firestore()

export const auth = new Promise((resolve, reject) => {
  const timeout = setTimeout(reject, 5000)

  firebase.auth().onAuthStateChanged(async user => {
    clearTimeout(timeout)
    if (!user) {
      store.commit('auth/signout')
    } else {
      await store.commit('auth/setMetadata', user)
    }
    return resolve(user)
  })
})

export const Timestamp = firebase.firestore.Timestamp

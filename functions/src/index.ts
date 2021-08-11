import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

admin.initializeApp()
const db = admin.firestore()
const mainLiveAuctionId = 'IhkbDrILbzkpCaRBGMyq'

declare namespace firebase.database.ServerValue {
  var TIMESTAMP: any
}

const waitForCountdown = () => {
  // const delay: number = edited === 1
  //   ? 6000
  //   : edited < 5
  //     ? 4500
  //     : 2500
  const delay: number = 7500
  return new Promise(resolve => {
    setTimeout(resolve, delay)
  })
}

const countdown = (countdown: number) => {
  return new Promise(resolve => {
    setTimeout(() => resolve(countdown++), 1050)
  })
}

const timer = (delay: number) => {
  return new Promise(resolve => {
    setTimeout(resolve, delay)
  })
}

// const getSnapshot = () => {
//   return new Promise(resolve => {
//     admin
//       .firestore()
//       .collection('liveAuction')
//       .doc(mainLiveAuctionId)
//       .get()
//       .then((doc) => {
//         const snapshotData = doc.data()
//         return resolve(snapshotData)
//       })
//   })
// }

exports.startTimer = functions
  .region('europe-west1')
  .https
  .onCall(async (data) => {
    let changed: boolean = false
    const ref: FirebaseFirestore.DocumentReference = await db
      .collection('liveAuction')
      .doc(mainLiveAuctionId)

    ref
      .onSnapshot((doc) => {
        const snapData: any = doc.data()
        if (snapData.currentValue === data.currentValue) return false
        changed = true
        return true
      })

    ref.set({
      countdown: 0
    }, { merge: true })
    // await waitForCountdown(data.edited)
    await waitForCountdown()

    if (changed) return false
    ref.set({
      countdown: 1
    }, { merge: true })

    await countdown(1)

    if (changed) return false
    ref.set({
      countdown: 2
    }, { merge: true })

    await countdown(2)

    if (changed) return false
    ref.set({
      countdown: 3
    }, { merge: true })

    await countdown(3)

    if (changed) return false
    await ref.set({
      countdown: 4,
      end: true
    }, { merge: true })

    await timer(2500)
    return ref.set({
      isLive: false
    })
  })

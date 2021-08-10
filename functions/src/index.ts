import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

admin.initializeApp()
// const firestore = admin.firestore
const db = admin.firestore()
const mainLiveAuctionId = 'IhkbDrILbzkpCaRBGMyq'

declare namespace firebase.database.ServerValue {
  var TIMESTAMP: any
}

const waitForCountdown = (edited: number) => {
  const delay: number = edited === 1
    ? 6000
    : edited < 5
      ? 4500
      : 2500
  return new Promise((resolve) => {
    setTimeout(resolve, delay)
  })
}

const countdown = (countdown: number) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(countdown++), 1050)
  })
}

const getSnapshot = () => {
  return new Promise(resolve => {
    admin
      .firestore()
      .collection('liveAuction')
      .doc(mainLiveAuctionId)
      .get()
      .then((doc) => {
        const snapshotData = doc.data()
        return resolve(snapshotData)
      })
  })
}

exports.startTimer = functions
  .region('europe-west1')
  .https.onCall(async (data) => {
    const ref: FirebaseFirestore.DocumentReference = await db
      .collection('liveAuction')
      .doc(mainLiveAuctionId)

    await waitForCountdown(data.edited)
    let current: any = await getSnapshot()

    if (current?.currentValue !== data.currentValue) return false
    await ref.set({
      countdown: 1
    }, { merge: true })

    await countdown(1)
    current = await getSnapshot()

    if (current?.currentValue !== data.currentValue) return false
    await ref.set({
      countdown: 2
    }, { merge: true })

    await countdown(2)
    current = await getSnapshot()

    if (current?.currentValue !== data.currentValue) return false
    await ref.set({
      countdown: 3
    }, { merge: true })

    await countdown(3)
    current = await getSnapshot()

    if (current?.currentValue !== data.currentValue) return false
    await ref.set({
      countdown: 4,
      end: true
    }, { merge: true })

    return ref.set({
      isLive: false
    })
  })

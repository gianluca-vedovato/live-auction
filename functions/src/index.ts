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
  return new Promise((resolve, reject) => {
    setTimeout(resolve, delay)
  })
}

const countdown = (countdown: number) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(countdown--), 1200)
  })
}

exports.initTimer = functions
  .region('europe-west1')
  .firestore.document(`/liveAuction/${mainLiveAuctionId}`)
  .onUpdate((change: functions.Change<FirebaseFirestore.DocumentSnapshot>) => {
    const dataAfter: any = change.after.data()
    const dataBefore: any = change.before.data()
    if (dataAfter.currentValue === dataBefore.currentValue) return
    const edited: number = dataAfter.edited + 1
    const now: FirebaseFirestore.Timestamp = admin.firestore.Timestamp.now()

    // admin.database().ref('/startTimer').push({
    //   edited,
    //   countdown: 4,
    //   currentValue: dataAfter.currentValue
    // })
    return change
      .after
      .ref
      .set({
        lastEdited: now,
        edited,
        countdown: 4
      }, { merge: true })
  })

exports.startTimer = functions.https.onCall(async (data, context) => {
  const ref: FirebaseFirestore.DocumentReference = await db
    .collection('liveAuction')
    .doc(mainLiveAuctionId)

  await waitForCountdown(data.edited)
  const snapshot = await admin
    .firestore()
    .collection('liveAuction')
    .doc(mainLiveAuctionId)
    .get()

  if (!snapshot.exists) return
  const snapshotData = snapshot.data()
  if (snapshotData?.currentValue !== data.currentValue) return false
  return ref.set({
    countdown: 3
  }, { merge: true })
})

exports.startCountdown = functions.https.onCall(async (data, context) => {
  const ref: FirebaseFirestore.DocumentReference = await db
    .collection('liveAuction')
    .doc(mainLiveAuctionId)

  const newCountdown = await countdown(data.countdown)

  const snapshot = await admin
    .firestore()
    .collection('liveAuction')
    .doc(mainLiveAuctionId)
    .get()

  if (!snapshot.exists) return
  const snapshotData = snapshot.data()
  if (snapshotData?.currentValue !== data.currentValue) return false
  if (data.countdown === 0) {
    return ref.set({
      countdown: newCountdown,
      end: true
    }, { merge: true })
  }
  return ref.set({
    countdown: newCountdown
  }, { merge: true })
})

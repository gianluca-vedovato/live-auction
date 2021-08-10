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
const firestore = admin.firestore
// const db = admin.firestore()
const mainLiveAuctionId = 'IhkbDrILbzkpCaRBGMyq'

declare namespace firebase.database.ServerValue {
  var TIMESTAMP: any
}

exports.initTimer = functions
  .region('europe-west1')
  .firestore.document(`/liveAuction/${mainLiveAuctionId}`)
  .onUpdate((change: functions.Change<FirebaseFirestore.DocumentSnapshot>) => {
    const dataAfter: any = change.after.data()
    const dataBefore: any = change.before.data()
    if (dataAfter.currentValue === dataBefore.currentValue) return
    const edited = dataAfter.edited + 1
    functions.logger.log('edited', dataAfter.edited, dataBefore.edited, edited)

    return change
      .after
      .ref
      .set({
        lastEdited: firestore.Timestamp.fromDate(new Date()),
        edited
      }, { merge: true })
  })

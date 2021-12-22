import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();
const db = admin.firestore();

exports.addLike = functions.firestore
  .document("/posts/{creatorId}/userPosts/{postId}/likes/{userId}")
  .onCreate((snap, context) => {
    return db
      .collection("posts")
      .doc(context.params.creatorId)
      .collection("userPosts")
      .doc(context.params.postId)
      .update({
        likesCount: admin.firestore.FieldValue.increment(1),
      });
  });

exports.removeLike = functions.firestore
  .document("/posts/{creatorId}/userPosts/{postId}/likes/{userId}")
  .onCreate((snap, context) => {
    return db
      .collection("posts")
      .doc(context.params.creatorId)
      .collection("userPosts")
      .doc(context.params.postId)
      .update({
        likesCount: admin.firestore.FieldValue.increment(-1),
      });
  });

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

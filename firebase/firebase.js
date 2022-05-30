// const { initializeApp } = require("firebase-admin/app");

// const admin = require("firebase-admin");
// const serviceAccount = require("path/to/serviceAccountKey.json");

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: "https://mathdev-a901c.firebaseio.com",
// });

// admin
//   .getAuth()
//   .createUser({
//     email: "user@example.com",
//     emailVerified: false,
//     phoneNumber: "+11234567890",
//     password: "secretPassword",
//     displayName: "John Doe",
//     photoURL: "http://www.example.com/12345678/photo.png",
//     disabled: false,
//   })
//   .then((userRecord) => {
//     // See the UserRecord reference doc for the contents of userRecord.
//     console.log("Successfully created new user:", userRecord.uid);
//   })
//   .catch((error) => {
//     console.log("Error creating new user:", error);
//   });

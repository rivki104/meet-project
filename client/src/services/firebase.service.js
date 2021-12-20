import firebase from 'firebase';

let firebaseConfig = {
  apiKey: "AIzaSyAVE_zQ_LgYSh3ycvCLWrj4y694vvpHH-c",
  authDomain: "psyched-edge-301022.firebaseapp.com",
  projectId: "psyched-edge-301022",
  storageBucket: "psyched-edge-301022.appspot.com",
  messagingSenderId: "959209749825",
  appId: "1:959209749825:web:de2ffc77f77740419435c0"
};

const signOut = () => {
  firebase.auth().signOut().then(() => {
    alert("before remove from the local storage:" + localStorage["currentUserId"])
    localStorage.setItem("currentUserId", "");
    alert("after remove from the local storage:" + localStorage["currentUserId"])
  }).catch((error) => {
    console.log("There is an error: " + error);
  });
}

firebase.initializeApp(firebaseConfig);

export {
  firebase,
  signOut,
};


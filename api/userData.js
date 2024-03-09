import { clientCredentials, firebase } from '../utils/client';

if (!firebase.apps.length) {
  firebase.initializeApp(clientCredentials);
}

const db = firebase.firestore();
const usersCollection = db.collection('users');

// GET Users
const getUsers = (uid) => usersCollection.where('uid', '==', uid).get()
  .then((querySnapshot) => {
    const users = [];
    querySnapshot.forEach((doc) => {
      users.push(doc.data());
    });
    return users;
  })
  .catch((error) => {
    console.error('Error getting users:', error);
    throw error;
  });

// DELETE User
const deleteUser = (firebaseKey) => usersCollection.doc(firebaseKey).delete()
  .then(() => {
    console.warn('User successfully deleted');
  })
  .catch((error) => {
    console.error('Error deleting user:', error);
    throw error;
  });

// GET SINGLE User
const getSingleUser = (firebaseKey) => usersCollection.doc(firebaseKey).get()
  .then((doc) => {
    if (doc.exists) {
      return doc.data();
    }
    console.warn('No such user document!');
    return null;
  })
  .catch((error) => {
    console.error('Error getting user:', error);
    throw error;
  });

// CREATE User
const createUser = (payload) => usersCollection.add(payload)
  .then((docRef) => {
    console.warn('User document written with ID: ', docRef.id);
    return docRef.id;
  })
  .catch((error) => {
    console.error('Error adding user:', error);
    throw error;
  });

// UPDATE User
const updateUser = (userId, userData) => usersCollection.doc(userId).update(userData)
  .then(() => {
    console.warn('User document successfully updated');
  })
  .catch((error) => {
    console.error('Error updating user:', error);
    throw error;
  });

// GET User Data
const getUserData = (uid) => usersCollection.where('uid', '==', uid).get()
  .then((querySnapshot) => {
    if (!querySnapshot.empty) {
      return querySnapshot.docs[0].data();
    }
    console.warn('No user data found for the given UID:', uid);
    return null;
  })
  .catch((error) => {
    console.error('Error getting user data:', error);
    throw error;
  });

export {
  getUsers,
  createUser,
  deleteUser,
  getSingleUser,
  updateUser,
  getUserData,
};
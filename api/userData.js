import { firebase } from '../utils/client';

const db = firebase.firestore();
const usersCollection = db.collection('users');

// Function to get users from Firestore based on UID
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

// Function to delete a user document from Firestore
const deleteUser = (firebaseKey) => usersCollection.doc(firebaseKey).delete()
  .then(() => {
    console.warn('User successfully deleted');
  })
  .catch((error) => {
    console.error('Error deleting user:', error);
    throw error;
  });

// Function to get a single user document from Firestore based on UID
const getSingleUser = (uid) => usersCollection.doc(uid).get()
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

// Function to create a user document in Firestore
const createUser = async (userData) => {
  try {
    // Get the Firebase user ID
    const userId = firebase.auth().currentUser.uid;

    // Set the user data in the 'users' collection with the Firebase user ID as the document ID
    await usersCollection.doc(userId).set({
      ...userData,
      uid: userId, // Assigning the Firebase user ID as the uid field in the document
    });

    // Return the UID as confirmation
    return userId;
  } catch (error) {
    console.error('Error adding user:', error);
    throw error;
  }
};

// Function to update a user document in Firestore
const updateUser = (uid, userData) => usersCollection.doc(uid).update(userData)
  .then(() => {
    console.warn('User document successfully updated');
  })
  .catch((error) => {
    console.error('Error updating user:', error);
    throw error;
  });

// Function to get user data from Firestore based on UID
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

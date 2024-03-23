import { firebase } from '../utils/client';

const db = firebase.firestore();
const usersCollection = db.collection('users');

const getUsers = () => usersCollection.get()
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

const deleteUser = (uid) => usersCollection.doc(uid).delete()
  .then(() => {
    console.warn('User successfully deleted');
  })
  .catch((error) => {
    console.error('Error deleting user:', error);
    throw error;
  });

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

const createUser = async (userData) => {
  try {
    const userId = firebase.auth().currentUser.uid;
    await usersCollection.doc(userId).set({
      ...userData,
      uid: userId,
    });

    return userId;
  } catch (error) {
    console.error('Error adding user:', error);
    throw error;
  }
};

const updateUser = (uid, userData) => usersCollection.doc(uid).update(userData)
  .then(() => {
    console.warn('User document successfully updated');
  })
  .catch((error) => {
    console.error('Error updating user:', error);
    throw error;
  });

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

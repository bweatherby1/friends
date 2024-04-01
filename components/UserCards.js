import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Card } from 'react-bootstrap';
import firebase from 'firebase/app'; // Import Firebase app
import 'firebase/firestore'; // Import Firestore

// Initialize Firebase if it's not initialized already
if (!firebase.apps.length) {
  firebase.initializeApp({
    // Your Firebase config object goes here
  });
}

function UserCards({ users }) {
  const [currentUserID, setCurrentUserID] = useState(null);

  useEffect(() => {
    // Listen for authentication state changes and update currentUserID accordingly
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setCurrentUserID(user.uid);
      } else {
        setCurrentUserID(null);
      }
    });

    // Cleanup function
    return () => unsubscribe();
  }, []);

  const handleLinkUpClick = async (userObj) => {
    if (!currentUserID) {
      console.error('User is not authenticated.');
      return;
    }

    try {
      const userRef = firebase.firestore().collection('users').doc(currentUserID);
      const userDoc = await userRef.get();
      const userData = userDoc.data();

      console.warn('Current user data:', userData);

      if (userData && userData.matches) {
        console.warn('Current user matches:', userData.matches);

        // Check if the user is already matched with the selected user
        const isAlreadyMatched = userData.matches.find((match) => match.uid === userObj.uid);
        console.warn('Is already matched:', isAlreadyMatched);

        if (isAlreadyMatched) {
          console.warn('User is already matched with this user.');
          return;
        }

        const updatedMatches = [...userData.matches, userObj];
        console.warn('Updated matches:', updatedMatches);

        await userRef.update({ matches: updatedMatches });
      } else {
        await userRef.set({ matches: [userObj] }, { merge: true });
      }

      console.warn('User added to matches successfully');
    } catch (error) {
      console.error('Error adding user to matches:', error);
    }
  };

  return (
    <div className="user-cards">
      {users.map((userObj) => (
        <Card key={userObj.uid} style={{ width: '18rem', margin: '10px', backgroundColor: '#f0f0f0' }}>
          <Card.Img variant="top" src={userObj.image} alt={userObj.name} style={{ height: '300px' }} />
          <Card.Body>
            <Card.Title>{userObj.name}</Card.Title>
            <p className="card-text">{userObj.bio}</p>
            <p className="card-text">Skill Level: {userObj.skillLevel}</p>
            {userObj.selectedTimes && Array.isArray(userObj.selectedTimes) && <p className="card-text">Selected Times: {userObj.selectedTimes.join(', ')}</p>}
            <Button className="linkUp" onClick={() => handleLinkUpClick(userObj)}>
              Link Up!
            </Button>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
}

UserCards.propTypes = {
  users: PropTypes.arrayOf(
    PropTypes.shape({
      image: PropTypes.string,
      name: PropTypes.string,
      bio: PropTypes.string,
      skillLevel: PropTypes.string,
      selectedTimes: PropTypes.arrayOf(PropTypes.string),
      uid: PropTypes.string,
    }),
  ).isRequired,
};

export default UserCards;

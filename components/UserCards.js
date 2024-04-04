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

      // After successfully linking up, reload the page
      window.location.reload();
    } catch (error) {
      console.error('Error adding user to matches:', error);
    }
  };

  return (
    <div className="user-cards">
      {users.map((userObj) => (
        <div key={userObj.uid} className="card">
          <div className="matched-card">
            <div className="card-content">
              <div className="first-content">
                <Card style={{ width: '18rem', margin: '10px', backgroundColor: '#f0f0f0' }}>
                  <Card.Img variant="top" src={userObj.image} alt={userObj.name} style={{ height: '300px' }} />
                  <div className="name-overlay">{userObj.name}</div>
                </Card>
              </div>
              <div className="second-content">
                <Card.Body>
                  <Card.Text>{userObj.bio}</Card.Text>
                  <hr />
                  <Card.Text>Skill Level: {userObj.skillLevel}</Card.Text>
                  {userObj.selectedTimes && Array.isArray(userObj.selectedTimes) && (
                    <Card.Text>Selected Times: {userObj.selectedTimes.join(', ')}</Card.Text>
                  )}
                  <Button className="linkUp" onClick={() => handleLinkUpClick(userObj)}>Link Up!</Button>
                </Card.Body>
              </div>
            </div>
          </div>
        </div>
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

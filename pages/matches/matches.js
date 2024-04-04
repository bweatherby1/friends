import React, { useEffect, useState } from 'react';
import {
  Container, Row, Col, Card, Button,
} from 'react-bootstrap';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { deleteMatchedUser } from '../../api/userData';

function MatchedUsersPage() {
  const [matchedUsers, setMatchedUsers] = useState([]);

  useEffect(() => {
    // Fetch matched users from Firestore
    const fetchMatchedUsers = async () => {
      try {
        const currentUserID = firebase.auth().currentUser.uid;
        const userDoc = await firebase.firestore().collection('users').doc(currentUserID).get();
        const { matches } = userDoc.data();

        // Remove duplicate UIDs
        const uniqueUIDs = Array.from(new Set(matches.map((user) => user.uid)));

        // Get user data for unique UIDs
        const uniqueUsers = await Promise.all(uniqueUIDs.map(async (uid) => {
          const userSnap = await firebase.firestore().collection('users').doc(uid).get();
          return userSnap.data();
        }));

        setMatchedUsers(uniqueUsers);
      } catch (error) {
        console.error('Error fetching matched users:', error);
      }
    };

    fetchMatchedUsers();

    // Cleanup function
    return () => {};
  }, []);

  const handleDeleteUser = async (uid) => {
    try {
      // Delete the user from Firestore
      await deleteMatchedUser(uid);

      // Update the matchedUsers state to reflect the deletion
      const updatedUsers = matchedUsers.filter((user) => user.uid !== uid);
      setMatchedUsers(updatedUsers);

      console.warn('User removed successfully');
    } catch (error) {
      console.error('Error removing user:', error);
    }
  };

  return (
    <Container>
      <h1>Previous Matches</h1>
      <Row xs={1} sm={2} md={3}>
        {matchedUsers.map((userObj) => (
          <Col key={userObj.uid} style={{ marginBottom: '20px' }}>
            <Card className="card">
              <div className="matched-card">
                <div className="card-content">
                  <div className="first-content">
                    <Card.Img variant="top" src={userObj.image} alt={userObj.name} className="card-img-top" />
                    <div className="name-overlay">{userObj.name}</div>
                  </div>
                  <div className="second-content">
                    <Card.Body>
                      <Card.Text>{userObj.bio}</Card.Text>
                      <Card.Text>Skill Level: {userObj.skillLevel}</Card.Text>
                      {userObj.selectedTimes && Array.isArray(userObj.selectedTimes) && (
                      <Card.Text>Selected Times: {userObj.selectedTimes.join(', ')}</Card.Text>
                      )}
                      <Button onClick={() => handleDeleteUser(userObj.uid)} variant="danger">Delete</Button>
                    </Card.Body>
                  </div>
                </div>
              </div>
            </Card>
          </Col>

        ))}
      </Row>
    </Container>
  );
}

export default MatchedUsersPage;

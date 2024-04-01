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
      <Row>
        {matchedUsers.map((userObj) => (
          <Col key={userObj.uid} xs={12} sm={6} md={4} lg={3}>
            <Card style={{ marginBottom: '20px' }}>
              <Card.Img variant="top" src={userObj.image} alt={userObj.name} />
              <Card.Body>
                <Card.Title>{userObj.name}</Card.Title>
                <Card.Text>{userObj.bio}</Card.Text>
                <Card.Text>Skill Level: {userObj.skillLevel}</Card.Text>
                {userObj.selectedTimes && Array.isArray(userObj.selectedTimes) && (
                  <Card.Text>Selected Times: {userObj.selectedTimes.join(', ')}</Card.Text>
                )}
                <Button onClick={() => handleDeleteUser(userObj.uid)} variant="danger">Delete</Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default MatchedUsersPage;

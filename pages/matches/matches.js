import React, { useEffect, useState } from 'react';
import {
  Container, Row, Col, Card, Button, Badge,
} from 'react-bootstrap';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { deleteMatchedUser } from '../../api/userData';
import MessengerPop from '../../components/message';

function MatchesPage() {
  const [matchedUsers, setMatchedUsers] = useState([]);
  const [showMessenger, setShowMessenger] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [unreadMessages, setUnreadMessages] = useState({});

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

  useEffect(() => {
    // Check for unread messages
    const unsubscribe = firebase.firestore().collection('messages')
      .where('receiver', '==', firebase.auth().currentUser.uid)
      .where('read', '==', false)
      .onSnapshot((snapshot) => {
        const unreadCounts = {};
        snapshot.forEach((doc) => {
          const data = doc.data();
          unreadCounts[data.sender] = (unreadCounts[data.sender] || 0) + 1;
        });
        setUnreadMessages(unreadCounts);
      });

    // Cleanup function
    return () => unsubscribe();
  }, []);

  const handleDeleteUser = async (uid) => {
    try {
      // Delete the user from Firestore
      await deleteMatchedUser(uid);

      // Update the matchedUsers state to reflect the deletion
      setMatchedUsers((prevUsers) => prevUsers.filter((user) => user.uid !== uid));

      console.warn('User removed successfully');
    } catch (error) {
      console.error('Error removing user:', error);
    }
  };

  const handleOpenMessenger = (user) => {
    setSelectedUser(user);
    setShowMessenger(true);
    // Mark messages as read when opening messenger
    // Assuming you have a messages collection with 'read' field
    firebase.firestore().collection('messages')
      .where('sender', '==', user.uid)
      .where('receiver', '==', firebase.auth().currentUser.uid)
      .where('read', '==', false)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          doc.ref.update({ read: true });
        });
      })
      .catch((error) => {
        console.error('Error marking messages as read:', error);
      });
  };

  const handleCloseMessenger = () => {
    setShowMessenger(false);
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
                    <Card.Img variant="top" src={userObj.image || ''} className="card-img-top" />
                    <div className="name-overlay">{userObj.name}</div>
                    {/* Display notification dot if user has unread messages */}
                    {unreadMessages[userObj.uid] > 0 && (
                      <Badge variant="danger" className="notification-dot">{unreadMessages[userObj.uid]}</Badge>
                    )}
                  </div>
                  <div className="second-content">
                    <Card.Body>
                      <Card.Text>{userObj.bio}</Card.Text>
                      <hr />
                      <Card.Text>Skill: {userObj.skillLevel}</Card.Text>
                      <hr />
                      {userObj.selectedTimes && Array.isArray(userObj.selectedTimes) && (
                        <Card.Text>Times: {userObj.selectedTimes.join(', ')}</Card.Text>
                      )}
                      <hr />
                      <Button onClick={() => handleDeleteUser(userObj.uid)} variant="danger">Delete</Button>
                      {/* Render Message button */}
                      <Button onClick={() => handleOpenMessenger(userObj)} variant="primary">Message</Button>
                    </Card.Body>
                  </div>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
      {/* Render MessengerPop component as modal or popover */}
      {showMessenger && selectedUser && (
        <MessengerPop
          user={selectedUser}
          handleClose={handleCloseMessenger}
        />
      )}
    </Container>
  );
}

export default MatchesPage;

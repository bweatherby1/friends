import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { Modal, Button, ListGroup } from 'react-bootstrap';

const MessengerPop = ({ user, handleClose }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  const updateMessages = (newMessages) => {
    setMessages((prevMessages) => {
      // Create a set of unique message IDs
      const messageIds = new Set(prevMessages.map((msg) => msg.id));

      // Filter out duplicate messages and update the state
      return [
        ...prevMessages,
        ...newMessages.filter((msg) => !messageIds.has(msg.id)),
      ];
    });
  };

  useEffect(() => {
    const currentUserID = firebase.auth().currentUser.uid;

    const sentMessagesQuery = firebase.firestore()
      .collection('messages')
      .where('sender', '==', currentUserID)
      .where('receiver', '==', user.uid)
      .orderBy('timestamp');

    const receivedMessagesQuery = firebase.firestore()
      .collection('messages')
      .where('sender', '==', user.uid)
      .where('receiver', '==', currentUserID)
      .orderBy('timestamp');

    const unsubscribeSent = sentMessagesQuery.onSnapshot((snapshot) => {
      const sentMessagesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      updateMessages(sentMessagesData);
    });

    const unsubscribeReceived = receivedMessagesQuery.onSnapshot((snapshot) => {
      const receivedMessagesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      updateMessages(receivedMessagesData);
    });

    // Cleanup function
    return () => {
      unsubscribeSent();
      unsubscribeReceived();
    };
  }, [user]);

  const handleSendMessage = async () => {
    if (newMessage.trim() !== '') {
      try {
        await firebase.firestore().collection('messages').add({
          sender: firebase.auth().currentUser.uid,
          receiver: user.uid,
          text: newMessage,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        });
        setNewMessage('');
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  return (
    <Modal show onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Messages with {user.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ListGroup variant="flush">
          {messages.map((message) => (
            <ListGroup.Item key={message.id}>
              {message.text}
            </ListGroup.Item>
          ))}
        </ListGroup>
        <div className="new-message-container">
          <input
            type="text"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <Button variant="primary" onClick={handleSendMessage}>Send</Button>
          <Button variant="secondary" onClick={handleClose}>Close</Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

MessengerPop.propTypes = {
  user: PropTypes.shape({
    uid: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default MessengerPop;

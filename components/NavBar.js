import React, { useEffect, useState, useRef } from 'react';
import {
  Navbar, Container, Nav, Button, Badge,
} from 'react-bootstrap';
import firebase from 'firebase/app';
import { signOut } from '../utils/auth';
import { useAuth } from '../utils/context/authContext'; // Importing auth context
import { getUserData } from '../api/userData'; // Importing function to fetch user data;
import 'firebase/firestore';

export default function NavBar() {
  const { user } = useAuth(); // Using useAuth hook to get user data
  const [userData, setUserData] = useState(null);
  const [showCollapse, setShowCollapse] = useState(false); // State to control visibility of CollapseComponent
  const [unreadMessages, setUnreadMessages] = useState(0); // State to track unread messages count

  useEffect(() => {
    if (user) {
      getUserData(user.uid)
        .then((data) => {
          setUserData(data);
        })
        .catch((error) => {
          console.error('Error fetching user data:', error);
        });
    }

    // Subscribe to unread messages count
    const unsubscribe = firebase.firestore().collection('messages')
      .where('receiver', '==', user.uid)
      .where('read', '==', false)
      .onSnapshot((snapshot) => {
        setUnreadMessages(snapshot.size);
      });

    return () => unsubscribe();
  }, [user]);

  const collapseRef = useRef(null); // Ref to CollapseComponent

  // Close collapse when clicking outside of it
  useEffect(() => {
    function handleClickOutside(event) {
      if (collapseRef.current && !collapseRef.current.contains(event.target)) {
        setShowCollapse(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogoClick = () => {
    setShowCollapse(!showCollapse); // Toggle collapse state
  };

  const handleLogoKeyPress = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      setShowCollapse(!showCollapse); // Toggle collapse state on Enter or Space key press
    }
  };

  return (
    <div>
      <Navbar collapseOnSelect expand="lg" variant="dark" className="navbar-gradient">
        <Container>
          <div
            className="navbar-logo"
            onClick={handleLogoClick}
            onKeyPress={handleLogoKeyPress}
            role="button"
            tabIndex={0}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/clubby.png" alt="Logo" width="80" height="80" />
          </div>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse>
            <Nav className="mx-auto">
              <Button className="button2 mx-2" href="/">Courses</Button>
              <Button className="button2 mx-2" href="/matches/matches">
                Matches
                {unreadMessages > 0 && <Badge variant="danger" className="notification-dot">{unreadMessages}</Badge>}
              </Button>
              <Button className="button2 mx-2" href="/matches/found">Find A Partner</Button>
            </Nav>
            <Nav>
              {userData && (
                <Nav.Link href="/profile">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className="profile-img" src={userData.image} alt={userData.name} />
                </Nav.Link>
              )}
              <Button variant="danger" onClick={signOut}>Sign Out</Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Render collapse content outside of Navbar */}
      {showCollapse && (
        <div className="collapse-window">
          <div ref={collapseRef} className="collapse-content">
            {/* Your collapse content here */}
          </div>
        </div>
      )}
    </div>
  );
}

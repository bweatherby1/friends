import React, { useEffect, useState, useRef } from 'react';
import {
  Navbar, Container, Nav, Button, Badge, Tabs, Tab,
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
  const [key, setKey] = useState('findMatch'); // default active tab key

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
            <Tabs
              id="controlled-tab-example"
              activeKey={key}
              onSelect={(k) => setKey(k)}
              className="mt-2"
            >
              <Tab eventKey="findMatch" title="Find and Match">
                <div className="tab-content">
                  <ul>
                    <li>
                      <h2 className="section-header">How to find and match with a partner</h2>
                      <p>- First, select at least one time on your profile(click the &quot;Update&quot; button if you have none selected.)</p>
                      <p>-Second, you will go to the &quot;Courses&quot; tab and click on the image of at least one course to turn it red, indicating you want to play that course.</p>
                      <p>- Third, you will click on the &quot;Find a partner&quot; tab.</p>
                      <p>- Fourth, you will be shown all the players matching your criteria. Here you will hover on that players card and scroll down to the bottom to click &quot;Link up&quot; if you are interested in playing with them.</p>
                      <p>- Lastly, you click the &quot;Matches&quot; tab to see your selected matches past and present.</p>
                    </li>
                  </ul>
                </div>
              </Tab>
              <Tab eventKey="messageMatch" title="Message a Match">
                <div className="tab-content">
                  <ul>
                    <li>
                      <h2 className="section-header">How to message a match</h2>
                      <p>- Assuming you have already made a match, first you click the &quot;Matches&quot; tab.</p>
                      <p>- Here you will see all of your past and current matches, simply hover the players card you want to message and scroll down to the bottom. Here you can click the &quot;Message&quot; button and you will then be able to chat with that player.</p>
                    </li>
                  </ul>
                </div>
              </Tab>
            </Tabs>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Navbar, Container, Nav, Button,
} from 'react-bootstrap';
import { signOut } from '../utils/auth';
import { useAuth } from '../utils/context/authContext'; // Importing auth context
import { getUserData } from '../api/userData'; // Importing function to fetch user data

export default function NavBar() {
  const { user } = useAuth(); // Using useAuth hook to get user data
  const [userData, setUserData] = useState(null);

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
  }, [user]);

  return (
    <Navbar collapseOnSelect expand="lg" variant="dark" className="navbar-gradient">
      <Container>
        <Link passHref href="/profile">
          <Navbar.Brand>
            {/* eslint-disable-next-line @next/next/no-img-element, @next/next/no-img-element */}
            <img src="/clubby.png" alt="Logo" width="80" height="80" />
          </Navbar.Brand>
        </Link>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse>
          <Nav className="mx-auto">
            <Link passHref href="/">
              <Button variant="warning" className="mx-2">Courses</Button>
            </Link>
            <Link passHref href="/">
              <Button variant="warning" className="mx-2">Favorites</Button>
            </Link>
            <Link passHref href="/course/new">
              <Button variant="warning" className="mx-2">Find A Partner</Button>
            </Link>
          </Nav>
          <Nav>
            {userData && (
              <Link passHref href="/profile">
                <Nav.Link>
                  {/* eslint-disable-next-line @next/next/no-img-element, @next/next/no-img-element */}
                  <img className="profile-img" src={userData.image} alt={userData.name} />
                </Nav.Link>
              </Link>
            )}
            <Button variant="danger" onClick={signOut}>Sign Out</Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

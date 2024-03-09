/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import {
  Navbar, Container, Nav, Button,
} from 'react-bootstrap';
import { signOut } from '../utils/auth';

export default function NavBar({ user }) {
  return (
    <Navbar collapseOnSelect expand="lg" variant="dark" className="navbar-gradient">
      <Container>
        <Link passHref href={`/user/${user.firebaseKey}`}>
          <Navbar.Brand>
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
            <Link passHref href="/profile">
              <Nav.Link><img className="profile-img" src={user.photoURL} alt={user.displayName} /></Nav.Link>
            </Link>
            <Button variant="danger" onClick={signOut}>Sign Out</Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

NavBar.propTypes = {
  user: PropTypes.shape({
    displayName: PropTypes.string,
    photoURL: PropTypes.string,
    firebaseKey: PropTypes.string,
  }).isRequired,
};

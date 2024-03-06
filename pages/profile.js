import React from 'react';
import { Button } from 'react-bootstrap';
import Link from 'next/link';
import { useAuth } from '../utils/context/authContext'; // Importing auth context

export default function ProfilePage() {
  const { user } = useAuth(); // Assuming you get the user from a context

  return (
    <div>
      <title>Profile</title>
      <meta name="description" content="User profile page" />
      <link rel="icon" href="/favicon.ico" />

      <main>
        <h1>{user.displayName}</h1>
        <p><img className="profilePage-img" src={user.photoURL} alt={user.displayName} /></p>
        <Link href={`/user/edit/${user.uid}`} passHref>
          <div>
            <Button variant="warning">UPDATE</Button>
          </div>
        </Link>
      </main>
    </div>
  );
}

/* eslint-disable @next/next/no-img-element */
// pages/profile.js
import React from 'react';
import { useAuth } from '../utils/context/authContext'; // Importing auth context

export default function ProfilePage() {
  const { user } = useAuth(); // Assuming you get the user from a context

  return (
    <div>
      <title>Profile</title>
      <meta name="description" content="User profile page" />
      <link rel="icon" href="/favicon.ico" />

      <main>
        <h1>Profile</h1>
        <p><img className="profilePage-img" src={user.photoURL} alt={user.displayName} /></p>
      </main>
    </div>
  );
}

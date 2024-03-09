import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import Link from 'next/link';
import { useAuth } from '../utils/context/authContext'; // Importing auth context
import { getUserData } from '../api/userData'; // Importing function to fetch user data

export default function ProfilePage() {
  const { user } = useAuth(); // Assuming you get the user from a context
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (user) {
      // Fetch user data from Firestore
      getUserData(user.uid)
        .then((data) => {
          setUserData(data);
        })
        .catch((error) => {
          console.error('Error fetching user data:', error);
        });
    }
  }, [user]);

  if (!user || !userData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <title>Profile</title>
      <meta name="description" content="User profile page" />
      <link rel="icon" href="/favicon.ico" />

      <main>
        <h1>{userData.displayName}</h1>
        <p><img className="profilePage-img" src={userData.photoURL} alt={userData.displayName} /></p>
        <p>Bio: {userData.bio}</p>
        <p>Skill Level: {userData.skillLevel}</p>
        {/* Assuming selectedTimes is an array */}
        {userData.selectedTimes && Array.isArray(userData.selectedTimes) && (
          <p>Selected Times: {userData.selectedTimes.join(', ')}</p>
        )}
        <Link href={`/user/edit/${user.uid}`} passHref>
          <div>
            <Button variant="warning">UPDATE</Button>
          </div>
        </Link>
      </main>
    </div>
  );
}

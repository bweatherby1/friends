import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Button } from 'react-bootstrap';
import Link from 'next/link';
import { useAuth } from '../utils/context/authContext';
import { deleteUser, getUserData } from '../api/userData';

export default function ProfilePage() {
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);
  const router = useRouter();

  const deleteThisUser = () => {
    if (window.confirm(`Delete ${userData.name} profile?`)) {
      deleteUser(userData.uid)
        .then(() => {
          alert('User deleted successfully.');
          router.push('/login');
        })
        .catch((error) => {
          console.error('Error deleting user:', error);
          alert('An error occurred while deleting the user. Please try again later.');
        });
    }
  };

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

  if (!user || !userData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <title>Profile</title>
      <meta name="description" content="User profile page" />
      <link rel="icon" href="/favicon.ico" />

      <main>
        <h1>{userData.name}</h1>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <p><img className="profilePage-img" src={userData.image} alt={userData.displayName} /></p>
        <p>Bio: {userData.bio}</p>
        <p>Skill Level: {userData.skillLevel}</p>
        {userData.selectedTimes && Array.isArray(userData.selectedTimes) && (
          <p>Selected Times: {userData.selectedTimes.join(', ')}</p>
        )}
        <Link href={`/user/edit/edit?uid=${user.uid}`} passHref>
          <div>
            <Button variant="warning">UPDATE</Button>
          </div>
        </Link>
        <Button variant="danger" onClick={deleteThisUser} className="m-2">
          DELETE
        </Button>
      </main>
    </div>
  );
}

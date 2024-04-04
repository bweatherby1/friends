import React, { useState, useEffect } from 'react';
import { getSingleUser, getUsers } from '../../api/userData';
import { useAuth } from '../../utils/context/authContext';
import UserCards from '../../components/UserCards';
import DateTimeComponent from '../../components/dateTime';

export default function FoundPage() {
  const { user } = useAuth();
  const [currentUser, setCurrentUser] = useState(null);
  const [foundUsers, setFoundUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchCompleted, setSearchCompleted] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const singleUser = await getSingleUser(user.uid);
        setCurrentUser(singleUser);
      } catch (error) {
        console.error('Error fetching single user:', error);
      }
    };

    fetchUserData();

    if (!searchCompleted && currentUser) {
      Promise.all([getUsers()])
        .then(([users]) => {
          const otherUsers = users.filter((u) => u.uid !== user.uid);
          const matches = currentUser.matches.map((match) => match.uid);
          const filteredUsers = otherUsers.filter((otherUser) => !matches.includes(otherUser.uid));
          setFoundUsers(filteredUsers);
          setLoading(false);
          setSearchCompleted(true);
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
          setLoading(false);
          setSearchCompleted(true);
        });
    }
  }, [user.uid, currentUser, searchCompleted]);

  // Function to handle link-up click
  const handleLinkUpClick = () => {
    // Perform actions for link-up click
    // For example, you can update state or perform an API call
    // In this case, we'll just reload the page
    window.location.reload();
  };

  return (
    <div>
      <h1>Users Found for <DateTimeComponent /></h1>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
        {loading && <p>Loading...</p>}
        {!loading && foundUsers.length === 0 && <p>No matches found.</p>}
        {!loading
          && foundUsers.map((foundUser) => (
            <UserCards
              key={foundUser.uid}
              users={[foundUser]}
              style={{ flex: '0 0 30%', marginBottom: '20px' }}
              onLinkUpClick={handleLinkUpClick} // Pass the handler to the UserCards component
            />
          ))}
      </div>
    </div>
  );
}

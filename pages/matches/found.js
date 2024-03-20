import React, { useState, useEffect } from 'react';
import { getSingleUser, getUsers } from '../../api/userData';
import { useAuth } from '../../utils/context/authContext';
import UserCards from '../../components/UserCards';

export default function MatchPage() {
  const { user } = useAuth(); // Retrieve the current user
  const [currentUser, setCurrentUser] = useState(null); // State to store current user
  const [matchedUsers, setMatchedUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const matchUsers = (user1, user2) => {
    if (!user1 || !user2) {
      return false; // Return false if either user is null or undefined
    }

    const selectedTimesUser1 = user1.selectedTimes || [];
    const selectedTimesUser2 = user2.selectedTimes || [];
    return selectedTimesUser1.some((time) => selectedTimesUser2.includes(time));
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const singleUser = await getSingleUser(user.uid); // Fetch single user data
        setCurrentUser(singleUser); // Store single user data in state
      } catch (error) {
        console.error('Error fetching single user:', error);
      }
    };

    fetchUserData(); // Fetch single user data

    getUsers()
      .then((users) => {
        console.warn('All users:', users);
        const otherUsers = users.filter((u) => u.uid !== user.uid);
        console.warn('Other users:', otherUsers);
        const matches = otherUsers.filter((otherUser) => matchUsers(currentUser, otherUser)); // Use currentUser for matching
        console.warn('Matched users:', matches); // Check if matching works
        setMatchedUsers(matches);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
        setLoading(false);
      });
  }, [user, currentUser]); // Add currentUser to dependency array

  return (
    <div>
      <h1>Matched Users</h1>
      {loading && <p>Loading...</p>}
      {!loading && matchedUsers.length === 0 && <p>No matches found.</p>}
      {!loading && matchedUsers.length > 0 && <UserCards users={matchedUsers} />}
    </div>
  );
}

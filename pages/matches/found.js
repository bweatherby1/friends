import React, { useState, useEffect } from 'react';
import { getSingleUser, getUsers } from '../../api/userData';
import { useAuth } from '../../utils/context/authContext';
import UserCards from '../../components/UserCards';
import { getCourses } from '../../api/courseData';

export default function MatchPage() {
  const { user } = useAuth();
  const [currentUser, setCurrentUser] = useState(null);
  const [matchedUsers, setMatchedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchCompleted, setSearchCompleted] = useState(false);

  useEffect(() => {
    const matchUsers = (user1, user2, courses) => {
      if (!user1 || !user2 || !courses) {
        return false;
      }

      const selectedTimesUser1 = user1.selectedTimes || [];
      const selectedTimesUser2 = user2.selectedTimes || [];
      const commonTimes = selectedTimesUser1.some((time) => selectedTimesUser2.includes(time));

      const redCoursesUser1 = courses.filter((course) => course.color && course.color[user1.uid] === 'red').map((course) => course.firebaseKey);
      const redCoursesUser2 = courses.filter((course) => course.color && course.color[user2.uid] === 'red').map((course) => course.firebaseKey);
      const commonRedCourses = redCoursesUser1.some((course) => redCoursesUser2.includes(course));

      return commonTimes && commonRedCourses;
    };

    const fetchUserData = async () => {
      try {
        const singleUser = await getSingleUser(user.uid);
        setCurrentUser(singleUser);
      } catch (error) {
        console.error('Error fetching single user:', error);
      }
    };

    fetchUserData();

    if (!searchCompleted) {
      Promise.all([getCourses(), getUsers()])
        .then(([courses, users]) => {
          const otherUsers = users.filter((u) => u.uid !== user.uid);
          const matches = otherUsers.filter((otherUser) => matchUsers(currentUser, otherUser, courses));
          setMatchedUsers(matches);
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

  return (
    <div>
      <h1>Matched Users</h1>
      {loading && <p>Loading...</p>}
      {!loading && matchedUsers.length === 3 && <p>No matches found.</p>}
      {!loading && matchedUsers.length > 0 && <UserCards users={matchedUsers} />}
    </div>
  );
}

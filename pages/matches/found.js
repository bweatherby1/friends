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
  const [allCourses, setAllCourses] = useState([]);

  useEffect(() => {
    const matchUsers = (user1, user2) => {
      if (!user1 || !user2 || !allCourses) {
        return false;
      }

      const selectedTimesUser1 = user1.selectedTimes || [];
      const selectedTimesUser2 = user2.selectedTimes || [];
      const commonTimes = selectedTimesUser1.some((time) => selectedTimesUser2.includes(time));

      const redCoursesUser1 = allCourses.filter((course) => course.color && course.color[user1.uid] === 'red').map((course) => course.firebaseKey);
      const redCoursesUser2 = allCourses.filter((course) => course.color && course.color[user2.uid] === 'red').map((course) => course.firebaseKey);
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

    getCourses()
      .then((courses) => {
        setAllCourses(courses);
      })
      .catch((error) => {
        console.error('Error fetching courses:', error);
      });

    getUsers()
      .then((users) => {
        const otherUsers = users.filter((u) => u.uid !== user.uid);
        const matches = otherUsers.filter((otherUser) => matchUsers(currentUser, otherUser));
        console.warn('Matched users:', matches);
        setMatchedUsers(matches);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
        setLoading(false);
      });
  }, [user, currentUser, allCourses]);

  return (
    <div>
      <h1>Matched Users</h1>
      {loading && <p>Loading...</p>}
      {!loading && matchedUsers.length === 0 && <p>No matches found.</p>}
      {!loading && matchedUsers.length > 0 && <UserCards users={matchedUsers} />}
    </div>
  );
}

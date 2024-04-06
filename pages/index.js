import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { Button } from 'react-bootstrap';
import { getCourses } from '../api/courseData';
import { useAuth } from '../utils/context/authContext';
import CourseCard from '../components/CourseCard';

function Home() {
  const [courses, setCourses] = useState([]);
  const { user } = useAuth();

  const getAllTheCourses = useCallback(() => {
    getCourses(user.uid).then(setCourses);
  }, [user.uid]); // Dependency added: user.uid

  useEffect(() => {
    getAllTheCourses();
  }, [getAllTheCourses]); // Dependency added: getAllTheCourses

  const handleUpdate = () => {
    getAllTheCourses();
  };

  return (
    <div className="text-center my-4">
      {/* Render "Add A Course" button only for the specific user */}
      {user && user.uid === 'GxuQ9rUDKaQ41UFywrNkZuTzT5v2' && (
        <Link href="/course/new" passHref>
          <Button className="addCourse">Add A Course</Button>
        </Link>
      )}

      <div className="d-flex flex-wrap">
        {courses.map((course) => (
          <CourseCard
            key={course.firebaseKey}
            courseObj={course}
            onUpdate={handleUpdate}
          />
        ))}
      </div>
    </div>
  );
}

export default Home;

/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from 'react-bootstrap';
import { getCourses } from '../api/courseData';
import { useAuth } from '../utils/context/authContext';
import CourseCard from '../components/CourseCard';

function Home() {
  // TODO: Set a state for courses
  const [courses, setCourses] = useState([]);

  // TODO: Get user ID using useAuth Hook
  const { user } = useAuth();

  // TODO: create a function that makes the API call to get all the books
  const getAllTheCourses = () => {
    getCourses(user.uid).then(setCourses);
  };

  // TODO: make the call to the API to get all the books on component render
  useEffect(() => {
    getAllTheCourses();
  }, []);

  return (
    <div className="text-center my-4">
      <Link href="/course/new" passHref>
        <Button className="addCourse">Add A Course</Button>
      </Link>
      <div className="d-flex flex-wrap">
        {/* TODO: map over books here using BookCard component */}
        {courses.map((course) => (
          <CourseCard key={course.firebaseKey} courseObj={course} onUpdate={getAllTheCourses} />
        ))}
      </div>

    </div>
  );
}

export default Home;

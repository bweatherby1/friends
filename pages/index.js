/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from 'react-bootstrap';
import { getCourses } from '../api/courseData';
import { useAuth } from '../utils/context/authContext';
import CourseCard from '../components/CourseCard';

function Home() {
  const [courses, setCourses] = useState([]);
  const { user } = useAuth();

  const getAllTheCourses = () => {
    getCourses(user.uid).then(setCourses);
  };

  useEffect(() => {
    getAllTheCourses();
  }, []);

  return (
    <div className="text-center my-4">
      <Link href="/course/new" passHref>
        <Button className="addCourse">Add A Course</Button>
      </Link>
      <div className="d-flex flex-wrap">
        {courses.map((course) => (
          <CourseCard key={course.firebaseKey} courseObj={course} onUpdate={getAllTheCourses} />
        ))}
      </div>

    </div>
  );
}

export default Home;

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getSingleCourse } from '../../../api/courseData';
import CourseForm from '../../../components/forms/CourseForm';

export default function EditCourse() {
  const [editItem, setEditItem] = useState({}); // Change from [] to {}
  const router = useRouter();
  const { firebaseKey } = router.query;

  useEffect(() => {
    if (firebaseKey) {
      getSingleCourse(firebaseKey)
        .then((data) => {
          setEditItem(data);
        })
        .catch((error) => {
          console.error('Error fetching course data:', error);
        });
    }
  }, [firebaseKey]);

  return <CourseForm obj={editItem} />;
}

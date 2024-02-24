import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getSingleCourse } from '../../../api/courseData';
import CourseForm from '../../../components/forms/CourseForm';

export default function EditCourse() {
  const [editItem, setEditItem] = useState({});
  const router = useRouter();
  // TODO: grab the firebasekey
  const { firebaseKey } = router.query;

  // TODO: make a call to the API to get the book data
  useEffect(() => {
    getSingleCourse(firebaseKey).then(setEditItem);
  }, [firebaseKey]);

  // TODO: pass object to form
  return (<CourseForm obj={editItem} />);
}

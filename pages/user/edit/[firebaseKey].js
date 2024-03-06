import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getSingleUser } from '../../../api/userData';
import UserForm from '../../../components/forms/UserForm';

export default function EditUser() {
  const [editItem, setEditItem] = useState({}); // Change from [] to {}
  const router = useRouter();
  const { firebaseKey } = router.query;

  useEffect(() => {
    if (firebaseKey) {
      getSingleUser(firebaseKey)
        .then((data) => {
          setEditItem(data);
        })
        .catch((error) => {
          console.error('Error fetching course data:', error);
        });
    }
  }, [firebaseKey]);

  return <UserForm obj={editItem} />;
}

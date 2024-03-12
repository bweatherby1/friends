import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getSingleUser } from '../../../api/userData';
import UserForm from '../../../components/forms/UserForm';

export default function EditUser() {
  const [editItem, setEditItem] = useState({}); // Change from [] to {}
  const router = useRouter();
  const { uid } = router.query;

  useEffect(() => {
    if (uid) {
      getSingleUser(uid)
        .then((data) => {
          setEditItem(data);
        })
        .catch((error) => {
          console.error('Error fetching user data:', error);
        });
    }
  }, [uid]);

  return <UserForm obj={editItem} />;
}

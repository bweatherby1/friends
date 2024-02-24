/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import viewCourseDetails from '../../api/mergedData';

export default function ViewCourse() {
  const [courseDetails, setCourseDetails] = useState({});
  const router = useRouter();

  // TODO: grab firebaseKey from url
  const { firebaseKey } = router.query;

  // TODO: make call to API layer to get the data
  useEffect(() => {
    viewCourseDetails(firebaseKey).then(setCourseDetails);
  }, [firebaseKey]);

  return (
    <div className="mt-5 d-flex flex-wrap">
      <div className="d-flex flex-column">
        <img src={courseDetails.image} alt={courseDetails.name} style={{ width: '300px' }} />
      </div>
      <div className="text-white ms-5 details">
        <h5>
          {courseDetails.title} by {courseDetails.authorObject?.first_name} {courseDetails.authorObject?.last_name}
          {courseDetails.authorObject?.favorite ? ' 🤍' : ''}
        </h5>
        Author Email: <a href={`mailto:${courseDetails.authorObject?.email}`}>{courseDetails.authorObject?.email}</a>
        <p>{courseDetails.description || ''}</p>
        <hr />
        <p>
          {courseDetails.sale
            ? `🏷️ Sale $${courseDetails.price}`
            : `$${courseDetails.price}`}
        </p>
      </div>
    </div>
  );
}

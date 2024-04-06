/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { viewCourseDetails } from '../../api/mergedData';

export default function ViewCourse() {
  const [courseDetails, setCourseDetails] = useState({});
  const router = useRouter();

  const { firebaseKey } = router.query;

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
          {courseDetails.name}
        </h5>
        <p>{courseDetails.description}</p>
        <hr />
        <p>{courseDetails.address}</p>
      </div>
    </div>
  );
}

/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import PropTypes from 'react-bootstrap/esm/Image';
import viewUserDetails from '../../api/mergedData';

export default function ViewUser() {
  const [userDetails, setUserDetails] = useState({});
  const router = useRouter();

  // TODO: grab firebaseKey from url
  const { uid } = router.query;

  // TODO: make call to API layer to get the data
  useEffect(() => {
    viewUserDetails(uid).then(setUserDetails);
  }, [uid]);

  return (
    <div className="mt-5 d-flex flex-wrap">
      <div className="d-flex flex-column">
        <img src={userDetails.image} alt={userDetails.name} style={{ width: '300px' }} />
      </div>
      <div className="text-white ms-5 details">
        <h5>
          {userDetails.name}
        </h5>
        <p>{userDetails.bio}</p>
        <hr />
        <p>{userDetails.skillLevel}</p>
        <hr />
        <p>{userDetails.selectedTimes}</p>
      </div>
    </div>
  );
}

ViewUser.defaultProps = {
  userObj: {
    image: '',
    name: '',
    bio: '',
    skillLevel: '',
    selectedTimes: [],
    firebaseKey: '',
  },
};

ViewUser.propTypes = {
  userObj: PropTypes.shape({
    image: PropTypes.string,
    name: PropTypes.string,
    bio: PropTypes.string,
    skillLevel: PropTypes.string,
    selectedTimes: PropTypes.arrayOf(PropTypes.string),
    firebaseKey: PropTypes.string,
  }),
};

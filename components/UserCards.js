import React from 'react';
import PropTypes from 'prop-types';
import { Card } from 'react-bootstrap';

export default function UserCards({ users }) {
  const handleCardClick = (uid) => {
    // Handle card click event if needed
    console.warn('Clicked on user with UID:', uid);
  };

  return (
    <div className="user-cards">
      {users.map((userObj) => (
        <Card
          key={userObj.uid} // Assuming userObj has a unique identifier like uid
          style={{ width: '18rem', margin: '10px', backgroundColor: '#f0f0f0' }} // Set background color dynamically
          onClick={() => handleCardClick(userObj.uid)} // Handle click event
        >
          <Card.Img variant="top" src={userObj.image} alt={userObj.name} style={{ height: '300px' }} />
          <Card.Body>
            <Card.Title>{userObj.name}</Card.Title>
            <p className="card-text">{userObj.bio}</p>
            <p className="card-text">Skill Level: {userObj.skillLevel}</p>
            {userObj.selectedTimes && Array.isArray(userObj.selectedTimes) && (
              <p className="card-text">Selected Times: {userObj.selectedTimes.join(', ')}</p>
            )}
            <p className="card-text bold">{userObj.address}</p>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
}

UserCards.propTypes = {
  users: PropTypes.arrayOf(
    PropTypes.shape({
      image: PropTypes.string,
      name: PropTypes.string,
      bio: PropTypes.string,
      skillLevel: PropTypes.string,
      selectedTimes: PropTypes.arrayOf(PropTypes.string),
      uid: PropTypes.string,
    }),
  ).isRequired,
};

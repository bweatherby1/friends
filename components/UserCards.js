import React from 'react';
import PropTypes from 'prop-types';
import { Button, Card } from 'react-bootstrap';
import Link from 'next/link';

export default function UserCards({ users }) {
  const handleCardClick = (uid) => {
    // Handle card click event if needed
    console.warn('Clicked on user with UID:', uid);
  };

  return (
    <div className="user-cards">
      {users.map((userObj) => (
        <Card
          key={userObj.uid}
          style={{ width: '18rem', margin: '10px', backgroundColor: '#f0f0f0' }}
          onClick={() => handleCardClick(userObj.uid)}
        >
          <Card.Img variant="top" src={userObj.image} alt={userObj.name} style={{ height: '300px' }} />
          <Card.Body>
            <Card.Title>{userObj.name}</Card.Title>
            <p className="card-text">{userObj.bio}</p>
            <p className="card-text">Skill Level: {userObj.skillLevel}</p>
            {userObj.selectedTimes && Array.isArray(userObj.selectedTimes) && (
              <p className="card-text">Selected Times: {userObj.selectedTimes.join(', ')}</p>
            )}
            <Link href="/" passHref>
              <Button className="linkUp">Link Up!</Button>
            </Link>
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

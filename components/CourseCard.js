import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Link from 'next/link';
import { deleteCourse, updateCourse } from '../api/courseData';
import { useAuth } from '../utils/context/authContext';

function CourseCard({ courseObj, onUpdate }) {
  const { user } = useAuth(); // Retrieve the current user
  const [cardColor, setCardColor] = useState('lightblue');
  const [isHovering, setIsHovering] = useState(false); // State to track hover
  const cardRef = useRef(null);

  useEffect(() => {
    if (user && user.uid) {
      const userColor = courseObj.color && courseObj.color[user.uid];
      setCardColor(userColor || 'lightblue');
    }
  }, [user, courseObj]);

  const handleCardClick = (event) => {
    // Check if the clicked element is the card image
    if (event.target.tagName === 'IMG' && event.currentTarget === cardRef.current) {
      const newColor = cardColor === 'lightblue' ? 'red' : 'lightblue';
      setCardColor(newColor);
      updateCourse({ ...courseObj, color: { ...courseObj.color, [user.uid]: newColor } });
    }
  };

  const deleteThisCourse = () => {
    if (window.confirm(`Delete ${courseObj.name} from your courses?`)) {
      deleteCourse(courseObj.firebaseKey).then(() => onUpdate());
    }
  };

  return (
    <Card
      className="card2"
      ref={cardRef} // Set the ref to the card component
      key={courseObj.firebaseKey}
      style={{ width: '18rem', margin: '10px', backgroundColor: cardColor }}
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovering(true)} // Handle hover
      onMouseLeave={() => setIsHovering(false)} // Handle mouse leave
    >
      <Card.Img
        variant="top"
        src={courseObj.image}
        alt={courseObj.name}
        style={{
          height: '300px',
          transition: 'all 0.3s ease-in-out',
          transform: isHovering ? 'scale(0.5)' : 'scale(1)',
        }}
      />
      <Card.Body>
        <Card.Title>{courseObj.name}</Card.Title>
        {/* Conditional rendering based on hover state */}
        {isHovering && (
          <div className="card-info">
            <p className="card-text bold">{courseObj.address}</p>
            <p>
              <Link href={`/course/${courseObj.firebaseKey}`} passHref>
                <Button variant="primary" className="m-2">VIEW COURSE DETAILS</Button>
              </Link>
              {/* Check if the user is the owner of the course */}
              {user && user.uid === 'GxuQ9rUDKaQ41UFywrNkZuTzT5v2' && (
                <>
                  <Link href={`/course/edit/${courseObj.firebaseKey}`} passHref>
                    <Button variant="warning">UPDATE</Button>
                  </Link>
                  <Button variant="danger" onClick={deleteThisCourse} className="m-2">
                    DELETE
                  </Button>
                </>
              )}
            </p>
          </div>
        )}
      </Card.Body>
    </Card>
  );
}

CourseCard.propTypes = {
  courseObj: PropTypes.shape({
    image: PropTypes.string,
    name: PropTypes.string,
    address: PropTypes.string,
    firebaseKey: PropTypes.string,
    color: PropTypes.objectOf(PropTypes.string),
    ownerUid: PropTypes.string, // Assuming ownerUid is present in courseObj
  }).isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export default CourseCard;

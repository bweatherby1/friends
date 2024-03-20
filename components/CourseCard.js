import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Link from 'next/link';
import { deleteCourse, updateCourse } from '../api/courseData';
import { useAuth } from '../utils/context/authContext'; // Import the auth context or hook

function CourseCard({ courseObj, onUpdate }) {
  const { user } = useAuth(); // Retrieve the current user
  const [cardColor, setCardColor] = useState('lightblue'); // Set initial color to lightblue

  useEffect(() => {
    // Fetch the color associated with the current user's UID
    if (user && user.uid) {
      const userColor = courseObj.color && courseObj.color[user.uid];
      setCardColor(userColor || 'lightblue'); // If user hasn't chosen a color, default to lightblue
    }
  }, [user, courseObj]);

  const handleCardClick = () => {
    const newColor = cardColor === 'lightblue' ? 'red' : 'lightblue';
    setCardColor(newColor);
    updateCourse({ ...courseObj, color: { ...courseObj.color, [user.uid]: newColor } });
  };

  const deleteThisCourse = () => {
    if (window.confirm(`Delete ${courseObj.name} from your courses?`)) {
      deleteCourse(courseObj.firebaseKey).then(() => onUpdate());
    }
  };

  return (
    <Card
      key={courseObj.firebaseKey}
      style={{ width: '18rem', margin: '10px', backgroundColor: cardColor }} // Set background color dynamically
      onClick={handleCardClick} // Handle click event
    >
      <Card.Img variant="top" src={courseObj.image} alt={courseObj.name} style={{ height: '300px' }} />
      <Card.Body>
        <Card.Title>{courseObj.name}</Card.Title>
        <p className="card-text bold">{courseObj.address}</p>
        <p>
          <Link href={`/course/${courseObj.firebaseKey}`} passHref>
            <Button variant="primary" className="m-2">VIEW COURSE DETAILS</Button>
          </Link>
        </p>
        <Link href={`/course/edit/${courseObj.firebaseKey}`} passHref>
          <Button variant="warning">UPDATE</Button>
        </Link>
        <Button variant="danger" onClick={deleteThisCourse} className="m-2">
          DELETE
        </Button>
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
    color: PropTypes.objectOf(PropTypes.string), // Color is an object containing user IDs and their chosen colors
  }).isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export default CourseCard;

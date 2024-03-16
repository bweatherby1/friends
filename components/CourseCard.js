import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Link from 'next/link';
import { deleteCourse } from '../api/courseData';

function CourseCard({ courseObj, onUpdate }) {
  const [isClicked, setIsClicked] = useState(false);

  const deleteThisCourse = () => {
    if (window.confirm(`Delete ${courseObj.name} from your courses?`)) {
      deleteCourse(courseObj.firebaseKey).then(() => onUpdate());
    }
  };

  const handleCardClick = () => {
    setIsClicked(!isClicked);
  };

  return (
    <Card
      key={courseObj.firebaseKey}
      style={{ width: '18rem', margin: '10px', backgroundColor: isClicked ? 'red' : 'white' }}
      onClick={handleCardClick}
    >
      {/* <Form.Check className="playCheck" aria-label="option 1" /> */}
      <Card.Img variant="top" src={courseObj.image} alt={courseObj.name} style={{ height: '300px' }} />
      <Card.Body>
        <Card.Title>{courseObj.name}</Card.Title>
        <p className="card-text bold">{courseObj.address}</p>
        <p>
          <Link href={`/course/${courseObj.firebaseKey}`} passHref>
            <Button variant="primary" className="m-2">
              VIEW COURSE DETAILS
            </Button>
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
  }).isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export default CourseCard;

import React from 'react';
import { Form } from 'react-bootstrap';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Link from 'next/link';
import { deleteCourse } from '../api/courseData';

function CourseCard({ courseObj, onUpdate }) {
  // FOR DELETE, WE NEED TO REMOVE THE BOOK AND HAVE THE VIEW RERENDER,
  // SO WE PASS THE FUNCTION FROM THE PARENT THAT GETS THE BOOKS
  const deleteThisCourse = () => {
    if (window.confirm(`Delete ${courseObj.name}?`)) {
      deleteCourse(courseObj.firebaseKey).then(() => onUpdate());
    }
  };

  return (
    <Card style={{ width: '18rem', margin: '10px' }}>
      <Form.Check aria-label="option 1" />
      <Card.Img variant="top" src={courseObj.image} alt={courseObj.name} style={{ height: '300px' }} />
      <Card.Body>
        <Card.Title>{courseObj.name}</Card.Title>
        <p className="card-text bold">{courseObj.address}</p>
        <p>{courseObj.description}</p>
        {/* DYNAMIC LINK TO VIEW THE Course DETAILS  */}
        <p>
          <Link href={`/course/${courseObj.firebaseKey}`} passHref>
            <Button variant="primary" className="m-2">VIEW COURSE DETAILS</Button>
          </Link>
        </p>
        {/* DYNAMIC LINK TO EDIT THE BOOK DETAILS  */}
        <Link href={`/book/edit/${courseObj.firebaseKey}`} passHref>
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
    description: PropTypes.string,
    firebaseKey: PropTypes.string,
  }).isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export default CourseCard;

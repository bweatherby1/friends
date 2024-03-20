import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import { Button } from 'react-bootstrap';
import { useAuth } from '../../utils/context/authContext';
import { createCourse, updateCourse } from '../../api/courseData';

const initialState = {
  courseId: '', // Use firebaseKey as courseId
  image: '',
  name: '',
  address: '',
  description: '',
};

function CourseForm({ obj }) {
  const [formInput, setFormInput] = useState(initialState);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (obj && obj.firebaseKey) {
      setFormInput(obj);
    } else {
      setFormInput({
        ...initialState,
        courseId: '', // Leave courseId empty for new course, as firebaseKey will be used
      });
    }
  }, [obj]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormInput((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (obj.firebaseKey) {
      updateCourse(formInput).then(() => router.push(`/course/${obj.firebaseKey}`));
    } else {
      const payload = { ...formInput, uid: user.uid };
      createCourse(payload).then(({ name }) => {
        const patchPayload = { ...payload, firebaseKey: name, courseId: name }; // Use firebaseKey as courseId for new course
        updateCourse(patchPayload).then(() => {
          router.push('/');
        });
      });
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <h2 className="text-white mt-5">{obj && obj.firebaseKey ? 'Update' : 'Create'} Course</h2>

      <FloatingLabel controlId="floatingInput1" label="Course Name" className="mb-3 1">
        <Form.Control
          type="text"
          placeholder="Enter Club Name"
          name="name"
          value={formInput.name}
          onChange={handleChange}
          required
          autoComplete="off"
        />
      </FloatingLabel>

      <FloatingLabel controlId="floatingInput3" label="Course Address" className="mb-3 2">
        <Form.Control
          type="text"
          placeholder="Enter Club "
          name="address"
          value={formInput.address}
          onChange={handleChange}
          required
          autoComplete="off"
        />
      </FloatingLabel>

      <FloatingLabel controlId="floatingInput2" label="Course Image" className="mb-3 3">
        <Form.Control
          type="url"
          placeholder="Enter an image url"
          name="image"
          value={formInput.image}
          onChange={handleChange}
          required
        />
      </FloatingLabel>

      <FloatingLabel controlId="floatingTextarea" label="Description" className="mb-3">
        <Form.Control
          as="textarea"
          placeholder="Description"
          style={{ height: '100px' }}
          name="description"
          value={formInput.description}
          onChange={handleChange}
          required
        />
      </FloatingLabel>

      <Button type="submit">{obj && obj.firebaseKey ? 'Update' : 'Create'} Course</Button>
    </Form>
  );
}

CourseForm.propTypes = {
  obj: PropTypes.shape({
    courseId: PropTypes.string,
    image: PropTypes.string,
    name: PropTypes.string,
    address: PropTypes.string,
    description: PropTypes.string,
    firebaseKey: PropTypes.string,
  }),
};

CourseForm.defaultProps = {
  obj: initialState,
};

export default CourseForm;

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import { Button } from 'react-bootstrap';
import { useAuth } from '../../utils/context/authContext';
import { createUser, updateUser } from '../../api/userData';

const initialState = {
  image: '',
  name: '',
  address: '',
  description: '',
};

function UserForm({ obj }) {
  const [formInput, setFormInput] = useState(initialState);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (obj && obj.firebaseKey) {
      setFormInput(obj);
    } else {
      setFormInput(initialState);
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
      updateUser(formInput).then(() => router.push(`/user/${obj.firebaseKey}`));
    } else {
      const payload = { ...formInput, uid: user.uid };
      createUser(payload).then(({ name }) => {
        const patchPayload = { firebaseKey: name };
        updateUser(patchPayload).then(() => {
          router.push('/');
        });
      });
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <h2 className="text-white mt-5">{obj && obj.firebaseKey ? 'Update' : 'Create'} Course</h2>

      {/* Name INPUT  */}
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

      {/* Address INPUT  */}
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

      {/* IMAGE INPUT  */}
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

      {/* DESCRIPTION TEXTAREA  */}
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

      {/* SUBMIT BUTTON  */}
      <Button type="submit">{obj && obj.firebaseKey ? 'Update' : 'Create'} Course</Button>
    </Form>
  );
}

UserForm.propTypes = {
  obj: PropTypes.shape({
    image: PropTypes.string,
    name: PropTypes.string,
    address: PropTypes.string,
    description: PropTypes.string,
    firebaseKey: PropTypes.string,
  }),
};

UserForm.defaultProps = {
  obj: initialState,
};

export default UserForm;

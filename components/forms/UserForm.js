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
  bio: '',
  skillLevel: '',
  selectedTimes: [],
};

function UserForm({ obj, uid }) {
  const [formInput, setFormInput] = useState(initialState);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (obj) {
      setFormInput(obj);
    } else {
      setFormInput(initialState);
    }
  }, [obj]);

  useEffect(() => {
    if (uid && user) {
      setFormInput((prevState) => ({
        ...prevState,
        uid,
      }));
    }
  }, [uid, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'skillLevel' || name === 'name' || name === 'bio' || name === 'image') {
      setFormInput((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    } else {
      const selectedTimes = Array.from(e.target.selectedOptions, (option) => option.value);
      setFormInput((prevState) => ({
        ...prevState,
        selectedTimes: selectedTimes || [],
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (obj && obj.uid) {
      updateUser(obj.uid, formInput).then(() => router.push('/profile'));
    } else {
      createUser(formInput).then(() => {
        router.push('/profile');
      });
    }
  };

  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 6; hour <= 17; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        options.push(
          <option key={time} value={time}>
            {time}
          </option>,
        );
      }
    }
    return options;
  };

  return (
    <Form onSubmit={handleSubmit}>
      <h2 className="text-white mt-5">{obj && obj.uid ? 'Update' : 'Create'} Course</h2>

      <FloatingLabel controlId="floatingInput1" label="Your Name" className="mb-3">
        <Form.Control
          type="text"
          placeholder="Enter Name"
          name="name"
          value={formInput.name || ''} // Ensure value is not undefined
          onChange={handleChange}
          autoComplete="off"
        />
      </FloatingLabel>

      <FloatingLabel controlId="floatingInput2" label="Profile Pic" className="mb-3">
        <Form.Control
          type="url"
          placeholder="Enter an image url"
          name="image"
          value={formInput.image || ''} // Ensure value is not undefined
          onChange={handleChange}
        />
      </FloatingLabel>

      <FloatingLabel controlId="floatingTextarea" label="Bio" className="mb-3">
        <Form.Control
          as="textarea"
          placeholder="Bio"
          style={{ height: '100px' }}
          name="bio"
          value={formInput.bio || ''} // Ensure value is not undefined
          onChange={handleChange}
        />
      </FloatingLabel>

      <FloatingLabel controlId="skillLevel" label="Skill Level" className="mb-3">
        <Form.Select
          name="skillLevel"
          value={formInput.skillLevel || ''} // Ensure value is not undefined
          onChange={handleChange}
          required
        >
          <option value="">Select Skill Level</option>
          <option value="Youth">Youth</option>
          <option value="Novice">Novice</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
          <option value="Club Pro">Club Pro</option>
          <option value="Touring">Touring Pro</option>
        </Form.Select>
      </FloatingLabel>

      <FloatingLabel controlId="selectedTime" label="Select Time" className="mb-3">
        <Form.Select
          name="selectedTime"
          value={formInput.selectedTimes || []} // Ensure value is not undefined
          onChange={handleChange}
          required
          multiple
        >
          {generateTimeOptions()}
        </Form.Select>
      </FloatingLabel>

      <Button type="submit">{obj && obj.uid ? 'Update' : 'Create'} Golfer</Button>
    </Form>
  );
}

UserForm.propTypes = {
  obj: PropTypes.shape({
    image: PropTypes.string,
    name: PropTypes.string,
    bio: PropTypes.string,
    skillLevel: PropTypes.string,
    selectedTimes: PropTypes.arrayOf(PropTypes.string),
    uid: PropTypes.string,
  }),
  uid: PropTypes.string.isRequired,
};

UserForm.defaultProps = {
  obj: initialState,
};

export default UserForm;

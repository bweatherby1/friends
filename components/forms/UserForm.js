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
  selectedTimes: [], // Change to array for multiple times
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
    // If it's the skillLevel or name, handle as before
    if (name === 'skillLevel' || name === 'name' || name === 'bio' || name === 'image') {
      setFormInput((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    } else { // Otherwise, it's a multiple selection, handle accordingly
      const selectedTimes = Array.from(e.target.selectedOptions, (option) => option.value);
      setFormInput((prevState) => ({
        ...prevState,
        selectedTimes, // Using property shorthand
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (obj && obj.firebaseKey) {
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
      <h2 className="text-white mt-5">{obj && obj.firebaseKey ? 'Update' : 'Create'} Course</h2>

      {/* Name INPUT  */}
      <FloatingLabel controlId="floatingInput1" label="Your Name" className="mb-3">
        <Form.Control
          type="text"
          placeholder="Enter Name"
          name="name"
          value={formInput.name}
          onChange={handleChange}
          required
          autoComplete="off"
        />
      </FloatingLabel>

      {/* IMAGE INPUT  */}
      <FloatingLabel controlId="floatingInput2" label="Profile Pic" className="mb-3">
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
      <FloatingLabel controlId="floatingTextarea" label="Bio" className="mb-3">
        <Form.Control
          as="textarea"
          placeholder="Bio"
          style={{ height: '100px' }}
          name="bio"
          value={formInput.bio}
          onChange={handleChange}
          required
        />
      </FloatingLabel>

      {/* SKILL LEVEL DROPDOWN */}
      <FloatingLabel controlId="skillLevel" label="Skill Level" className="mb-3">
        <Form.Select
          name="skillLevel"
          value={formInput.skillLevel}
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

      {/* TIME SELECT BOX */}
      <FloatingLabel controlId="selectedTime" label="Select Time" className="mb-3">
        <Form.Select
          name="selectedTime"
          value={formInput.selectedTimes} // Set value to an array of selectedTimes
          onChange={handleChange}
          required
          multiple // Allow multiple selections
        >
          {generateTimeOptions()}
        </Form.Select>
      </FloatingLabel>

      {/* SUBMIT BUTTON  */}
      <Button type="submit">{obj && obj.firebaseKey ? 'Update' : 'Create'} Golfer</Button>
    </Form>
  );
}

UserForm.propTypes = {
  obj: PropTypes.shape({
    image: PropTypes.string,
    name: PropTypes.string,
    address: PropTypes.string,
    description: PropTypes.string,
    skillLevel: PropTypes.string,
    selectedTimes: PropTypes.arrayOf(PropTypes.string), // Update PropTypes to include selectedTimes as an array
    firebaseKey: PropTypes.string,
  }),
};

UserForm.defaultProps = {
  obj: initialState,
};

export default UserForm;

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
  uid: '',
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
    setFormInput((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormInput((prevState) => ({
        ...prevState,
        image: reader.result,
      }));
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleTimeSlotChange = (e) => {
    // eslint-disable-next-line no-unused-vars
    const { name, value, checked } = e.target;
    if (checked) {
      setFormInput((prevState) => ({
        ...prevState,
        selectedTimes: [...prevState.selectedTimes, value],
      }));
    } else {
      setFormInput((prevState) => ({
        ...prevState,
        selectedTimes: prevState.selectedTimes.filter((time) => time !== value),
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (obj && obj.uid) {
      updateUser(obj.uid, formInput).then(() => router.reload());
    } else {
      createUser(formInput).then(() => {
        router.reload();
      });
    }
  };

  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 6; hour <= 17; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const hour12 = hour % 12 || 12; // Convert hour to 12-hour format
        const ampm = hour < 12 ? 'AM' : 'PM'; // Determine AM/PM
        const time = `${hour12.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')} ${ampm}`;
        options.push(
          <Form.Check
            key={time}
            type="checkbox"
            id={time}
            label={time}
            name="selectedTimes"
            value={time}
            checked={formInput.selectedTimes && formInput.selectedTimes.includes(time)}
            onChange={handleTimeSlotChange}
          />,
        );
      }
    }
    return options;
  };

  return (
    <Form onSubmit={handleSubmit}>
      <h2 className="text-white mt-5">{obj && obj.uid ? 'Update' : 'Create'} Your Profile!</h2>

      <FloatingLabel controlId="name" label="Your Name" className="mb-3">
        <Form.Control
          type="text"
          placeholder="Enter Name"
          name="name" // Assign the 'name' attribute here
          value={formInput.name || ''}
          onChange={handleChange}
          autoComplete="off"
        />
      </FloatingLabel>

      <FloatingLabel controlId="floatingInput2" label="Profile Pic" className="mb-3">
        <Form.Control
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />
      </FloatingLabel>

      <FloatingLabel controlId="floatingTextarea" label="Bio" className="mb-3">
        <Form.Control
          as="textarea"
          placeholder="Bio"
          style={{ height: '100px' }}
          name="bio"
          value={formInput.bio || ''}
          onChange={handleChange}
        />
      </FloatingLabel>

      <FloatingLabel controlId="skillLevel" label="Skill Level" className="mb-3">
        <Form.Select
          name="skillLevel"
          value={formInput.skillLevel || ''}
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

      <Form.Group controlId="selectedTime" className="mb-3">
        {generateTimeOptions()}
      </Form.Group>

      <Button type="submit">{obj && obj.uid ? 'Update' : 'Create'} Profile</Button>
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
  uid: PropTypes.string,
};

UserForm.defaultProps = {
  obj: initialState,
  uid: '',
};

export default UserForm;

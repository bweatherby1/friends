import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import { Button } from 'react-bootstrap';
import { useAuth } from '../../utils/context/authContext';
import { createCourse, updateCourse } from '../../api/courseData';

const initialState = {
  image: '',
  name: '',
  address: '',
  description: '',
  // selectedTimes: [],
};

function CourseForm({ obj }) {
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

  // const handleTimeChange = (e) => {
  //   const { value, checked } = e.target;
  //   if (checked) {
  //     setFormInput((prevState) => ({
  //       ...prevState,
  //       selectedTimes: [...prevState.selectedTimes, value],
  //     }));
  //   } else {
  //     setFormInput((prevState) => ({
  //       ...prevState,
  //       selectedTimes: prevState.selectedTimes.filter((time) => time !== value),
  //     }));
  //   }
  // };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (obj.firebaseKey) {
      updateCourse(formInput).then(() => router.push(`/course/${obj.firebaseKey}`));
    } else {
      const payload = { ...formInput, uid: user.uid };
      createCourse(payload).then(({ name }) => {
        const patchPayload = { firebaseKey: name };
        updateCourse(patchPayload).then(() => {
          router.push('/');
        });
      });
    }
  };

  // const generateTimeOptions = () => {
  //   const options = [];
  //   let hour = 6;
  //   let minute = 0;
  //   while (hour <= 12) {
  //     const ampm = hour < 12 ? 'AM' : 'PM'; // Determine AM/PM
  //     // eslint-disable-next-line no-nested-ternary
  //     const hour12 = hour === 0 ? 12 : (hour > 12 ? hour - 12 : hour); // Convert to 12-hour format
  //     options.push(`${hour12.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')} ${ampm}`);
  //     minute += 30;
  //     if (minute === 60) {
  //       // eslint-disable-next-line no-plusplus
  //       hour++;
  //       minute = 0;
  //     }
  //   }
  //   return options;
  // };

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

      {/* AUTHOR SELECT
      <FloatingLabel controlId="floatingSelect" label="Author">
        <Form.Select
          aria-label="Author"
          name="author_id"
          onChange={handleChange}
          className="mb-3"
          value={obj.author_id} // FIXME: modify code to remove error
          required
        >
          <option value="">Select an Author</option>
          {
            authors.map((author) => (
              <option
                key={author.firebaseKey}
                value={author.firebaseKey}
              >
                {author.first_name} {author.last_name}
              </option>
            ))
          }
        </Form.Select>
      </FloatingLabel> */}

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

      {/* A WAY TO HANDLE UPDATES FOR TOGGLES, RADIOS, ETC
      <Form.Check
        className="text-white mb-3"
        type="switch"
        id="sale"
        name="sale"
        label="On Sale?"
        checked={formInput.sale}
        onChange={(e) => {
          setFormInput((prevState) => ({
            ...prevState,
            sale: e.target.checked,
          }));
        }}
      /> */}

      {/* Checkbox options for selecting multiple times
      <FloatingLabel controlId="floatingTimes" label="Select Times" className="mb-3">
        {generateTimeOptions().map((time) => (
          <Form.Check
            key={time}
            type="checkbox"
            id={time}
            label={time}
            value={time}
            checked={formInput.selectedTimes.includes(time)}
            onChange={handleTimeChange}
          />
        ))}
      </FloatingLabel> */}

      {/* SUBMIT BUTTON  */}
      <Button type="submit">{obj && obj.firebaseKey ? 'Update' : 'Create'} Course</Button>
    </Form>
  );
}

CourseForm.propTypes = {
  obj: PropTypes.shape({
    image: PropTypes.string,
    name: PropTypes.string,
    address: PropTypes.string,
    description: PropTypes.string,
    // selectedTimes: PropTypes.arrayOf(PropTypes.string),
    firebaseKey: PropTypes.string,
  }),
};

CourseForm.defaultProps = {
  obj: initialState,
};

export default CourseForm;

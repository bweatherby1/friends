import { clientCredentials } from '../utils/client';

const endpoint = clientCredentials.databaseURL;

const getCourses = () => new Promise((resolve, reject) => {
  fetch(`${endpoint}/courses.json`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data) => resolve(Object.values(data)))
    .catch(reject);
});

const deleteCourse = (firebaseKey) => new Promise((resolve, reject) => {
  fetch(`${endpoint}/courses/${firebaseKey}.json`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data) => resolve((data)))
    .catch(reject);
});

const getSingleCourse = (firebaseKey) => new Promise((resolve, reject) => {
  fetch(`${endpoint}/courses/${firebaseKey}.json`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data) => resolve(data))
    .catch(reject);
});

const createCourse = (payload) => new Promise((resolve, reject) => {
  fetch(`${endpoint}/courses.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
    .then((response) => response.json())
    .then((data) => resolve(data))
    .catch(reject);
});

const updateCourse = (payload) => new Promise((resolve, reject) => {
  fetch(`${endpoint}/courses/${payload.firebaseKey}.json`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
    .then((response) => response.json())
    .then((data) => resolve(data))
    .catch(reject);
});

export {
  getCourses,
  createCourse,
  deleteCourse,
  getSingleCourse,
  updateCourse,
};

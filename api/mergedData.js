import { getSingleCourse } from './courseData';
import { getSingleUser } from './userData';

const viewCourseDetails = (courseFirebaseKey) => new Promise((resolve, reject) => {
  Promise.all([getSingleCourse(courseFirebaseKey)])
    .then(([courseObject]) => {
      resolve({ ...courseObject });
    }).catch((error) => reject(error));
});

const viewUserDetails = (uid) => new Promise((resolve, reject) => {
  Promise.all([getSingleUser(uid)])
    .then(([userObject]) => {
      resolve({ ...userObject });
    }).catch((error) => reject(error));
});

export { viewCourseDetails, viewUserDetails };

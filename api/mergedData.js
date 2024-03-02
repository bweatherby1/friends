import { getSingleCourse } from './courseData';

const viewCourseDetails = (courseFirebaseKey) => new Promise((resolve, reject) => {
  Promise.all([getSingleCourse(courseFirebaseKey)])
    .then(([courseObject]) => {
      resolve({ ...courseObject });
    }).catch((error) => reject(error));
});

export default viewCourseDetails;

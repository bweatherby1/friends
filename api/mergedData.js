import { getSingleCourse } from './courseData';

const viewCourseDetails = (teamFirebaseKey) => new Promise((resolve, reject) => {
  Promise.all([getSingleCourse(teamFirebaseKey)])
    .then(([teamObject]) => {
      resolve({ ...teamObject });
    }).catch((error) => reject(error));
});

export default viewCourseDetails;

import { getSingleAuthor } from './authorData';
import { getSingleCourse } from './courseData';

const viewCourseDetails = (courseFirebaseKey) => new Promise((resolve, reject) => {
  getSingleCourse(courseFirebaseKey)
    .then((courseObject) => {
      getSingleAuthor(courseObject.author_id)
        .then((authorObject) => {
          resolve({ authorObject, ...courseObject });
        });
    }).catch((error) => reject(error));
});

export default viewCourseDetails;

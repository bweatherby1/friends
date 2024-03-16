import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useAuth } from './context/authContext';
import Loading from '../components/Loading';
import Signin from '../components/Signin';
import NavBar from '../components/NavBar';
import UserForm from '../components/forms/UserForm'; // Import UserForm component
import { getUserData } from '../api/userData';

const ViewDirectorBasedOnUserAuthStatus = ({ component: Component, pageProps }) => {
  const { user, userLoading } = useAuth();
  const [userDataLoading, setUserDataLoading] = useState(true);
  const [userHasData, setUserHasData] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        try {
          const userData = await getUserData(user.uid); // Fetch user data based on user ID
          setUserHasData(userData !== null); // Check if user data exists
        } catch (error) {
          console.error('Error fetching user data:', error);
        } finally {
          setUserDataLoading(false);
        }
      } else {
        // If user is null, set userDataLoading to false to stop loading
        setUserDataLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // if user state is null or user is still loading, then show loader
  if (userLoading || userDataLoading) {
    return <Loading />;
  }

  // If user is authenticated
  if (user) {
    // If user has no data in Firestore, show UserForm
    if (!userHasData) {
      return (
        <>
          <NavBar user={user} /> {/* NavBar only visible if user is logged in and is in every view */}
          <div className="container">
            <UserForm obj={null} uid={user.uid} />
          </div>
        </>
      );
    }

    // User has data in Firestore, show the component
    return (
      <>
        <NavBar user={user} />
        <div className="container">
          <Component {...pageProps} />
        </div>
      </>
    );
  }

  // User is not authenticated, redirect to Signin page
  return <Signin />;
};

export default ViewDirectorBasedOnUserAuthStatus;

ViewDirectorBasedOnUserAuthStatus.propTypes = {
  component: PropTypes.func.isRequired,
  pageProps: PropTypes.oneOfType([PropTypes.object]).isRequired,
};

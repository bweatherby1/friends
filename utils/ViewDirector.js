import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useAuth } from './context/authContext';
import Loading from '../components/Loading';
import Signin from '../components/Signin';
import NavBar from '../components/NavBar';
import UserForm from '../components/forms/UserForm';
import { getUserData } from '../api/userData';

const ViewDirectorBasedOnUserAuthStatus = ({ component: Component, pageProps }) => {
  const { user, userLoading } = useAuth();
  const [userDataLoading, setUserDataLoading] = useState(true);
  const [userHasData, setUserHasData] = useState(false);
  const [showUserForm, setShowUserForm] = useState(false);
  const [initialLoadDone, setInitialLoadDone] = useState(false); // New state to track initial load completion

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        try {
          const userData = await getUserData(user.uid);
          setUserHasData(userData !== null);
        } catch (error) {
          console.error('Error fetching user data:', error);
        } finally {
          setUserDataLoading(false);
        }
      } else {
        setUserHasData(false);
        setUserDataLoading(false);
      }
    };

    fetchData();
  }, [user]);

  useEffect(() => {
    // Set a timeout to mark initial loading as done after 2 seconds
    const timeout = setTimeout(() => {
      setInitialLoadDone(true);
    }, 2000);

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    // Show UserForm only if the user is authenticated and there's no user data available
    if (initialLoadDone && user && !userHasData) {
      setShowUserForm(true);
    } else {
      setShowUserForm(false);
    }
  }, [initialLoadDone, user, userHasData]);

  if (userLoading || userDataLoading || !initialLoadDone) {
    return <Loading />;
  }

  if (!user) {
    return <Signin />;
  }

  return (
    <>
      <NavBar user={user} />
      <hr />
      <div className="container">
        {showUserForm ? (
          <UserForm obj={null} uid={user.uid} />
        ) : (
          <Component {...pageProps} />
        )}
      </div>
    </>
  );
};

ViewDirectorBasedOnUserAuthStatus.propTypes = {
  component: PropTypes.func.isRequired,
  pageProps: PropTypes.oneOfType([PropTypes.object]).isRequired,
};

export default ViewDirectorBasedOnUserAuthStatus;

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
        setUserDataLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (userLoading || userDataLoading) {
    return <Loading />;
  }

  if (user) {
    if (!userHasData) {
      return (
        <>
          <NavBar user={user} />
          <div className="container">
            <UserForm obj={null} uid={user.uid} />
          </div>
        </>
      );
    }
    return (
      <>
        <NavBar user={user} />
        <div className="container">
          <Component {...pageProps} />
        </div>
      </>
    );
  }

  return <Signin />;
};

export default ViewDirectorBasedOnUserAuthStatus;

ViewDirectorBasedOnUserAuthStatus.propTypes = {
  component: PropTypes.func.isRequired,
  pageProps: PropTypes.oneOfType([PropTypes.object]).isRequired,
};

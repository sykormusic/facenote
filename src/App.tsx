import SplashPage from 'components/splash';
import UsernameModal from 'components/username_modal';
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import LoadingBar from 'react-top-loading-bar';
import Routes from 'routes';
import { auth } from 'services/firebase';
import { getUserListService } from 'services/globalService';
import { getMeService } from 'services/userService';
import { getUsersAPI } from 'store/actions/globalSlice';
import { loginAPI, logout, selectUser } from 'store/actions/userSlice';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import history from 'utils/history';

import { useDisclosure } from '@chakra-ui/react';

import './App.css';

const App = () => {
  history.navigate = useNavigate();
  history.location = useLocation();

  const ref = useRef<any>(null);

  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(selectUser);
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const {
    isOpen: isOpenUsernameModal,
    onOpen: onOpenUsernameModal,
    onClose: onCloseUsernameModal,
  } = useDisclosure();

  const getUsers = () => {
    getUserListService((payload: any) => {
      dispatch(getUsersAPI(payload));
    });
  };

  const getAuth = async () =>
    new Promise((resolve: any) => {
      onAuthStateChanged(auth, async (userAuth) => {
        if (userAuth) {
          // user is logged in,
          // send the user's details to redux,
          // store the current user in the state
          await getMeService(userAuth.uid, (payload) => {
            dispatch(loginAPI(payload));
            setIsMounted(true);
          });
        } else {
          dispatch(logout());
          await auth.signOut();
          setIsMounted(true);
        }
        resolve(true);
      });
    });

  useEffect(() => {
    getAuth();
    getUsers();
  }, []);

  useEffect(() => {
    if (currentUser) {
      if (!currentUser.username) {
        setTimeout(() => {
          onOpenUsernameModal();
        }, 500);
      }
    }
  }, [JSON.stringify(currentUser)]);

  const onShowLoading = (val: boolean) => {
    if (ref.current) {
      if (val) {
        ref.current.continuousStart();
      } else {
        ref.current.complete();
      }
    }
  };

  if (!isMounted) {
    return (
      <div className="App">
        <SplashPage />
      </div>
    );
  }
  return (
    <div className="App">
      <Routes onShowLoading={onShowLoading} />
      <LoadingBar color="red" ref={ref} />
      <UsernameModal
        isOpen={isOpenUsernameModal}
        onClose={onCloseUsernameModal}
        userId={currentUser?.uid}
      />
    </div>
  );
};

export default App;

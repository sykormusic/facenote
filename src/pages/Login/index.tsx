import Logo from 'components/logo';
import { signInWithPopup } from 'firebase/auth';
import LoginLayout from 'layouts/LoginLayout';
import { APP_NAME } from 'myConstants';
import { useState } from 'react';
import { IoLogoGoogle } from 'react-icons/io5';
import { auth, provider } from 'services/firebase';
import { signInService } from 'services/userService';
import { loginAPI } from 'store/actions/userSlice';
import { useAppDispatch } from 'store/hooks';
import history from 'utils/history';
import useToastHook from 'utils/notification';

import { Box, Button, Flex } from '@chakra-ui/react';

const Login = () => {
  const [toast, newToast] = useToastHook();
  const [loadingLogin, setLoadingLogin] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  const initGoogleUser = async (res: any) => {
    newToast({
      title: 'Logged in successfully.',
      description: `Welcome to the ${APP_NAME}`,
      status: 'success',
    });
    setLoadingLogin(true);

    signInService(res, (payload) => {
      dispatch(loginAPI(payload));
    });

    setTimeout(() => {
      setLoadingLogin(false);
      history.navigate('/');
    }, 500);
  };

  const signInWithGoogle = async () => {
    signInWithPopup(auth, provider)
      .then(async (res: any) => {
        await initGoogleUser(res);
      })
      .catch((error) => {
        setLoadingLogin(false);
        newToast({
          title: 'Login failed',
          description: error.message,
          status: 'error',
        });
      });
  };

  return (
    <LoginLayout>
      <Box position="relative">
        <Flex
          minH="100%"
          display="flex"
          justifyContent="center"
          alignItems="center"
          direction="column"
          gap={8}
        >
          <Flex
            justifyContent="center"
            flexDirection="column"
            alignItems="center"
            gap={12}
            mt="-50px"
          >
            <Logo size={40} />
            {/* <IoLogoInstagram fontSize={LOGO_SIZE} color="#D282A9" /> */}
            <Button
              colorScheme="brand"
              // variant="outline"
              onClick={signInWithGoogle}
              isLoading={loadingLogin}
              leftIcon={<IoLogoGoogle fontSize={14} />}
            >
              <span
                style={{
                  paddingLeft: '2px',
                  lineHeight: 0,
                }}
              >
                Sign in with Google
              </span>
            </Button>
          </Flex>
        </Flex>
      </Box>
    </LoginLayout>
  );
};

export default Login;

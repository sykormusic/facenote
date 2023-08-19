import { signInWithPopup } from 'firebase/auth';
import { APP_NAME, BASE_WIDTH } from 'myConstants';
import { AiFillGithub } from 'react-icons/ai';
import {
  IoBookmarkOutline,
  IoLogInOutline,
  IoLogoOctocat,
  IoLogOutOutline,
  IoPersonOutline,
} from 'react-icons/io5';
import { auth, provider } from 'services/firebase';
import { signInService } from 'services/userService';
import { selectUsers } from 'store/actions/globalSlice';
import { clearPosts } from 'store/actions/postSlice';
import { loginAPI, selectUser } from 'store/actions/userSlice';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import history from 'utils/history';
import useToastHook from 'utils/notification';

import {
  ChevronDownIcon,
  ChevronLeftIcon,
  MoonIcon,
  SunIcon,
} from '@chakra-ui/icons';
import {
  Avatar,
  Box,
  Button,
  Center,
  Divider,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuList,
  Stack,
  Text,
  Tooltip,
  useColorMode,
  useColorModeValue,
} from '@chakra-ui/react';

import Logo from './logo';

export default function Nav() {
  const { colorMode, toggleColorMode } = useColorMode();
  const [toast, newToast] = useToastHook();

  // const scrollDirection = useScrollDirection();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);

  const bgColor = useColorModeValue('whiteAlpha.900', 'blackAlpha.700');
  const maxW = BASE_WIDTH;

  const onChangeTheme = () => {
    toggleColorMode();
    const styleEl = document.createElement('style');
    const cssText = document.createTextNode(
      'html * { transition: color, background-color 0.3s ease-out !important }'
    );
    styleEl.appendChild(cssText);
    document.head.appendChild(styleEl);
    setTimeout(() => {
      document.head.removeChild(styleEl);
    }, 300);
  };

  const initGoogleUser = async (res: any) => {
    await signInService(res, (payload) => {
      dispatch(loginAPI(payload));
      newToast({
        title: 'Logged in successfully.',
        description: `Welcome to the ${APP_NAME}`,
        status: 'success',
      });
      history.navigate('/');
    });
  };

  const signInWithGoogle = async () => {
    signInWithPopup(auth, provider)
      .then(async (res: any) => {
        initGoogleUser(res);
      })
      .catch((error) => {
        newToast({
          title: 'Login failed',
          description: error.message,
          status: 'error',
        });
      });
  };

  const onLogout = async () => {
    auth.signOut();
    newToast({
      title: `You've been logged out`,
      // description: error.message,
      status: 'error',
    });
    dispatch(clearPosts());
    // check app.tsx
  };

  const _renderCommonNav = () => (
    <Flex
      bg={bgColor}
      // px={4}
      zIndex={1000}
      justifyContent="center"
      // position="sticky"
      // top={scrollDirection === 'down' ? '-70px' : 0}
      // transition="all 0.3s"
      position="fixed"
      w="100%"
      backdropFilter="blur(10px)"
      boxShadow="var(--chakra-shadows-sm)"
      // borderWidth={1}
      // borderBottomColor={useColorModeValue('white.200', 'blackAlpha.200')}
    >
      <Flex
        maxW={maxW}
        paddingInline={4}
        w="100%"
        h="50px"
        alignItems="center"
        justifyContent="space-between"
        gap={4}
      >
        <Flex alignItems="center" flexGrow={1} flexBasis={0}>
          <Logo />
        </Flex>

        {/* <Box
            maxW="45%"
            w="100%"
            display={{
              xl: 'block',
              lg: 'block',
              md: 'block',
              sm: 'none',
              base: 'none',
            }}
          >
            <InputGroup size="md" variant="filled">
              <Input placeholder="Search" fontSize={14} />
              <InputRightElement pointerEvents="none">
                <SearchIcon color="gray.300" />
              </InputRightElement>
            </InputGroup>
          </Box> */}

        <Flex
          flexGrow={1}
          flexBasis={0}
          alignItems="center"
          justifyContent="flex-end"
        >
          <Stack direction="row" spacing={2}>
            {/* <Tooltip label="Search">
                <IconButton
                  aria-label=""
                  variant="ghost"
                  icon={<SearchIcon />}
                />
              </Tooltip> */}

            <Tooltip label="Change theme">
              <IconButton
                aria-label=""
                variant="ghost"
                icon={
                  colorMode === 'light' ? (
                    <MoonIcon fontSize={16} />
                  ) : (
                    <SunIcon fontSize={16} />
                  )
                }
                onClick={onChangeTheme}
              />
            </Tooltip>

            {!user ? (
              <Button colorScheme="brand" onClick={signInWithGoogle}>
                Sign in
              </Button>
            ) : (
              <Menu isLazy placement="bottom-end">
                <MenuButton
                  as={Button}
                  aria-label="Options"
                  paddingInline={3}
                  variant="outline"
                  // p={0}
                  // _hover={{
                  //   bg: 'transparent',
                  // }}
                  // _active={{
                  //   bg: 'transparent',
                  // }}
                >
                  <Button
                    borderWidth={0}
                    // colorScheme="secondaryBrand"
                    variant="ghost"
                    p={0}
                  >
                    <Flex gap={3} alignItems="center">
                      <Avatar
                        src={user?.photoURL}
                        size="xs"
                        borderWidth={2}
                        borderColor={user ? 'brand.400' : 'gray.400'}
                        bg={user ? 'brand.400' : 'gray.400'}
                      />
                      <Text
                        fontSize={14}
                        display={{
                          xl: 'block',
                          lg: 'block',
                          md: 'block',
                          sm: 'none',
                          base: 'none',
                        }}
                        lineHeight={0}
                      >
                        {user
                          ? (user?.username || user?.displayName || '').split(
                              ' '
                            )[0]
                          : 'Guest'}
                      </Text>
                      <ChevronDownIcon fontSize={18} />
                    </Flex>
                  </Button>
                </MenuButton>
                {user ? (
                  <MenuList fontSize={14}>
                    <MenuGroup title="Profile">
                      <MenuItem
                        icon={<IoPersonOutline fontSize={16} />}
                        onClick={() => {
                          history.navigate(`/profile/${user?.uid}`);
                        }}
                      >
                        My Account
                      </MenuItem>
                      <MenuItem icon={<IoBookmarkOutline fontSize={16} />}>
                        Saved
                      </MenuItem>
                    </MenuGroup>
                    <MenuDivider />
                    <MenuItem
                      icon={<IoLogOutOutline fontSize={16} color="#ED4756" />}
                      onClick={onLogout}
                      color="#ED4756"
                    >
                      Logout
                    </MenuItem>
                  </MenuList>
                ) : (
                  <MenuList fontSize={14}>
                    <MenuGroup title="Profile">
                      <MenuItem
                        icon={<IoLogInOutline fontSize={16} />}
                        onClick={signInWithGoogle}
                      >
                        Login
                      </MenuItem>
                    </MenuGroup>
                  </MenuList>
                )}
              </Menu>
            )}
          </Stack>
        </Flex>
      </Flex>
    </Flex>
  );

  return _renderCommonNav();
}

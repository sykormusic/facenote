import { Field, Formik } from 'formik';
import { useState } from 'react';
import { updateMeService } from 'services/userService';
import useToastHook from 'utils/notification';

import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  VStack,
} from '@chakra-ui/react';

const UsernameModal = ({
  isOpen = false,
  onClose,
  userId,
  canClose = false,
  initialValue = '',
}: {
  isOpen: boolean;
  onClose: () => void;
  userId?: string;
  canClose?: boolean;
  initialValue?: string;
}) => {
  const [toast, newToast] = useToastHook();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onUpdateUsername = async (username: string) => {
    if (userId) {
      setIsLoading(true);
      const status = await updateMeService(userId, {
        username,
      });
      setIsLoading(false);
      if (status) {
        newToast({
          title: 'Success',
          description: 'Username updated successfully',
          status: 'success',
        });
        onClose();
      } else {
        newToast({
          title: 'Error',
          description: 'Username update failed',
          status: 'error',
        });
      }
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={canClose ? onClose : () => null}
      closeOnOverlayClick={canClose}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader fontSize={14}>Enter your username</ModalHeader>
        <ModalBody>
          <Formik
            initialValues={{
              username: initialValue || '',
            }}
            onSubmit={async (values) => {
              onUpdateUsername(values.username);
            }}
          >
            {({ handleSubmit, errors, touched }) => (
              <form onSubmit={handleSubmit}>
                <VStack spacing={4} align="flex-start">
                  <FormControl
                    isInvalid={!!errors.username && touched.username}
                  >
                    <Field
                      as={Input}
                      id="username"
                      name="username"
                      isDisabled={isLoading}
                      type="text"
                      autoComplete="off"
                      // variant="filled"
                      placeholder="Enter a valid username"
                      validate={(value: any) => {
                        let error;
                        const regex = /[^0-9a-z._]/g;

                        if (value.length < 6) {
                          error = 'Username must contain at least 6 characters';
                        }
                        if (value.length > 20) {
                          error = 'Username must contain at most 20 characters';
                        }
                        if (value.includes(' ')) {
                          error = 'Username must not contain spaces';
                        }
                        if (regex.test(value)) {
                          error =
                            'Username must not contain any special or uppercase characters';
                        }
                        return error;
                      }}
                    />
                    <FormErrorMessage>{errors.username}</FormErrorMessage>
                  </FormControl>
                  <Flex justifyContent="flex-end" w="100%" gap={4}>
                    {canClose ? (
                      <Button onClick={onClose}>Cancel</Button>
                    ) : null}
                    <Button
                      colorScheme="brand"
                      type="submit"
                      isLoading={isLoading}
                    >
                      Save
                    </Button>
                  </Flex>
                </VStack>
              </form>
            )}
          </Formik>
        </ModalBody>
        <Box h={4} />
      </ModalContent>
    </Modal>
  );
};

export default UsernameModal;

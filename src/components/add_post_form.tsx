/* eslint-disable no-restricted-syntax */
import { Field, Form, Formik } from 'formik';
import { useState } from 'react';
import { IoImageOutline } from 'react-icons/io5';
import useToastHook from 'utils/notification';

import { SmallCloseIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  IconButton,
  Image,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Stack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';

import AutoResizeTextarea from './auto_resize_textarea';
import EmojiPicker from './emoji_picker';

const AddPostForm = ({
  onAddPost,
  loading,
  name = '',
}: {
  onAddPost: (values: { content: string }, files: File[]) => void;
  loading?: boolean;
  name?: string;
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [toast, newToast] = useToastHook();
  const [isError, setIsError] = useState<boolean>(false);

  const imagePreviewBorderColor = useColorModeValue('gray.200', 'gray.600');

  const handleFileSelect = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.multiple = true;
    fileInput.accept = 'image/*';
    fileInput.onchange = (event) => {
      const input = event.target as HTMLInputElement;
      const tempFiles = [...files, ...Array.from(input.files || [])].filter(
        (v, i, a) => a.findIndex((v2) => v2.name === v.name) === i
      );

      if (tempFiles.length > 4) {
        newToast({
          title: 'Error',
          description: 'Maximum 4 files accepted!',
          status: 'error',
        });
        event.preventDefault();
      } else {
        setFiles(tempFiles);
        setIsError(false);
      }
    };
    fileInput.click();
  };

  const onRemoveFile = (file: File) => {
    const newList = files.filter((x) => x.name !== file?.name);
    setFiles(newList);
  };

  return (
    <Box
      w="100%"
      borderRadius={8}
      overflow="hidden"
      bg={useColorModeValue('white', '#171923')}
      paddingInline={4}
      paddingBlock={4}
    >
      <Stack>
        <Formik
          initialValues={{
            content: '',
            files: null,
          }}
          onSubmit={async (values, actions) => {
            if (!values.content) {
              newToast({
                title: 'Error',
                description: 'The post is empty!',
                status: 'error',
              });
              return;
            }
            if (files.length === 0) {
              setIsError(true);
              return;
            }
            setIsError(false);
            await onAddPost(values, files);
            actions.resetForm();
            setFiles([]);
          }}
        >
          {({ setFieldValue, values }) => (
            <Form>
              <Field name="content">
                {({ field, form }: { field: any; form: any }) => (
                  <FormControl>
                    <AutoResizeTextarea
                      p={1}
                      minRows={2}
                      gridAutoRows
                      spellCheck={false}
                      placeholder={`Hi ${name}, how are you today?`}
                      isDisabled={loading}
                      onKeyDown={() => {
                        if (isError) {
                          setIsError(false);
                        }
                      }}
                      {...field}
                    />
                  </FormControl>
                )}
              </Field>

              {files.length > 0 && (
                <Box
                  mt={4}
                  display="flex"
                  flexWrap="wrap"
                  gap={2}
                  p={1}
                  borderRadius={8}
                  w="fit-content"
                >
                  {Array.from(files).map((file) => (
                    <Box key={file.name} position="relative">
                      <Image
                        borderRadius={4}
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        w={20}
                        h={20}
                        borderWidth={1}
                        borderStyle="dotted"
                        borderColor={imagePreviewBorderColor}
                        objectFit="cover"
                      />
                      <IconButton
                        aria-label=""
                        variant="solid"
                        position="absolute"
                        right="3px"
                        size="xs"
                        top="3px"
                        onClick={() => onRemoveFile(file)}
                        icon={<SmallCloseIcon fontSize={16} color="#ED4756" />}
                      />
                    </Box>
                  ))}
                </Box>
              )}

              <Flex
                justifyContent="space-between"
                alignItems="center"
                paddingTop={2}
                marginLeft={-2}
              >
                <Flex>
                  <Field name="files">
                    {({ field, form }: { field: any; form: any }) => (
                      <FormControl>
                        <Popover placement="right" isOpen={isError} isLazy>
                          <PopoverTrigger>
                            <IconButton
                              icon={<IoImageOutline fontSize={18} />}
                              aria-label=""
                              bg="transparent"
                              onClick={
                                loading
                                  ? () => {
                                      console.log('');
                                    }
                                  : () => handleFileSelect()
                              }
                              isDisabled={loading}
                            />
                          </PopoverTrigger>
                          <PopoverContent
                            bg="#ED4756"
                            maxW={{
                              base: 'max-content',
                              lg: 'max-content',
                            }}
                            border="none"
                          >
                            <PopoverArrow bg="#ED4756" border="none" />
                            <PopoverBody>
                              <Text color="white" fontSize={12}>
                                Please select images
                              </Text>
                            </PopoverBody>
                          </PopoverContent>
                        </Popover>

                        <FormErrorMessage>{form.errors.files}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                  <EmojiPicker
                    onClick={(val) => {
                      const { content } = values;
                      setFieldValue('content', content + val);
                    }}
                    isDisabled={loading}
                  >
                    <IconButton
                      icon={<Text fontSize={16}>😂</Text>}
                      aria-label=""
                      bg="transparent"
                    />
                  </EmojiPicker>
                </Flex>
                <Button
                  type="submit"
                  colorScheme="brand"
                  isLoading={loading}
                  size="md"
                  isDisabled={!values.content}
                >
                  Post
                </Button>
              </Flex>
            </Form>
          )}
        </Formik>
      </Stack>
    </Box>
  );
};
export default AddPostForm;

import React from 'react';
import ResizeTextarea from 'react-textarea-autosize';

import { Textarea, TextareaProps } from '@chakra-ui/react';

const AutoResizeTextarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (props, ref) => (
    <Textarea
      minH="unset"
      overflow="hidden"
      lineHeight={1.8}
      w="100%"
      resize="none"
      ref={ref}
      outline="none"
      border="none"
      variant="unstyled"
      minRows={1}
      as={ResizeTextarea}
      {...props}
    />
  )
);

export default AutoResizeTextarea;

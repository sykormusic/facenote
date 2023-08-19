import React from 'react';

import {
  Box,
  IconButton,
  PlacementWithLogical,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Portal,
  SimpleGrid,
  Text,
} from '@chakra-ui/react';

const EmojiPicker = ({
  children,
  onClick,
  isDisabled = false,
  placement = 'bottom-start',
}: {
  children: React.ReactNode;
  onClick?: (item: string) => void;
  placement?: PlacementWithLogical;
  isDisabled?: boolean;
}) => (
  <Popover placement={placement} preventOverflow>
    <PopoverTrigger>
      <Box pointerEvents={isDisabled ? 'none' : 'auto'}>{children}</Box>
    </PopoverTrigger>
    <Portal>
      <PopoverContent>
        <PopoverArrow />
        <PopoverBody>
          <SimpleGrid columns={7} spacing={2}>
            {['👍', '🥰', '😘', '😮', '😡', '😂', '❤️'].map((x) => (
              <IconButton
                key={x}
                icon={<Text fontSize={20}>{x}</Text>}
                aria-label=""
                bg="transparent"
                // eslint-disable-next-line @typescript-eslint/no-empty-function
                onClick={onClick ? () => onClick(x) : () => {}}
              />
            ))}
          </SimpleGrid>
        </PopoverBody>
      </PopoverContent>
    </Portal>
  </Popover>
);
export default EmojiPicker;

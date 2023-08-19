import {
  PlacementWithLogical,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
} from '@chakra-ui/react';

const MyPopover = ({
  content,
  children,
  placement = 'right',
}: {
  content: React.ReactNode;
  children: React.ReactNode;
  placement?: PlacementWithLogical;
}) => (
  <Popover placement={placement}>
    <PopoverTrigger>{children}</PopoverTrigger>
    <PopoverContent
      maxW={{ base: 'max-content', lg: 'max-content' }}
      p={0}
      maxH="400px"
      overflowY="auto"
    >
      <PopoverArrow />
      <PopoverBody p={2}>{content}</PopoverBody>
    </PopoverContent>
  </Popover>
);

export default MyPopover;

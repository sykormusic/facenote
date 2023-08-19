import { Spinner } from '@chakra-ui/react';

const LoadingSpinner = ({ size = 'md' }: { size?: string }) => (
  <Spinner color="#D282A9" size={size} />
);

export default LoadingSpinner;

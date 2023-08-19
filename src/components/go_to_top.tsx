import { useEffect, useState } from 'react';
import { scrollToTop } from 'utils/common';

import { ArrowUpIcon } from '@chakra-ui/icons';
import { Box, Button } from '@chakra-ui/react';

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 200) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  return isVisible ? (
    <Box
      onClick={scrollToTop}
      position="fixed"
      bottom="9px"
      right={['9px', '9px']}
      zIndex={3}
    >
      <Button
        size="md"
        colorScheme="brand"
        variant="solid"
        borderRadius={8}
        paddingInline={4}
        paddingBlock={2}
      >
        <ArrowUpIcon fontSize={18} />
      </Button>
    </Box>
  ) : null;
}

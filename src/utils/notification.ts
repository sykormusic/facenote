import { useEffect, useState } from 'react';

import { useToast } from '@chakra-ui/react';

const useToastHook = () => {
  const [state, setState] = useState<any>();

  const toast = useToast();

  useEffect(() => {
    if (state) {
      toast({
        title: state?.title,
        description: state?.description,
        status: state?.status || 'success',
        duration: 7000,
        position: state?.position || 'bottom-right',
        isClosable: true,
        // variant: 'top-accent',
      });
    }
  }, [state, toast]);

  return [state, setState, toast];
};

export default useToastHook;

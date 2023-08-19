import React, { useState } from 'react';

import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { Box, IconButton, Image, useColorMode } from '@chakra-ui/react';

interface CarouselProps {
  images: string[];
  onViewImages: () => void;
}

const Carousel: React.FC<CarouselProps> = ({
  images,
  onViewImages = () => null,
}) => {
  const { colorMode } = useColorMode();
  const [index, setIndex] = useState(0);
  const handlePrevious = () =>
    setIndex((index - 1 + images.length) % images.length);
  const handleNext = () => setIndex((index + 1) % images.length);

  if (images.length === 1) {
    return (
      <Image
        src={images[0]}
        // h="100%"
        maxH="500px"
        h="100%"
        maxW="100%"
        // w="100%"
        cursor="pointer"
        onClick={onViewImages}
        objectFit="cover"
        borderRadius={5}
      />
    );
  }
  return (
    <Box
      position="relative"
      w="100%"
      overflow="hidden"
      borderRadius={5}
      pt="75%"
    >
      {images.map((item, i) => (
        <Box
          key={item}
          position="absolute"
          width="100%"
          height="100%"
          top={0}
          left={0}
          right={0}
          bottom={0}
          background={colorMode === 'light' ? 'gray.100' : 'gray.700'}
          display="flex"
          alignItems="center"
          justifyContent="center"
          style={{
            transform: `translateX(${-index * 100}%)`,
            left: `${i * 100}%`,
            transition: '0.3s',
          }}
        >
          <Image
            src={item}
            h="100%"
            maxH="500px"
            maxW="100%"
            // w="100%"
            objectFit="cover"
            cursor="pointer"
            onClick={onViewImages}
          />
        </Box>
      ))}
      {images.length > 1 ? (
        <>
          <IconButton
            position="absolute"
            left={4}
            top="48%"
            aria-label=""
            icon={<ChevronLeftIcon fontSize={18} />}
            onClick={handlePrevious}
            borderRadius="50%"
            opacity={0.7}
          />
          <IconButton
            position="absolute"
            right={4}
            top="48%"
            aria-label=""
            icon={<ChevronRightIcon fontSize={18} />}
            onClick={handleNext}
            borderRadius="50%"
            opacity={0.7}
          />
        </>
      ) : null}
    </Box>
  );
};

export default Carousel;

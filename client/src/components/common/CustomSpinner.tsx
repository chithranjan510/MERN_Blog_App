import { Box, Center, keyframes } from "@chakra-ui/react";

const spinningKeyframes = keyframes`
0% {transform:rotate(0deg)}
100% {transform:rotate(360deg)}
`;

const CustomSpinner = () => {
  return (
    <Center w="100%" h="100%">
      <Box
        w="100px"
        h="100px"
        borderRadius="50%"
        border="12px solid #fff"
        borderTop="12px solid #718096"
        animation={`${spinningKeyframes} 0.6s linear infinite`}
      />
    </Center>
  );
};

export default CustomSpinner;

import { Box, Center, keyframes } from "@chakra-ui/react";

const spinningKeyframes = keyframes`
0% {transform:rotate(0deg)}
100% {transform:rotate(360deg)}
`;

const CustomSpinner = () => {
  return (
    <Center w="100%" h="80vh">
      <Box
        w="100px"
        h="100px"
        borderRadius="50%"
        border="12px solid #eee"
        borderTop="12px solid #1A202C"
        animation={`${spinningKeyframes} 0.6s linear infinite`}
      />
    </Center>
  );
};

export default CustomSpinner;

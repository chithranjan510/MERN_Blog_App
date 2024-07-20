import { Center, Image, Text, VStack } from "@chakra-ui/react";

const NoDataFound = () => {
  return (
    <Center w="100%" h="50vh">
      <VStack textAlign="center" spacing={0}>
        <Image src="/noDataFound.svg" w="200px" />
        <Text pt={5} fontSize="30px" fontWeight={700} color="#fff">
          No Data Found
        </Text>
      </VStack>
    </Center>
  );
};

export default NoDataFound;

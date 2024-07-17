import { Box, Center, Text } from "@chakra-ui/react";
import { FileEarmarkExcelFill } from "@emotion-icons/bootstrap/FileEarmarkExcelFill";

const NoDataFound = () => {
  return (
    <Center w="100%" h="80vh">
      <Box textAlign="center">
        <FileEarmarkExcelFill width="100px" opacity={0.5} />
        <Text pt={5} fontSize="24px" fontWeight={500} opacity={0.7}>
          No Data Found
        </Text>
      </Box>
    </Center>
  );
};

export default NoDataFound;

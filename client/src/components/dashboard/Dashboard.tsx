import {
  Center,
  HStack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import UserDetails from "./UserDetails";
import Categories from "./Categories";
import { useState } from "react";

const Dashboard = () => {
  const [activeTabIndex, setActiveTabIndex] = useState<number>(0);
  const [totalUsers, setTotalUsers] = useState<number | null>(null);
  const [totalCategories, setTotalCategories] = useState<number | null>(6);

  return (
    <Tabs isFitted index={activeTabIndex} h="100%">
      <TabList border="none" pb={[3]}>
        <Tab
          borderBottom={
            activeTabIndex === 0
              ? "3px solid #f6ad55 !important"
              : "3px solid #fff"
          }
          onClick={() => setActiveTabIndex(0)}
          _active={{}}
        >
          <HStack fontWeight={500}>
            <Text color={activeTabIndex === 0 ? "#f6ad55 !important" : "#fff"}>
              Authors
            </Text>
            {totalUsers !== null && (
              <Center
                h="25px"
                px={2}
                bgColor="gray.600"
                borderRadius="5px"
                color="#fff"
              >
                {totalUsers}
              </Center>
            )}
          </HStack>
        </Tab>
        <Tab
          borderBottom={
            activeTabIndex === 1
              ? "3px solid #f6ad55 !important"
              : "3px solid #fff"
          }
          onClick={() => setActiveTabIndex(1)}
          _active={{}}
        >
          <HStack fontWeight={500}>
            <Text color={activeTabIndex === 1 ? "#f6ad55 !important" : "#fff"}>
              Categories
            </Text>
            {totalCategories !== null && (
              <Center
                h="25px"
                px={2}
                bgColor="gray.600"
                borderRadius="5px"
                color="#fff"
              >
                {totalCategories}
              </Center>
            )}
          </HStack>
        </Tab>
      </TabList>
      <TabPanels h="100%">
        <TabPanel px={0} h="100%">
          <UserDetails setTotalUsers={setTotalUsers} />
        </TabPanel>
        <TabPanel px={0} h="100%">
          <Categories setTotalCategories={setTotalCategories} />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

export default Dashboard;

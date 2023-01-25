// import React from 'react';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { MaterialCommunityIcons } from '@expo/vector-icons';
// import colors from '../config/colors';
// // Import Constants
// import routes from './routes';
// import DashboardNavigator from './DashboardNavigator';
// import PatientsNavigator from './PatientsNavigator';
// import ConfigNavigator from './ConfigNavigator';
// import AccountScreen from '../screens/AccountScreen';
// import NotificationNavigator from './NotificationNavigator';
// import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

import React, { useState, useContext } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Outlet,
  useParams,
} from 'react-router-dom';
import {
  VStack,
  HStack,
  Button,
  IconButton,
  Icon,
  Text,
  NativeBaseProvider,
  Center,
  Box,
  StatusBar,
  View,
  Image,
  Pressable,
  Divider,
  Menu,
  Popover,
} from 'native-base';
import { NavigationContainer } from '@react-navigation/native';

import { MaterialIcons } from '@expo/vector-icons';

import AuthContext from 'appauthcontext';
import authStorage from 'appauthauthStorage';

import NotificationNavigator from 'app\navigationNotificationNavigator';
import AccountScreen from 'appscreensAccountScreen';
import PatientsScreenWeb from 'appscreenswebPatientsScreenWeb';
import PatientInformationScreenWeb from 'app/screens/web/PatientInformationScreenWeb';

import routes from 'app\navigation\routes';

function Example() {
  return (
    <div style={{ padding: 20 }}>
      <h2>Example View</h2>
      <p>Lorem ipsum dolor sit amet, consectetur adip.</p>
    </div>
  );
}

function Example2() {
  return (
    <div style={{ padding: 20 }}>
      <h2>Example 2 View</h2>
      <p>Lorem ipsum dolor sit amet, consectetur adip.</p>
    </div>
  );
}

const linkStyle = {
  textDecoration: 'none',
  padding: 5,
};

function WebAppNavigator() {
  const [sidebar, setSidebar] = useState(false);
  const { user, setUser } = useContext(AuthContext);

  // side navbar
  const showSidebar = () => setSidebar(!sidebar);

  // logout
  const onPressLogOut = async () => {
    setUser(null);
    await authStorage.removeToken();
  };

  return (
    <>
      <Box style={{ borderBottomWidth: 3 }}>
        <StatusBar />
        <HStack
          bg="white"
          justifyContent="space-between"
          alignItems="center"
          w="100%"
        >
          <HStack alignItems="center">
            <IconButton
              px="5"
              icon={
                <Icon
                  size="2xl"
                  as={MaterialIcons}
                  name={sidebar ? 'close' : 'menu'}
                  color="black"
                />
              }
              onPress={showSidebar}
            />
            <Image
              source={require('../assets/pear.png')}
              alt="PEAR"
              resizeMode="contain"
              size="lg"
            />
          </HStack>
          <HStack>
            <Popover
              trigger={(triggerProps) => {
                return (
                  <IconButton
                    {...triggerProps}
                    icon={
                      <Icon
                        as={MaterialIcons}
                        name="notifications"
                        size="2xl"
                        color="black"
                        m="3"
                      />
                    }
                  />
                );
              }}
            >
              <Popover.Content
                accessibilityLabel="Notifications"
                w="500"
                h="400"
              >
                <Popover.Header>Notifications</Popover.Header>
                <Popover.Body>
                  {/* <NavigationContainer>
                    <NotificationNavigator />
                  </NavigationContainer> */}
                </Popover.Body>
                {/* <Popover.Footer justifyContent="flex-end">
                  <Button.Group space={2}>
                    <Button colorScheme="coolGray" variant="ghost">
                      Cancel
                    </Button>
                    <Button colorScheme="danger">Delete</Button>
                  </Button.Group>
                </Popover.Footer> */}
              </Popover.Content>
            </Popover>

            <Menu
              w="190"
              trigger={(triggerProps) => {
                return (
                  <Pressable>
                    <IconButton
                      icon={
                        <Icon
                          as={MaterialIcons}
                          name="person"
                          size="2xl"
                          color="black"
                          m="3"
                        />
                      }
                      accessibilityLabel="Profile menu"
                      {...triggerProps}
                    />
                  </Pressable>
                );
              }}
            >
              <Menu.Group title={user.sub}>
                <Menu.Item>Edit Profile</Menu.Item>
                <Menu.Item onPress={onPressLogOut}>Logout</Menu.Item>
              </Menu.Group>
            </Menu>
          </HStack>
        </HStack>
      </Box>

      {/* TODO: (yapsiang) implements routes for the different pages  */}
      <Router>
        <HStack alignContent="center">
          {sidebar ? (
            // <Pressable onPress={showSidebar}>
            <Pressable>
              <VStack
                space="xs"
                pt="2"
                px="3"
                borderRightWidth="1"
                borderBottomWidth="1"
                h="100vh"
                w="15vw"
              >
                <Text bold fontSize="18px">
                  PATIENTS
                </Text>
                <Link to={routes.PATIENTS} style={linkStyle}>
                  <Icon as={MaterialIcons} name="apartment" size="md" m="2" />
                  View Patient
                </Link>
                <Link to="/example" style={linkStyle}>
                  <Icon
                    as={MaterialIcons}
                    name="switch-account"
                    size="md"
                    m="2"
                  />
                  Manage Preference
                </Link>
                <Link to="/example2" style={linkStyle}>
                  <Icon
                    as={MaterialIcons}
                    name="medical-services"
                    size="md"
                    m="2"
                  />
                  View Medication Schedule
                </Link>
                <Divider />

                <Text bold fontSize="18px">
                  ACTIVITIES
                </Text>
                <Link to={routes.ACCOUNT} style={linkStyle}>
                  <Icon as={MaterialIcons} name="list-alt" size="md" m="2" />
                  Manage Activities
                </Link>
                <Divider />

                <Text bold fontSize="18px">
                  ATTENDANCE
                </Text>
                <Link to={routes.NOTIFICATION} style={linkStyle}>
                  <Icon
                    as={MaterialIcons}
                    name="assignment-ind"
                    size="md"
                    m="2"
                  />
                  Manage Attendance
                </Link>
                <Divider />

                <Text bold fontSize="18px">
                  ADHOC
                </Text>
                <Link to="/" style={linkStyle}>
                  <Icon as={MaterialIcons} name="note" size="md" m="2" />
                  Manage Adhoc
                </Link>
                <Divider />

                <Text bold fontSize="18px">
                  SCHEDULE
                </Text>
                <Link to="/" style={linkStyle}>
                  <Icon as={MaterialIcons} name="loop" size="md" m="2" />
                  Generate Schedule
                </Link>
                <Link to="/" style={linkStyle}>
                  <Icon
                    as={MaterialIcons}
                    name="file-download"
                    size="md"
                    m="2"
                  />
                  Export Schedule
                </Link>
                <Divider />

                <Text bold fontSize="18px">
                  OTHERS
                </Text>
                <Link to="/" style={linkStyle}>
                  <Icon
                    as={MaterialIcons}
                    name="person-search"
                    size="md"
                    m="2"
                  />
                  View Highlight
                </Link>
                <Link to="/" style={linkStyle}>
                  <Icon
                    as={MaterialIcons}
                    name="library-add-check"
                    size="md"
                    m="2"
                  />
                  Manage Approval Request
                </Link>
                <Link to="/" style={linkStyle}>
                  <Icon as={MaterialIcons} name="search" size="md" m="2" />
                  View Activity Logs
                </Link>
                <Link to="/" style={linkStyle}>
                  <Icon as={MaterialIcons} name="security" size="md" m="2" />
                  View Privacy Settings
                </Link>
                <Link to="/" style={linkStyle}>
                  <Icon as={MaterialIcons} name="view-list" size="md" m="2" />
                  Manage List Items
                </Link>
                <Divider />
              </VStack>
            </Pressable>
          ) : null}
          <Routes>
            <Route path="" element={<Example />} />
            <Route path="/example" element={<Example />} />
            <Route path="/example2" element={<Example2 />} />
            <Route path={routes.ACCOUNT} element={<AccountScreen />} />
            <Route
              path={routes.NOTIFICATION}
              element={<NotificationNavigator />}
            />
            <Route
              path={routes.PATIENTS}
              element={<PatientsScreenWeb sidebar={sidebar} />}
            />
            <Route
              path={routes.PATIENT_INFORMATION}
              element={<PatientInformationScreenWeb sidebar={sidebar} />}
            />
          </Routes>
        </HStack>
      </Router>
    </>
  );
}

export default WebAppNavigator;
/* eslint-disable */
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import colors from '../config/colors';
// Import Constants
import routes from './routes';
import DashboardNavigator from './DashboardNavigator';
import PatientsNavigator from './PatientsNavigator';
import ConfigNavigator from './ConfigNavigator';
import AccountScreen from '../screens/AccountScreen';
import NotificationNavigator from './NotificationNavigator';

// Refer to this doc: https://reactnavigation.org/docs/tab-based-navigation
const Tab = createBottomTabNavigator();

// Refer to this for configuration: https://reactnavigation.org/docs/bottom-tab-navigator
function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.pink,
        // tabBarInactiveTintColor: colors.black_var1,
      }}
    >
      <Tab.Screen
        name={routes.DASHBOARD}
        component={DashboardNavigator}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="notebook-outline"
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tab.Screen
        name={routes.NOTIFICATION}
        component={NotificationNavigator}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="bell-outline"
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tab.Screen
        name={routes.PATIENTS}
        component={PatientsNavigator}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="home-outline"
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tab.Screen
        name={routes.CONFIG}
        component={ConfigNavigator}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="cog-outline"
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tab.Screen
        name={routes.ACCOUNT}
        component={AccountScreen}
        options={{
          headerShown: true,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="account-circle-outline"
              color={color}
              size={size}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default AppNavigator;

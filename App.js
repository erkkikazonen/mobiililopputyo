import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet } from 'react-native';
import AddJob from './components/AddJob';
import JobList from './components/JobList';
import MonthlyDetailsScreen from './components/MonthlyDetailsScreen';

const Tab = createBottomTabNavigator();
const JobStack = createStackNavigator();

function JobStackScreen() {
  return (
    <JobStack.Navigator>
      <JobStack.Screen name="JobList" component={JobList} options={{ title: 'Job List' }} />
      <JobStack.Screen name="MonthlyDetailsScreen" component={MonthlyDetailsScreen} options={{ title: 'Monthly Details' }} />
    </JobStack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="AddJob" component={AddJob} options={{ title: 'Add Job' }} />
        <Tab.Screen name="JobStack" component={JobStackScreen} options={{ title: 'Jobs' }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
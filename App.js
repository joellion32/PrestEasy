import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { StatusBar } from 'react-native';
import { LogBox } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { DefaultTheme as DefaultThemePaper } from 'react-native-paper';
import AuthNavigation from './src/navigation/AuthNavigation';
import DrawerNavigation from './src/navigation/DrawerNavigation';
import auth from '@react-native-firebase/auth';
import SplashScreen from 'react-native-splash-screen'

LogBox.ignoreAllLogs();

export default function App() {
  const [user, setUser] = useState(undefined)

  useEffect(() => {
    SplashScreen.hide();
  }, [])

  //  change navigation menu colors
  DefaultThemePaper.colors.primary = "#fec400";
  DefaultThemePaper.colors.accent = "#fec400";
  DefaultThemePaper.colors.text = "black";

  // validate if the user is authenticated
  useEffect(() => {
    auth().onAuthStateChanged((response) => {
      setUser(response)
    })
  }, [])

  if (user === undefined) return null;

  return (
    <NavigationContainer>
      <StatusBar style="light" backgroundColor="#fec400" />
      {
        user ?
          <DrawerNavigation />
          :
          <AuthNavigation />
      }
    </NavigationContainer>
  );
}




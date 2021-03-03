import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Login from '../screens/auth/Login';
import ResetEmail from '../screens/auth/ResetEmail';


const Stack = createStackNavigator();

export default function AuthNavigation() {
    return (
        <Stack.Navigator initialRouteName="Login">
            <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
            <Stack.Screen name="ResetEmail" component={ResetEmail} options={{ headerShown: false }} />
        </Stack.Navigator>
    )
}


import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { KeyboardAvoidingView, StyleSheet, Text, View } from 'react-native';
import { TailwindProvider } from 'tailwindcss-react-native';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from './screens/HomeScreen';


const Stack = createNativeStackNavigator() ;
export default function App() {
  return (
    
    <NavigationContainer>
    <TailwindProvider>
   <Stack.Navigator>
    
   <Stack.Screen name="Home" options={{headerShown:false}} component={HomeScreen} />
   
   </Stack.Navigator>
 </TailwindProvider>
 </NavigationContainer>
 
  );
}



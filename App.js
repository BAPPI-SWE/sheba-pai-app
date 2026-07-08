import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import WelcomeScreen from "./screens/WelcomeScreen";
import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/SignupScreen";
import ServicesScreen from "./screens/ServicesScreen";
import SearchingScreen from "./screens/SearchingScreen";
import HelperHomeScreen from "./screens/HelperHomeScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome">
        <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ title: "লগইন" }} />
        <Stack.Screen name="Signup" component={SignupScreen} options={{ title: "সাইনআপ" }} />
        <Stack.Screen name="Services" component={ServicesScreen} options={{ title: "সেবা নির্বাচন" }} />
        <Stack.Screen name="Searching" component={SearchingScreen} options={{ title: "অনুরোধ" }} />
        <Stack.Screen name="HelperHome" component={HelperHomeScreen} options={{ title: "সাহায্যকারী", headerBackVisible: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import WelcomeScreen from "./screens/WelcomeScreen";
import ServicesScreen from "./screens/ServicesScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome">
        <Stack.Screen
          name="Welcome"
          component={WelcomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Services"
          component={ServicesScreen}
          options={{ title: "সেবা নির্বাচন" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
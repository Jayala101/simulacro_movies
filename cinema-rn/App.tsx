import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "./src/screens/LoginScreen";
import HomeScreen from "./src/screens/HomeScreen";
import ReservationEventsScreen from "./src/screens/ReservationEventScreen";
import MovieCatalogScreen from "./src/screens/MovieCatalogScreen";

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  ReservationEvents: undefined;
  MovieCatalog: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ title: "Login" }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: "Menú" }} />
        <Stack.Screen name="ReservationEvents" component={ReservationEventsScreen} options={{ title: "Reservation Events" }} />
        <Stack.Screen name="MovieCatalog" component={MovieCatalogScreen} options={{ title: "Movie Catalog" }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
import {NavigationContainer} from "@react-navigation/native"
import {createNativeStackNavigator} from "@react-navigation/native-stack"
import Home from "../screens/Home"
import MovieScreen from "../screens/MovieScreen";
import PersonScreen from "../screens/PersonScreen";
import SearchScreen from "../screens/SearchScreen";
import SignIn from "../screens/SignIn";
import SignUp from "../screens/SignUp";
import Account from "../screens/Account";
import Favorites from "../screens/Favorites";

const Stack = createNativeStackNavigator();

export default function AppNavigation() {
    return(
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="SignIn" options={{headerShown:false}} component={SignIn} />
                <Stack.Screen name="SignUp" options={{headerShown:false}} component={SignUp} />
                <Stack.Screen name="Home" options={{headerShown:false}} component={Home} />
                <Stack.Screen name="Movie" options={{headerShown:false}} component={MovieScreen} />
                <Stack.Screen name="Person" options={{headerShown:false}} component={PersonScreen} />
                <Stack.Screen name="Search" options={{headerShown:false}} component={SearchScreen} />
                <Stack.Screen name="Account" options={{headerShown:false}} component={Account} />
                <Stack.Screen name="Favorites" options={{headerShown:false}} component={Favorites} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}
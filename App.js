  import "react-native-gesture-handler";
  import Goals from './Screens/GoalsTab/Goals';
  import ToDo from './Screens/ToDoTab/ToDo';
  import ExpenseTracker from "./Screens/ExpensesTab/ExpenseTracker";
  import { FontAwesome5 } from '@expo/vector-icons';
  import { Foundation } from '@expo/vector-icons';
  import { View, Image, StyleSheet} from 'react-native'
  import { NavigationContainer } from '@react-navigation/native';
  import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

  const Tab = createBottomTabNavigator();

  export default function App(){
    return (
      <><View style={styles.headerImage}>
      <Image
        style={{
          width: 160,
          height: 75,
        }}
        source={require('./Screens/img/A2K-LOGO.png')} />
      </View>
      <NavigationContainer independent='true'>
          <Tab.Navigator
            screenOptions={({ route }) => ({
              tabBarIcon: ({ focused, color, size }) => GiveIcon({ route, focused, color, size }),
              headerShown: false
            })}>
            <Tab.Screen
              name="Expenses"
              component={ExpenseTracker}
              options={{
                tabBarIcon: () => <FontAwesome5 name="money-bill-wave" size={25} color="#696969" />,
                tabBarLabel: 'Expenses',
              }} />
            <Tab.Screen
              name="Goals"
              component={Goals}
              options={{
                tabBarIcon: () => <FontAwesome5 name="trophy" size={25} color="#696969" />,
                tabBarLabel: 'Goals',
              }} />
            <Tab.Screen
              name="ToDo"
              component={ToDo}
              options={{
                tabBarIcon: () => <Foundation name="clipboard-notes" size={35} color="#696969" />,
                tabBarLabel: 'ToDo',
              }} />
          </Tab.Navigator>
        </NavigationContainer></>
    )
  }

  const styles =  StyleSheet.create({
    headerImage:{
      marginTop: 45,
      marginBottom: 0,
      alignItems: 'center',
      justifyContent: 'center',
    },
    tabBarStyles: {
    },
  })
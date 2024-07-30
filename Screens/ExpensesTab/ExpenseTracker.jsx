import "react-native-gesture-handler"; 
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Statistics from "../Charts/Transactions";
import Spent from "./Index";
import Charts from "../Charts/Charts";

const Tab = createMaterialTopTabNavigator();

const ExpenseTracker = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen 
        name="Spent"
        component={Spent}
        />
        <Tab.Screen 
        name="Transactions"
        component={Statistics}
        />
        <Tab.Screen 
        name={"Charts"}
        component={Charts}
        />
    </Tab.Navigator>
  )
}

export default ExpenseTracker;
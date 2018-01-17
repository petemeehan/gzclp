import { StackNavigator } from 'react-navigation';


/*-------------------- APP COMPONENTS --------------------*/

import HomeScreen from './Components/HomeScreen/HomeScreen';
import SessionScreen from './Components/SessionScreen/SessionScreen';
import SettingsScreen from './Components/SettingsScreen/SettingsScreen';


/*-------------------- REACT NAVIGATION NAVIGATOR --------------------*/

export default StackNavigator({
  Home: {screen: HomeScreen},
  Session: {screen: SessionScreen},
  Settings: {screen: SettingsScreen}
});

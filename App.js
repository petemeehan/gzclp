import { StackNavigator } from 'react-navigation';


/*-------------------- APP COMPONENTS --------------------*/

import HomeScreen from './js/Components/Home/HomeScreen';
import SessionScreen from './js/Components/Session/SessionScreen';
import SettingsScreen from './js/Components/Settings/SettingsScreen';

import IncrementsScreen from './js/Components/Settings/Increments/IncrementsScreen';
import IncrementPickerScreen from './js/Components/Settings/Increments/IncrementPicker/IncrementPickerScreen';


/*-------------------- REACT NAVIGATION NAVIGATOR --------------------*/

export default StackNavigator({
  Home: {screen: HomeScreen},
  Session: {screen: SessionScreen},
  Settings: {screen: SettingsScreen},
  Increments: {screen: IncrementsScreen},
  IncrementPicker: {screen: IncrementPickerScreen}
});

import { StackNavigator } from 'react-navigation';

import { styles } from 'gzclp/js/styles';


/*-------------------- APP COMPONENTS --------------------*/

import HomeScreen from './js/Components/Home/HomeScreen';
import SessionScreen from './js/Components/Session/SessionScreen';
import SettingsScreen from './js/Components/Settings/SettingsScreen';

import EditSessionsPickerScreen from './js/Components/Settings/EditSessionsPicker/EditSessionsPickerScreen';
import IncrementsScreen from './js/Components/Settings/Increments/IncrementsScreen';
import IncrementsPickerScreen from './js/Components/Settings/Increments/IncrementsPickerScreen';
import WeightsScreen from './js/Components/Settings/Weights/WeightsScreen';


/*-------------------- REACT NAVIGATION NAVIGATOR --------------------*/

const MainStack = StackNavigator({
  Home: {screen: HomeScreen},
  Session: {screen: SessionScreen},
}, {
  navigationOptions: {
    headerTintColor: '#fff',
    headerStyle: styles.header,
    headerTitleStyle: styles.headerTitle,
  }
})

const SettingsStack = StackNavigator({
  Settings: {screen: SettingsScreen},
  EditSessionsPicker: {screen: EditSessionsPickerScreen},
  Increments: {screen: IncrementsScreen},
  IncrementsPicker: {screen: IncrementsPickerScreen},
  Weights: {screen: WeightsScreen},
}, {
  navigationOptions: {
    headerTintColor: '#fff',
    headerStyle: styles.header,
    headerTitleStyle: styles.headerTitle,
  }
})

const RootStack = StackNavigator({
  MainStack: {screen: MainStack},
  SettingsStack: {screen: SettingsStack},
}, {
  mode: 'modal',
  headerMode: 'none',
});

export default RootStack;

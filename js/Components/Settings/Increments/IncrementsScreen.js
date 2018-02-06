import React from 'react';
import {
  View,
  ScrollView,
  Text,
  TouchableHighlight,
} from 'react-native';

import { gzclp } from 'gzclp/js/gzclp';
import { styles, colours } from 'gzclp/js/styles';

import MenuItem from '../MenuItem';



export default class extends React.Component {
  constructor(props) {
    super(props);
  }

  static navigationOptions = ({ navigation }) => ({
    title: 'Increments',
    headerTintColor: '#fff',
    headerStyle: styles.header,
    headerTitleStyle: styles.headerTitle,
  });

  render() {
    const { navigate } = this.props.navigation;

    const liftIDsT1 = gzclp.getAllLiftIDsInTier('T1');
    const liftIDsT2 = gzclp.getAllLiftIDsInTier('T2');
    const liftIDsT3 = gzclp.getAllLiftIDsInTier('T3');

    const menuItemsT1 = [];
    const menuItemsT2 = [];
    const menuItemsT3 = [];

    for (let i = 0; i < liftIDsT1.length; i++) {
      menuItemsT1.push(
        <MenuItem
          menuItemText={gzclp.getLiftName( liftIDsT1[i] )}
          onPress={() => navigate('IncrementPicker', {
            liftID: liftIDsT1[i],
          })}
          hasNavArrow={true}
          key={i}
        />
      )
    };
    for (let i = 0; i < liftIDsT2.length; i++) {
      menuItemsT2.push(
        <MenuItem
          menuItemText={gzclp.getLiftName( liftIDsT2[i] )}
          onPress={() => navigate('IncrementPicker', {
            liftID: liftIDsT2[i],
          })}
          hasNavArrow={true}
          key={i}
        />
      )
    };
    for (let i = 0; i < liftIDsT3.length; i++) {
      menuItemsT3.push(
        <MenuItem
          menuItemText={gzclp.getLiftName( liftIDsT3[i] )}
          onPress={() => navigate('IncrementPicker', {
            liftID: liftIDsT3[i],
          })}
          hasNavArrow={true}
          key={i}
        />
      )
    };

    return (
      <ScrollView>
        <Text style={styles.menuHeading}>T1 Lifts</Text>
        <View>{menuItemsT1}</View>

        <Text style={styles.menuHeading}>T2 Lifts</Text>
        <View>{menuItemsT2}</View>

        <Text style={styles.menuHeading}>T3 Lifts</Text>
        <View>{menuItemsT3}</View>

      </ScrollView>
    )
  }
}

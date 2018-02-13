import React from 'react';
import {
  View,
  ScrollView,
  Text,
  TouchableHighlight,
} from 'react-native';

import { gzclp } from 'gzclp/js/gzclp';
import { styles, colours } from 'gzclp/js/styles';

import MenuItem from 'gzclp/js/Components/Common/MenuItem';



export default class extends React.Component {
  constructor(props) {
    super(props);
  }

  static navigationOptions = {
    title: 'Increments',
  };

  render() {
    const { navigate } = this.props.navigation;

    // TODO DUPLICATION!!...

    const liftIDs_T1 = gzclp.getAllLiftIDsInTier('T1');
    const liftIDs_T2 = gzclp.getAllLiftIDsInTier('T2');
    const liftIDs_T3 = gzclp.getAllLiftIDsInTier('T3');

    const menuItemsT1 = [];
    const menuItemsT2 = [];
    const menuItemsT3 = [];

    for (let i = 0; i < liftIDs_T1.length; i++) {
      menuItemsT1.push(
        <MenuItem
          menuItemText={gzclp.getLiftName( liftIDs_T1[i] )}
          onPress={() => navigate('IncrementsPicker', { liftID: liftIDs_T1[i] })}
          hasNavArrow={true}
          key={i}
        />
      )
    };
    for (let i = 0; i < liftIDs_T2.length; i++) {
      menuItemsT2.push(
        <MenuItem
          menuItemText={gzclp.getLiftName( liftIDs_T2[i] )}
          onPress={() => navigate('IncrementsPicker', { liftID: liftIDs_T2[i] })}
          hasNavArrow={true}
          key={i}
        />
      )
    };
    for (let i = 0; i < liftIDs_T3.length; i++) {
      menuItemsT3.push(
        <MenuItem
          menuItemText={gzclp.getLiftName( liftIDs_T3[i] )}
          onPress={() => navigate('IncrementsPicker', { liftID: liftIDs_T3[i] })}
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

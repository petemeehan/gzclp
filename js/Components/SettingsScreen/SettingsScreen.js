import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';

import { styles } from '../../styles';



export default class extends React.Component {
  static navigationOptions = {
    title: 'Settings ',
    headerTintColor: '#fff',
    headerStyle: styles.header,
  };

  render() {
    return (
      <View style={styles.genericContainer}>
        <TouchableOpacity
          style={{flexDirection: 'row', justifyContent: 'space-between'}}
          activeOpacity={0.8}
        >
          <View>
            <Text style={styles.menuText}>
              Increments
            </Text>
          </View>

          <View style={{justifyContent: 'center'}}>
            <Text style={styles.navArrow}>></Text>
          </View>
        </TouchableOpacity>
      </View>
    )
  }
}

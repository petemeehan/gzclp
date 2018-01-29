import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Button,
} from 'react-native';

import { gzclp } from '../../gzclp';
import { styles } from '../../styles';



export default class extends React.Component {
  static navigationOptions = {
    title: 'Settings ',
    headerTintColor: '#fff',
    headerStyle: styles.header,
  };

  // Remove stored data and reset program state to initial values
  async handleResetButtonPress() {
    try {
      await gzclp.deleteSavedProgramState();
      gzclp.resetProgramState();
      gzclp.refreshComponent(this);
    } catch (error) {
      console.log("Error removing data");
    }
  }

  render() {
    return (
      <View>
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

        <Button
          title='Reset Everything'
          color='#777'
          onPress={() => this.handleResetButtonPress()}
        />
      </View>
    )
  }
}

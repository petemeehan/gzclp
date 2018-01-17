import React from 'react';
import {
  Text,
  View,
} from 'react-native';

import { styles } from '../../js/styles';
import { gzclp } from '../../js/gzclp';



export default () => {
  var output = gzclp.outputProgramStateAsString();

  return (
    <View style={styles.progressDataContainer}>
      <Text style={styles.progressDataTitle}>Current Program State</Text>
      <Text style={styles.progressDataContent}>{output}</Text>
    </View>
  )
}

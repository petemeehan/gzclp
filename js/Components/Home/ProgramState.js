import React from 'react';
import {
  Text,
  View,
} from 'react-native';

import { styles } from 'gzclp/js/styles';
import { gzclp } from 'gzclp/js/gzclp';



export default () => {
  var output = gzclp.outputProgramStateAsString();

  return (
    <View style={styles.allLiftDataContainer}>
      <Text style={styles.allLiftDataTitle}>Lift Data</Text>
      <Text style={styles.allLiftDataContent}>{output}</Text>
    </View>
  )
}

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
    <View style={styles.progressDataContainer}>
      <Text style={styles.progressDataTitle}>Lift Data</Text>
      <Text style={styles.progressDataContent}>{output}</Text>
    </View>
  )
}

import React from 'react';
import {
  Text,
  View,
} from 'react-native';

import { styles } from 'gzclp/js/styles';



export default (props) => {
    var {
      tier,
      name,
      weight,
      sets,
      reps
    } = props;

    return (
      <View>
        <Text style={styles.liftName}>
          {tier} {name}
        </Text>
        <Text style={styles.liftDetails}>
          {weight} kg   {sets}×{reps}
        </Text>
      </View>
    )
}

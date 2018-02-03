import React from 'react';
import {
  Text,
  View,
  TouchableHighlight
} from 'react-native';

import { styles, colours } from 'gzclp/js/styles';



export default (props) => {
    var {
      onPress,
      menuItemText,
      hasNavArrow,
      hasMenuTick,
    } = props;

    return (
      <TouchableHighlight
        style={styles.genericContainer}
        underlayColor={colours.underlayColor}
        onPress={onPress}
      >
        <View style={styles.menuItem}>
          <Text style={styles.menuItemText}>{menuItemText}</Text>
          {hasMenuTick ? <Text style={styles.menuTick}>✓</Text> : null}
          {hasNavArrow ? <Text style={styles.navArrow}>></Text> : null}
        </View>
      </TouchableHighlight>
    )
}

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
      hasTick,
      hasNavArrow,
    } = props;

    return (
      <TouchableHighlight
        style={styles.menuItemContainer}
        underlayColor={colours.underlayColor}
        onPress={onPress}
      >
        <View style={styles.menuItemTickAndContents}>
          <View style={styles.menuItemContents}>
            <Text style={styles.menuItemText}>{menuItemText}</Text>
            {hasTick ? <Text style={styles.menuTick}>✓</Text> : null}
            {hasNavArrow ? <Text style={styles.navArrow}>></Text> : null}
          </View>
        </View>
      </TouchableHighlight>
    )
}

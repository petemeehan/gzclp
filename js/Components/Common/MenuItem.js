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
      text,
      subtext,
      hasTick,
      hasNavArrow,
    } = props;

    return (
      <TouchableHighlight
        style={styles.genericContainer}
        underlayColor={colours.underlayColor}
        onPress={onPress}
      >
        <View style={styles.menuItemContents}>
          <View>
            <Text style={styles.menuItemText}>{text}</Text>
            <Text style={styles.menuItemSubtext}>Testing</Text>
          </View>

          <View>
            {hasTick ? <Text style={styles.menuTick}>✓</Text> : null}
            {hasNavArrow ? <Text style={styles.navArrow}>></Text> : null}
          </View>
        </View>
      </TouchableHighlight>
    )
}

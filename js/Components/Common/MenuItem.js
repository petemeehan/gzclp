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
      title,
      subtextArray,
      hasTick,
      hasNavArrow,
    } = props;


    const subtextElements = [];
    if (subtextArray) {
      for (var i = 0; i < subtextArray.length; i++) {
        subtextElements.push(
          <Text style={styles.menuItemSubtext} key={i}>{subtextArray[i]}</Text>
        )
      }
    }

    return (
      <TouchableHighlight
        style={styles.genericContainer}
        underlayColor={colours.underlayColor}
        onPress={onPress}
      >
        <View style={styles.menuItemContents}>
          <View>
            <Text style={styles.menuItemText}>{title}</Text>
            {subtextArray ? subtextElements : null}
          </View>

          <View>
            {hasTick ? <Text style={styles.menuTick}>✓</Text> : null}
            {hasNavArrow ? <Text style={styles.navArrow}>></Text> : null}
          </View>
        </View>
      </TouchableHighlight>
    )
}

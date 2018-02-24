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
      subtitle,
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
            <Text style={styles.menuItemTitle}>{title}</Text>
            {subtitle ? <Text style={styles.menuItemSubtitle}>{subtitle}</Text> : null}
          </View>

          <View>
            {hasTick ? <Text style={styles.menuTick}>✓</Text> : null}
            {hasNavArrow ? <Text style={styles.navArrow}>></Text> : null}
          </View>
        </View>
      </TouchableHighlight>
    )
}

import React from 'react';
import {
  Text,
  View,
  TouchableHighlight,
  Switch,
} from 'react-native';

import { styles, colours } from 'gzclp/js/styles';



export default (props) => {
    var {
      onPress,
      title,
      subtitle,
      hasTick,
      hasNavArrow,
      hasSwitch,
      switchEnabled,
      switchOnValueChange,
    } = props;

    return (
      <TouchableHighlight
        underlayColor={colours.underlayColor}
        onPress={hasSwitch ? null : onPress}
        style={{
          backgroundColor: '#fff',
          marginBottom: 1,
        }}
      >
        <View style={styles.menuItemContainer}>
          <View style={styles.menuItemTitleContainer}>
            <Text style={!hasSwitch || switchEnabled ? styles.menuItemTitle : styles.menuItemTitleGreyedOut}>{title}</Text>
            {subtitle ? <Text style={styles.menuItemSubtitle}>{subtitle}</Text> : null}
          </View>

          <View>
            {hasTick ? <Text style={styles.menuTick}>✓</Text> : null}
            {hasNavArrow ? <Text style={styles.navArrow}>></Text> : null}

            {hasSwitch ? <Switch
              value={switchEnabled}
              onValueChange={switchOnValueChange}
            /> : null}
          </View>
        </View>
      </TouchableHighlight>
    )
}

import React from 'react';
import {
  Text,
  View,
  TouchableHighlight
} from 'react-native';

import { styles, colours } from 'gzclp/js/styles';



export default (props) => {
    var {
      isEditable,
      onPress,
      menuItemText,
      hasTick,
      hasNavArrow,
    } = props;

    const normalMenuItem =
      <TouchableHighlight
        style={styles.menuItemContainer}
        underlayColor={colours.underlayColor}
        onPress={onPress}
      >
        <View style={styles.menuItemContents}>
          <Text style={styles.menuItemText}>{menuItemText}</Text>

          <View>
            {hasTick ? <Text style={styles.menuTick}>✓</Text> : null}
            {hasNavArrow ? <Text style={styles.navArrow}>></Text> : null}
          </View>
        </View>
      </TouchableHighlight>

      const editableMenuItem =
        <View style={styles.menuItemContainer}>
          <View style={styles.menuItemContents}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableHighlight
                underlayColor='transparent'
                onPress={onPress}
              >
                <Text style={styles.menuCross}>×</Text>
              </TouchableHighlight>

              <Text style={styles.editableMenuItemText}>{menuItemText}</Text>
            </View>
          </View>
        </View>

    return isEditable ? editableMenuItem : normalMenuItem;
}

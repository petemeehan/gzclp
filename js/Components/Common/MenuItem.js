import React from 'react';
import {
  Text,
  View,
  TouchableHighlight,
  Switch,
  TextInput,
  StyleSheet
} from 'react-native';

import { styles, layoutConstants, colours } from 'gzclp/js/styles';
import { navArrow, menuTick } from 'gzclp/js/Components/Common/Icons';


// TODO Use inline menuItemStyles - since only used here and easier to keep track
// TODO Hacked to to use for starting weight form - consider making new component

export default (props) => {
    var {
      backgroundColour,
      textColour,
      borderColour,
      onPress,
      title,
      subtitle,
      info,
      hasTick,
      hasNavArrow,
      hasSwitch,
      switchEnabled,
      switchOnValueChange,
      hasTextInput,
      textInputDefaultValue,
      textInputOnChangeText,
      textInputPlaceholder,
    } = props;

    return (
      <TouchableHighlight
        underlayColor={colours.underlayColor}
        onPress={hasSwitch ? null : onPress}
        style={{
          backgroundColor: backgroundColour ? backgroundColour : 'white',
          borderTopWidth: 1,
          borderBottomWidth: 1,
          borderColor: borderColour ? borderColour: colours.lightGrey,
          marginBottom: -1,
        }}
      >
        <View style={menuItemStyles.menuItemContainer}>
          <View style={menuItemStyles.menuItemTitleContainer}>
            <Text style={!hasSwitch || switchEnabled ? menuItemStyles.menuItemTitle : menuItemStyles.menuItemTitleGreyedOut}>
              <Text style={textColour ? {color: textColour} : null}>
                {title}
              </Text>
            </Text>

            {subtitle ?
              <Text style={menuItemStyles.menuItemSubtitle}>
                <Text style={textColour ? {color: textColour} : null}>
                  {subtitle}
                </Text>
              </Text>
              : null
            }
          </View>

          {hasTextInput ?
            <TextInput
              style={[menuItemStyles.menuItemTextInput, textColour ? {color: textColour} : null]}
              keyboardType='numeric'
              placeholder={textInputPlaceholder}
              defaultValue={textInputDefaultValue}
              onChangeText={textInputOnChangeText}
              returnKeyType='done'
            />
            : null
          }

          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            {info ?
              <Text style={menuItemStyles.menuItemInfo}>{info}</Text>
              : null
            }

            {hasNavArrow ? <View style={styles.navArrow}>{navArrow}</View> : null}

            {hasTick ?
              <View style={menuItemStyles.menuTick}>
                {menuTick}
              </View>
              : null
            }

            {hasSwitch ?
              <Switch
                value={switchEnabled}
                onValueChange={switchOnValueChange}
                onTintColor={colours.primaryColour}
              />
              : null
            }
          </View>
        </View>
      </TouchableHighlight>
    )
}



const menuItemStyles = StyleSheet.create({
  menuItemContainer: {
    paddingHorizontal: layoutConstants.HORIZONTAL_PADDING,
    flexDirection: 'row',
    justifyContent: 'space-between',
    //alignItems: 'center',
    //borderWidth: 1
  },
  menuItemTitleContainer: {
    paddingVertical: layoutConstants.VERTICAL_PADDING,
    //borderWidth: 1
  },
  menuItemTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    //borderWidth: 1
  },
  menuItemTitleGreyedOut: {
    fontSize: 15,
    fontWeight: 'bold',
    opacity: 0.6,
  },
  menuItemSubtitle: {
    marginTop: 5,
    opacity: 0.8,
    fontSize: 13,
    //fontWeight: 'bold'
  },
  menuItemInfo: {
    //marginRight: 15,
    opacity: 0.7,
    fontSize: 15,
    //fontWeight: 'bold',
    //borderWidth: 1,
  },
  menuItemTextInput: {
    flex:1,
    fontSize: 15,
    textAlign: 'right'
  },
  menuTick: {
  },
  menuCross: {
  },
})

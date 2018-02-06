import {
  StyleSheet,
  Dimensions,
  StatusBar,
} from 'react-native';

StatusBar.setBarStyle('light-content');

const DEVICE_W = Dimensions.get('window').width;
const HORIZONTAL_PADDING = 15;
const VERTICAL_PADDING = 12;

const BUTTON_MARGIN = 8;
const BUTTON_SIZE = (DEVICE_W - (2 * HORIZONTAL_PADDING)) / 5 - BUTTON_MARGIN;

export const colours = {
  primaryColour: '#fa375a',
  lightGrey: '#eee',
  mediumGrey: '#999',
  darkGrey: '#666',
  successful: '#4cd964',
  //successful: '#fa375a',
  failed: '#999',
  underlayColor: '#f0f0f0',
};


export const styles = StyleSheet.create({
  header: {
    backgroundColor: colours.primaryColour
  },
  headerTitle: {
    fontWeight: 'bold',
  },
  settingsIcon: {
    marginLeft: HORIZONTAL_PADDING,
    height: 50,
    width: 25
  },
  genericContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingVertical: VERTICAL_PADDING,
    marginBottom: 1,
  },


  menuItemContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: HORIZONTAL_PADDING,
    marginBottom: 1,
  },
  menuHeading: {
    paddingHorizontal: HORIZONTAL_PADDING,
    marginTop: 22,
    marginBottom: VERTICAL_PADDING,
    fontSize: 17,
    //fontWeight: 'bold',
    //borderWidth: 1,
  },
  menuItemTickAndContents: {
    flexDirection: 'row',
    alignItems: 'center',
    //borderWidth: 1
  },
  menuItemContents: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    //borderWidth: 1
  },
  menuItemText: {
    paddingVertical: VERTICAL_PADDING,
    fontSize: 15,
    fontWeight: 'bold',
    alignItems: 'center',
    //borderWidth: 1
  },
  menuTick: {
    width: 26,
    fontSize: 22,
    color: colours.primaryColour,
    //marginRight: 5,
    //borderWidth: 1
  },
  navArrow: {
    fontSize: 22,
    color: '#bbb',
    //borderWidth: 1
  },


  nextSessionTitle: {
    color: colours.primaryColour,
    marginBottom: 5,
    fontSize: 17,
    fontWeight: 'bold',
  },
  completedSessionTitle: {
    marginBottom: 5,
    fontSize: 15,
    fontWeight: 'bold',
  },
  progressDataContainer: {
    paddingHorizontal: HORIZONTAL_PADDING,
  },
  progressDataTitle: {
    marginVertical: VERTICAL_PADDING,
  },
  progressDataContent: {
    fontFamily: 'Courier New',
  },

  liftContainer: {
    //borderWidth: 1,
    backgroundColor: '#fff',
    marginBottom: 1,
  },
  liftInfoContainer: {
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingVertical: VERTICAL_PADDING,
  },
  liftName: {
    fontSize: 17,
    fontWeight: 'bold',
  },
  liftDetails: {
    marginVertical: 5,
  },
  liftButtonsContainer: {
    marginHorizontal: HORIZONTAL_PADDING,
    marginBottom: VERTICAL_PADDING,
    flexDirection: 'row',
    flexWrap: 'wrap',
    //borderWidth: 1
  },
  // Container for both buttons including background one which gives "border" effect
  individualLiftButtonContainer: {
    marginRight: BUTTON_MARGIN,
    alignItems: 'center',
    justifyContent: 'center',
    //borderWidth: 1
  },

  liftButtonClickable: {
    backgroundColor: 'white',
    borderColor: colours.primaryColour,
    borderWidth: 1.25,
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  liftButtonNotClickable: {
    backgroundColor: colours.lightGrey,
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  liftButtonSuccessful: {
    backgroundColor: colours.primaryColour,
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  liftButtonAllSuccessful: {
    backgroundColor: colours.successful,
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  liftButtonFailed: {
    backgroundColor: colours.failed,
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Gives buttons a border when sets have been attempted
  liftButtonBorderSuccessful: {
    borderColor: colours.primaryColour,
    borderWidth: 1.5,
    width: BUTTON_SIZE + 5,
    height: BUTTON_SIZE + 5,
    borderRadius: (BUTTON_SIZE + 5) / 2,
    position: 'absolute',
  },
  liftButtonBorderFailed: {
    borderColor: colours.failed,
    borderWidth: 1.5,
    width: BUTTON_SIZE + 5,
    height: BUTTON_SIZE + 5,
    borderRadius: (BUTTON_SIZE + 5) / 2,
    position: 'absolute',
  },
  liftButtonBorderAllSuccessful: {
    borderColor: colours.successful,
    borderWidth: 1.5,
    width: BUTTON_SIZE + 5,
    height: BUTTON_SIZE + 5,
    borderRadius: (BUTTON_SIZE + 5) / 2,
    position: 'absolute',
  },

  liftButtonTextClickable: {
    color: colours.primaryColour,
  },
  liftButtonTextNotClickable: {
    color: colours.mediumGrey,
  },
  liftButtonTextSuccessful: {
    color: '#fff',
  },
  liftButtonTextFailed: {
    color: '#fff',
  },


  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colours.darkGrey,
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingVertical: 2,
  },
  timerNumbers: {
    width: 50,
    color: 'white',
    fontSize: 18,
  },
  timerText: {
    color: 'white',
  }
});

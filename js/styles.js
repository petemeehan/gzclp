import {
  StyleSheet,
  Dimensions,
  StatusBar,
} from 'react-native';

StatusBar.setBarStyle('light-content');

const DEVICE_W = Dimensions.get('window').width;
const DEVICE_MARGIN = 15;

const BUTTON_MARGIN = 8;
const BUTTON_SIZE = (DEVICE_W - (2 * DEVICE_MARGIN)) / 5 - BUTTON_MARGIN;

export const colours = {
  primaryColour: '#fa375a',
  lightGrey: '#eee',
  mediumGrey: '#999',
  darkGrey: '#666',
  successful: '#4cd964',
  //successful: '#fa375a',
  failed: '#999',
  underlayColor: '#ddd',
};

export const styles = StyleSheet.create({
  header: {
    backgroundColor: colours.primaryColour
  },
  headerTitle: {
    fontWeight: 'bold',
  },
  settingsIcon: {
    marginLeft: DEVICE_MARGIN,
    height: 50,
    width: 25
  },
  navArrow: {
    fontSize: 22,
    color: '#bbb',
  },
  genericContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: DEVICE_MARGIN,
    paddingVertical: 10,
    marginBottom: 1,
  },

  menuHeading: {
    paddingHorizontal: DEVICE_MARGIN,
    marginTop: 30,
    marginBottom: 10,
    fontSize: 15,
    //fontWeight: 'bold',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 17,
    alignItems: 'center',
  },
  allText: {
    color: 'red'
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
    paddingHorizontal: DEVICE_MARGIN,
  },
  progressDataTitle: {
    marginVertical: 10,
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
    paddingHorizontal: DEVICE_MARGIN,
    paddingVertical: 10,
  },
  liftName: {
    fontSize: 17,
    fontWeight: 'bold',
  },
  liftDetails: {
    marginVertical: 5,
  },
  liftButtonsContainer: {
    marginHorizontal: DEVICE_MARGIN,
    marginBottom: 15,
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
    paddingHorizontal: DEVICE_MARGIN,
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

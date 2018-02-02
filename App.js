import React from 'react';
import { View, Image } from 'react-native';
import { TabNavigator, StackNavigator } from 'react-navigation';
import { Button, Icon, Text } from 'react-native-elements';
import { List, ListItem } from 'react-native-elements';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { CoralHeader, colors } from './src/ui.js';

import { MyRecordsScreen } from './src/screens/MyRecordsScreen.js';
import { ViewRecordScreen } from './src/screens/ViewRecordScreen.js';
import { RequestHealthTipScreen } from './src/screens/RequestHealthTipScreen.js';
import { RequestHealthTipConfirmScreen } from './src/screens/RequestHealthTipConfirmScreen.js';
import { AddRecordScreen } from './src/screens/AddRecordScreen.js';
import { QRCodeReaderScreen } from './src/screens/QRCodeReaderScreen.js';
import { AddBloodTestRecordScreen } from './src/screens/AddBloodTestRecordScreen';
import { AddGeneticTestRecordScreen } from './src/screens/AddGeneticTestRecordScreen';
import { CameraScreen } from './src/screens/CameraScreen';

import { SharedRecordsScreen } from './src/screens/SharedRecordsScreen.js';
import { SettingsScreen } from './src/screens/SettingsScreen.js';
import { QRCodeScreen } from './src/screens/QRCodeScreen.js';

const MyRecordsNavigator = StackNavigator({
  MyRecords: { screen: MyRecordsScreen },
  ViewRecord: { screen: ViewRecordScreen },
  RequestHealthTip: { screen: RequestHealthTipScreen },
  RequestHealthTipConfirm: { screen: RequestHealthTipConfirmScreen },
  AddRecord: { screen: AddRecordScreen },
  AddBloodTestRecord: {screen: AddBloodTestRecordScreen},
  AddGeneticTestRecord: {screen: AddGeneticTestRecordScreen},
  Camera: { 
    screen: CameraScreen,
    navigationOptions: ({ navigation }) => ({
      title: 'Camera',
      tabBarVisible: false
    })
  },
  QRCodeReader: { 
    screen: QRCodeReaderScreen,
    navigationOptions: ({ navigation }) => ({
      title: 'QR Code',
      tabBarVisible: false
    })
  }
},{
  headerMode: 'none'
});

const SharedRecordsNavigator = StackNavigator({
  SharedRecords: { screen: SharedRecordsScreen },
  QRCode: { screen: QRCodeScreen },
},{
  headerMode: 'none'
});

const App = TabNavigator({
  MyRecords: {
    screen: MyRecordsNavigator,
    navigationOptions: {
      tabBarLabel: 'My Records',
      tabBarIcon: ({ tintColor, focused }) => (
        <Ionicons
          name={focused ? 'ios-medkit' : 'ios-medkit-outline'}
          size={26}
          style={{ color: tintColor }}
        />
      )
    },
  },
  Friends: {
    screen: SharedRecordsNavigator,
    navigationOptions: {
      tabBarLabel: 'Shared Records',
      tabBarIcon: ({ tintColor, focused }) => (
        <Ionicons
          name={focused ? 'ios-people' : 'ios-people-outline'}
          size={26}
          style={{ color: tintColor }}
        />
      ),
    },
  },
  Settings: {
    screen: SettingsScreen,
    navigationOptions: {
      tabBarLabel: 'Settings',
      tabBarIcon: ({ tintColor, focused }) => (
        <Ionicons
          name={focused ? 'ios-settings' : 'ios-settings-outline'}
          size={26}
          style={{ color: tintColor }}
        />
      ),
    },
  },

});

export default App;



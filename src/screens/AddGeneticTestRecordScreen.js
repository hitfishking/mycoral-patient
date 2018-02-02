import moment from 'moment'
import React from 'react';
import { View } from 'react-native';
import { Button, List, ListItem, Text, CheckBox } from 'react-native-elements'
import { NavigationActions } from 'react-navigation';

import { CoralHeader, colors } from '../ui.js';
import { TestRecordScreen } from './TestRecordScreen';

const backAction = NavigationActions.back();

export class AddGeneticTestRecordScreen extends TestRecordScreen {

  constructor(props) {
    super(props);

    this.state = {checked:[false, false]};   
  }

  onChangeValue(index) {
    let state = this.state;
    this.state.checked[index] = !this.state.checked[index];
    this.setState(state);
  }

  addRecord() {
    let results = [
      {"key":"BRCA1", "value": (this.state.checked[0]) ? "positive" : "negative", "type":"gene", "valueType":"mutation"},
      {"key":"BRCA2", "value": (this.state.checked[1]) ? "positive" : "negative", "type":"gene", "valueType":"mutation"}
    ];

    let record = this.createRecord(this.props.navigation.state.params.recordsList, results, 'genetic');

    console.log(record);

    this.props.navigation.state.params.onRecordAdded(record);
    this.props.navigation.dispatch(backAction);
  }

  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'space-between', backgroundColor: colors.bg  }}>
        <CoralHeader title='Add Basic Heart Metrics Test' subtitle='Fill in your record information as below.'/>

        <Text h3 style={{textAlign: 'center', marginTop: 20}}>
          Basic Heart Metrics
        </Text>
        <Text style={{textAlign: 'center'}}>
          Date: {moment().format('MMMM Do, YYYY')}
        </Text>

        <List containerStyle={{marginBottom: 20}}>
          {
            [
              {"key":"BRCA1"},
              {"key":"BRCA2"}
            ].map((item, index) => (
              <ListItem
                key={item.key}
                title={
                  <CheckBox
                    title={item.key}
                    onPress={() => this.onChangeValue(index)}
                    checked={this.state.checked[index]}
                  />
                }
                hideChevron={true}
              />
            ))
          }
        </List>

        <View>
          <Button
            style={{marginBottom: 10}}
            backgroundColor={colors.green}
            icon={{name: 'ios-add-circle', type: 'ionicon'}}
            title='Add record' 
            onPress={() => this.addRecord()}
          />
          <Button
            style={{ marginBottom: 20 }}
            backgroundColor={colors.red}
            icon={{name: 'ios-arrow-back', type: 'ionicon'}}
            title='Back'
            onPress={() => this.props.navigation.dispatch(backAction)}
          />
        </View>
      </View>
    );
  }
}
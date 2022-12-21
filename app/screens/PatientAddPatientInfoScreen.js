import React, { useState } from 'react';
import {
  Box,
  Input,
  FormControl,
  Text,
  Button,
  Radio,
  HStack,
  Select,
} from 'native-base';
import DateTimePicker from '@react-native-community/datetimepicker';

import { ScrollView } from 'react-native';
import AddPatientProgress from 'app/components/AddPatientProgress';
import AddPatientBottomButtons from 'app/components/AddPatientBottomButtons';
import colors from 'app/config/colors';

export function PatientAddPatientInfoScreen(props) {
  const { nextQuestionHandler, handleFormData, formData } = props;
  // console.log('PATIENT', formData);

  const page = 'patientList';
  // const [error, setError] = useState(false);

  // const submitFormData = (e) => {
  //   e.preventDefault();

  //   // checking if value of first name and last name is empty show error else take to step 2
  //   if (
  //     validator.isEmpty(values.firstName) ||
  //     validator.isEmpty(values.lastName)
  //   ) {
  //     setError(true);
  //   } else {
  //     nextQuestionHandler();
  //   }
  // };

  return (
    <ScrollView>
      <Box alignItems="center">
        <Box w="75%">
          <AddPatientProgress value={20} />
          <Text
            textAlign="center"
            marginTop={6}
            bold
            fontSize="2xl"
            color={colors.green}
          >
            Patient Information
          </Text>

          <FormControl marginTop={4}>
            <FormControl.Label>First Name</FormControl.Label>
            <Input
              placeholder="First Name"
              value={formData.FirstName}
              onChangeText={handleFormData(page, 'FirstName')}
            />
          </FormControl>

          <FormControl>
            <FormControl.Label>Last Name</FormControl.Label>
            <Input
              placeholder="Last Name"
              value={formData.LastName}
              onChangeText={handleFormData(page, 'LastName')}
            />
          </FormControl>

          <FormControl>
            <FormControl.Label>Preferred Name</FormControl.Label>
            <Input
              placeholder="Preferred Name"
              value={formData.PreferredName}
              onChangeText={handleFormData(page, 'PreferredName')}
            />
          </FormControl>

          <FormControl>
            <FormControl.Label>Preferred Language</FormControl.Label>
            <Select
              placeholder="Select Language"
              selectedValue={formData.PreferredLanguageListID}
              onValueChange={handleFormData(page, 'PreferredLanguageListID')}
            >
              <Select.Item label="English" value={1} />
              <Select.Item label="Chinese" value={2} />
              <Select.Item label="Malay" value={3} />
              <Select.Item label="Tamil" value={4} />
            </Select>
          </FormControl>

          <FormControl>
            <FormControl.Label>NRIC</FormControl.Label>
            <Input
              placeholder="NRIC"
              value={formData.NRIC}
              onChangeText={handleFormData(page, 'NRIC')}
            />
          </FormControl>

          <FormControl>
            <FormControl.Label>Address</FormControl.Label>
            <Input
              placeholder="Address"
              value={formData.Address}
              onChangeText={handleFormData(page, 'Address')}
            />
          </FormControl>

          <FormControl>
            <FormControl.Label>Home Telephone No.</FormControl.Label>
            <Input
              placeholder="Home Telephone Number (Optional)"
              value={formData.HomeNo}
              onChangeText={handleFormData(page, 'HomeNo')}
            />
          </FormControl>

          <FormControl>
            <FormControl.Label>Handphone No.</FormControl.Label>
            <Input
              placeholder="Handphone Number (Optional)"
              value={formData.HandphoneNo}
              onChangeText={handleFormData(page, 'HandphoneNo')}
            />
          </FormControl>

          <FormControl>
            <FormControl.Label>Gender </FormControl.Label>
            <Radio.Group
              value={formData.Gender}
              onChange={handleFormData(page, 'Gender')}
            >
              <HStack space={4}>
                <Radio value="M" size="sm">
                  Male
                </Radio>
                <Radio value="F" size="sm">
                  Female
                </Radio>
              </HStack>
            </Radio.Group>
          </FormControl>

          {/* Reference: https://github.com/react-native-datetimepicker/datetimepicker
          TODO: Align to the left*/}
          <FormControl>
            <HStack />
            <FormControl.Label>Date of Birth </FormControl.Label>
            <DateTimePicker
              value={formData.DOB}
              onChange={handleFormData(page, 'DOB')}
            />
          </FormControl>

          <FormControl>
            <HStack />
            <FormControl.Label>Date of Joining </FormControl.Label>
            <DateTimePicker
              value={formData.StartDate}
              onChange={handleFormData(page, 'StartDate')}
            />
          </FormControl>

          <FormControl>
            <HStack />
            <FormControl.Label>Date of Leaving (Optional) </FormControl.Label>
            <DateTimePicker
              value={formData.DOL}
              onChange={handleFormData(page, 'DOL')}
            />
          </FormControl>
        </Box>
        <AddPatientBottomButtons nextQuestionHandler={nextQuestionHandler} />
      </Box>
    </ScrollView>
  );
}

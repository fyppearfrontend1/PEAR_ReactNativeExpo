import React from 'react';
import { Box, Input, FormControl, Text, Select, Divider } from 'native-base';
import colors from 'app/config/colors';
import typography from 'app/config/typography';

function AddPatientGuardian({ i, title, formData, handleFormData }) {
  const page = 'guardianInfo';
  const guardian = formData.guardianInfo[i]; //guardianInfo[0].FirstName

  // constant values for relationships
  const listOfRelationships = [
    { list_RelationshipID: 1, value: 'Husband' },
    { list_RelationshipID: 2, value: 'Wife' },
    { list_RelationshipID: 3, value: 'Child' },
    { list_RelationshipID: 4, value: 'Parent' },
    { list_RelationshipID: 5, value: 'Sibling' },
    { list_RelationshipID: 6, value: 'Grandchild' },
    { list_RelationshipID: 7, value: 'Friend' },
    { list_RelationshipID: 8, value: 'Nephew' },
    { list_RelationshipID: 9, value: 'Niece' },
    { list_RelationshipID: 10, value: 'Aunt' },
    { list_RelationshipID: 11, value: 'Uncle' },
    { list_RelationshipID: 12, value: 'Grandparent' },
  ];

  return (
    <Box>
      {title == 1 ? null : <Divider mt={10} />}

      <Text
        textAlign="center"
        marginTop={6}
        bold
        fontSize="2xl"
        color={colors.green}
      >
        Guardian Information {title}
      </Text>

      <FormControl marginTop={4}>
        <FormControl.Label>Guardian First Name</FormControl.Label>
        <Input
          placeholder="Guardian First Name"
          value={guardian.FirstName}
          onChangeText={handleFormData(page, 'FirstName', i)}
        />
      </FormControl>

      <FormControl>
        <FormControl.Label>Guardian Last Name</FormControl.Label>
        <Input
          placeholder="Guardian Last Name"
          value={guardian.LastName}
          onChangeText={handleFormData(page, 'LastName', i)}
        />
      </FormControl>

      <FormControl>
        <FormControl.Label>Guardian NRIC</FormControl.Label>
        <Input
          placeholder="Guardian NRIC"
          value={guardian.NRIC}
          onChangeText={handleFormData(page, 'NRIC', i)}
        />
      </FormControl>

      <FormControl>
        <FormControl.Label>Guardian is Patient's</FormControl.Label>
        <Select
          placeholder="Select"
          selectedValue={guardian.RelationshipID}
          onValueChange={handleFormData(page, 'RelationshipID', i)}
        >
          {listOfRelationships.map((item) => (
            <Select.Item label={item.value} value={item.list_RelationshipID} />
          ))}
        </Select>
      </FormControl>

      <FormControl>
        <FormControl.Label>Guardian's Handphone No.</FormControl.Label>
        <Input
          placeholder="Guardian's Handphone Number"
          value={guardian.ContactNo}
          onChangeText={handleFormData(page, 'ContactNo', i)}
        />
      </FormControl>

      <FormControl>
        <FormControl.Label>Guardian Email </FormControl.Label>
        <Input
          placeholder="Guardian Email"
          value={guardian.Email}
          onChangeText={handleFormData(page, 'Email', i)}
        />
      </FormControl>
    </Box>
  );
}

export default AddPatientGuardian;
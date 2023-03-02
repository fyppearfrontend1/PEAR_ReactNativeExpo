import React, { useState } from 'react';
import { Box, ScrollView, Progress } from 'native-base';

import { MaterialIcons } from '@expo/vector-icons';
import colors from 'app/config/colors';

import AddPatientGuardian from 'app/components/AddPatientGuardian';
import AddPatientBottomButtons from 'app/components/AddPatientBottomButtons';
import AddPatientProgress from 'app/components/AddPatientProgress';

function PatientAddGuardianScreen(props) {
  const {
    nextQuestionHandler,
    prevQuestionHandler,
    formData,
    setFormData,
    handleFormData,
    componentList,
    errorMessage,
  } = props;

  const concatFormData = () => {
    var guardianInfo = formData.guardianInfo.concat({
      FirstName: '',
      LastName: '',
      ContactNo: '',
      NRIC: '',
      IsChecked: false,
      Email: '',
      RelationshipID: 1,
      IsActive: true,
    });
    setFormData((prevState) => ({
      ...prevState,
      guardianInfo,
    }));
  };

  const removeFormData = () => {
    var guardianInfo = [...formData.guardianInfo];
    guardianInfo.pop();
    setFormData((prevState) => ({
      ...prevState,
      guardianInfo,
    }));
  };

  const [guardianInfoDisplay, setGuardianInfoDisplay] = useState(
    componentList.guardian,
  );
  const addNewGuardianComponent = () => {
    setGuardianInfoDisplay([...guardianInfoDisplay, {}]);
    concatFormData();
  };

  const removeGuardianComponent = (index) => {
    const list = [...guardianInfoDisplay];
    list.splice(index, 1);
    setGuardianInfoDisplay(list);
    removeFormData();
  };

  console.log(formData.guardianInfo);

  return (
    <ScrollView>
      <Box alignItems="center">
        <Box w="75%">
          <AddPatientProgress value={60} />
          {guardianInfoDisplay
            ? guardianInfoDisplay.map((item, index) => (
                <Box key={index}>
                  <AddPatientGuardian
                    key={item}
                    i={index}
                    title={index + 1}
                    formData={formData}
                    handleFormData={handleFormData}
                    errorMessage={errorMessage}
                  />
                </Box>
              ))
            : null}
        </Box>
        <AddPatientBottomButtons
          list={guardianInfoDisplay}
          nextQuestionHandler={() =>
            nextQuestionHandler(formData, 'guardian', guardianInfoDisplay)
          }
          prevQuestionHandler={() =>
            prevQuestionHandler('guardian', guardianInfoDisplay)
          }
          addComponent={addNewGuardianComponent}
          removeComponent={removeGuardianComponent}
          max={2}
        />
      </Box>
    </ScrollView>
  );
}
export default PatientAddGuardianScreen;

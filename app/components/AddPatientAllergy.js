// Lib
import React, { useState, useCallback, useEffect } from 'react';
import { Box, VStack, Text, Divider } from 'native-base';
import { StyleSheet, Platform, View } from 'react-native';

// Configurations
import colors from 'app/config/colors';
import typography from 'app/config/typography';

// Hooks
import useGetSelectionOptions from 'app/hooks/useGetSelectionOptions';

// Components
import CommonInputField from 'app/components/CommonInputField';
import SelectionInputField from 'app/components/SelectionInputField';
import LoadingWheel from 'app/components/LoadingWheel';
import InputFieldCommon from './InputFieldCommon';

function AddPatientAllergy({ i, title, formData, handleFormData, onError }) {
  // retrieve dropdown options from hook
  const { data, isError, isLoading } = useGetSelectionOptions('Allergy');
  const {
    data: reactionData,
    isError: reactionError,
    isLoading: reactionLoading,
  } = useGetSelectionOptions('AllergyReaction');

  const page = 'allergyInfo';
  const allergy = formData.allergyInfo[i]; //allergyInfo[0].allergyName
  const [isErrors, setIsErrors] = useState([false]);
  const [allergyOption, setAllergyOption] = useState(allergy.AllergyListID);

  // constant values for list of allergies
  const [listOfAllergies, setListOfAllergies] = useState([
    // { list_AllergyID: 1, value: 'To Be Updated' },
    { value: 2, label: 'None' },
    { value: 3, label: 'Corn' },
    { value: 4, label: 'Eggs' },
    { value: 5, label: 'Fish' },
    { value: 6, label: 'Meat' },
    { value: 7, label: 'Milk' },
    { value: 8, label: 'Peanuts' },
    { value: 9, label: 'Tree nuts' },
    { value: 10, label: 'Shellfish' },
    { value: 11, label: 'Soy' },
    { value: 12, label: 'Wheat' },
    { value: 13, label: 'Seafood' },
  ]);

  // constant values for list of allergy reactions
  const [listOfAllergyReactions, setListOfAllergyReactions] = useState([
    { value: 1, label: 'Rashes' },
    { value: 2, label: 'Sneezing' },
    { value: 3, label: 'Vomitting' },
    { value: 4, label: 'Nausea' },
    { value: 5, label: 'Swelling' },
    { value: 6, label: 'Difficulty Breathing' },
    { value: 7, label: 'Diarrhea' },
    { value: 8, label: 'Abdominal cramp or pain' },
    { value: 9, label: 'Nasal Congestion' },
    { value: 10, label: 'Itching' },
    { value: 11, label: 'Hives' },
  ]);

  const handleAllergyState = useCallback(
    (state) => {
      setIsErrors((prevErrorStates) => {
        const updatedErrorStates = [...prevErrorStates];
        updatedErrorStates[0] = state;
        return updatedErrorStates;
      });
    },

    [],
  );
  const handleReactionState = useCallback(
    (state) => {
      setIsErrors((prevErrorStates) => {
        const updatedErrorStates = [...prevErrorStates];
        updatedErrorStates[1] = state;
        return updatedErrorStates;
      });
    },

    [],
  );
  const handleRemarksState = useCallback(
    (state) => {
      setIsErrors((prevErrorStates) => {
        const updatedErrorStates = [...prevErrorStates];
        updatedErrorStates[2] = state;
        return updatedErrorStates;
      });
    },

    [],
  );
  // parent callback function to enable editing of the errorStates array tracked by
  // the parent
  useEffect(() => {
    onError(i, isErrors.includes(true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isErrors]);

  // Add/Remove the states for the additional components reaction and remarks when
  // they are rendered or de-rendered respectively.
  useEffect(() => {
    if (allergyOption <= 2 && isErrors.length > 1) {
      const errorList = [...isErrors];
      // Remove the last 2 elements corresponding to reactions and remarks fields
      let updatedErrors = errorList.slice(0, -2);
      setIsErrors(updatedErrors);
      handleFormData(page, 'AllergyReactionListID', i)(null);
      handleFormData(page, 'AllergyRemarks', i)('');
    }
    if (allergyOption > 2 && isErrors.length < 3) {
      const newStates = [true, true];
      setIsErrors([...isErrors, ...newStates]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allergyOption]);

  // allergyListID is stored in a state to track it for the useEffect above.
  useEffect(() => {
    setAllergyOption(allergy.AllergyListID);
    if (allergyOption > 2 && allergy.AllergyReactionListID === null) {
      handleFormData(page, 'AllergyReactionListID', i)(1);
    } else if (allergyOption === 2) {
      handleFormData(page, 'AllergyReactionListID', i)(null);
      handleFormData(page, 'AllergyRemarks', i)('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allergy.AllergyListID, allergyOption]);

  useEffect(() => {
    if (!isLoading && !isError && data) {
      setListOfAllergies(data);
    }
  }, [data, isError, isLoading]);

  useEffect(() => {
    if (!reactionLoading && !reactionError && reactionData) {
      setListOfAllergyReactions(reactionData);
    }
  }, [reactionData, reactionError, reactionLoading]);

  return isLoading || reactionLoading ? (
    <LoadingWheel />
  ) : (
    <Box w="100%">
      <VStack>
        <View style={styles.formContainer}>
          <View style={styles.titleContainer}>
            {title === 1 ? null : <Divider w="80%" mt={10} />}
            <Text
              marginTop={6}
              bold
              fontSize="2xl"
              color={colors.green}
              style={styles.text}
            >
              Allergy Information {title}
            </Text>
          </View>
          <SelectionInputField
            isRequired
            title={'Select Allergy'}
            placeholderText={'Select Allergy'}
            onDataChange={handleFormData(page, 'AllergyListID', i)}
            value={allergy.AllergyListID}
            dataArray={listOfAllergies}
            onChildData={handleAllergyState}
          />
          {/* When Allergy is not "None" show the rest of the form*/}
          {allergy.AllergyListID > 2 ? (
            <>
              <SelectionInputField
                isRequired={allergy.AllergyListID > 2 ? true : false}
                title={'Select Reaction'}
                placeholderText={'Select Reaction'}
                onDataChange={handleFormData(page, 'AllergyReactionListID', i)}
                value={allergy.AllergyReactionListID}
                dataArray={listOfAllergyReactions}
                onChildData={handleReactionState}
              />

              <InputFieldCommon
                isRequired={allergy.AllergyListID > 2 ? true : false}
                title={'Remarks'}
                value={allergy.AllergyRemarks}
                onChangeText={handleFormData(page, 'AllergyRemarks', i)}
                variant={'multiLine'}
                onChildData={handleRemarksState}
              />
            </>
          ) : (
            <></>
          )}
        </View>
      </VStack>
    </Box>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingLeft: '10%',
    width: '90%',
  },
  titleContainer: {
    alignItems: 'center',
    width: '100%',
  },
  text: {
    fontWeight: 'bold',
    fontFamily: `${
      Platform.OS === 'ios' ? typography.ios : typography.android
    }`,
  },
});

export default AddPatientAllergy;

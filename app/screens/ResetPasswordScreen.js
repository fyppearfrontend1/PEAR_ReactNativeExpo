import React from 'react';
import { useState } from 'react';
import { Platform, Alert, StyleSheet } from 'react-native';
import {
  VStack,
  HStack,
  Input,
  FormControl,
  View,
  Select,
  Box,
  Center,
} from 'native-base';
import userApi from 'app/api/user';
import typography from 'app/config/typography';
import colors from 'app/config/colors';
import errors from 'app/config/errors';

import AppButton from 'app/components/AppButton';
import ErrorMessage from 'app/components/ErrorMessage';
import CustomFormControl from 'app/components/CustomFormControl';

function ResetPasswordScreen(props) {
  const { navigation, route } = props;
  const [role, setRole] = useState('Supervisor');
  const [email, setEmail] = useState('');
  const [resetFailed, setResetFailed] = useState(false);

  const handleEmail = (e) => {
    setEmail(e);
  };

  const onPressReset = async () => {
    console.log(email, role);
    const result = await userApi.resetPassword(email, role);
    console.log(result);
    if (!result.ok) {
      return setResetFailed(true);
    }

    setResetFailed(false);
    Alert.alert('Instructions to reset password have been sent to email.');
    navigation.goBack();
  };

  return (
    <View>
      <VStack>
        <Center>
          <CustomFormControl
            title="Email"
            onChangeText={handleEmail}
            placeholder="jess@gmail.com"
          />

          <FormControl maxW="80%" mt="5">
            <VStack alignItems="flex-start">
              <FormControl.Label
                _text={{
                  fontFamily: `${
                    Platform.OS === 'ios' ? 'Helvetica' : typography.android
                  }`,
                  fontWeight: 'bold',
                }}
              >
                Role
              </FormControl.Label>

              <Select
                accessibilityLabel="Select Role"
                borderRadius="25"
                fontFamily={
                  Platform.OS === 'ios' ? typography.ios : typography.android
                }
                height="50"
                minWidth="full"
                minHeight="3%"
                placeholder="Select role"
                placeholderTextColor={colors.medium}
                onValueChange={(itemValue) => setRole(itemValue)}
                selectedValue={role}
                size="18"
              >
                <Select.Item label="Supervisor" value="Supervisor" />
                <Select.Item label="Guardian" value="Guardian" />
                <Select.Item label="Doctor" value="Doctor" />
                <Select.Item label="Caregiver" value="Caregiver" />
                <Select.Item label="Nurse" value="Nurse" />
              </Select>
            </VStack>
          </FormControl>
        </Center>

        <Center>
          <Box>
            <ErrorMessage
              visible={resetFailed}
              message={errors.resetPasswordError}
            />
          </Box>
        </Center>

        <View style={styles.buttonsContainer}>
          <AppButton title="Reset" color="green" onPress={onPressReset} />
        </View>
      </VStack>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonsContainer: {
    width: '50%',
    padding: 30,
    alignSelf: 'flex-start',
  },
});

export default ResetPasswordScreen;

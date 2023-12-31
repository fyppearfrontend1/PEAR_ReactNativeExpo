import React, { useContext } from 'react';
import { useState } from 'react';
import { Alert, StyleSheet, ActivityIndicator } from 'react-native';
import { VStack, View, Icon, Box, Center } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import userApi from 'app/api/user';
import authStorage from 'app/auth/authStorage';
import AuthContext from 'app/auth/context';
import colors from 'app/config/colors';
import AppButton from 'app/components/AppButton';
import CustomFormControl from 'app/components/CustomFormControl';
import * as Yup from 'yup';
import ErrorMessage from 'app/components/ErrorMessage';
import { Platform } from 'react-native';

function ChangePasswordScreen(props) {
  const [isLoading, setIsLoading] = useState(false);
  const authContext = useContext(AuthContext);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const { sidebar } = props;

  const handleOldPassword = (e) => {
    setOldPassword(e);
  };

  const handleNewPassword = (e) => {
    setNewPassword(e);
  };

  const schema = Yup.object().shape({
    oldPassword: Yup.string().required('Old Password is a required field.'),
    newPassword: Yup.string()
      .min(6, 'New Password must be at least 6 characters.')
      .required('New Password is a required field.'),
  });

  const validate = async () => {
    let formData = {
      oldPassword: oldPassword,
      newPassword: newPassword,
    };

    try {
      // Validate the form data against the schema and set errors when needed
      await schema.validate(formData, { abortEarly: false });
      return true;
    } catch (error) {
      if (error.inner) {
        const errorList = {};
        error.inner.forEach((e) => {
          errorList[e.path] = e.message;
        });
        setErrors(errorList);
        return false;
      }
    }
  };

  const onPressConfirm = async () => {
    const validation = await validate();
    if (!validation) {
      return;
    }

    setIsLoading(true);
    const currentUser = await authStorage.getUser();
    const result = await userApi.changePassword(
      currentUser.email,
      oldPassword,
      newPassword,
    );
    // console.log(result.data);
    if (!result.ok) {
      setErrors({
        api: result.data.message,
      });
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
    let alertTxt = 'Password changed successfully. Please login again.';
    Platform.OS === 'web' ? alert(alertTxt) : Alert.alert(alertTxt);
    // Redirects the user to Welcome screen by logging out after successful password change.
    authContext.setUser(null);
    await authStorage.removeToken();
  };

  return (
    <View
      style={
        Platform.OS === 'web'
          ? {
              display: 'flex',
              alignItems: 'center',
              width: sidebar ? '83vw' : '100vw',
            }
          : {}
      }
    >
      <VStack>
        <Center>
          <CustomFormControl
            isRequired
            isInvalid={'oldPassword' in errors}
            title="Old Password"
            onChangeText={handleOldPassword}
            placeholder="Enter Old Password"
            value={oldPassword}
            ErrorMessage={errors.oldPassword}
            InputRightElement={
              <Icon
                as={
                  <MaterialIcons
                    name={showOld ? 'visibility' : 'visibility-off'}
                  />
                }
                color={colors.black}
                mr="5"
                onPress={() => setShowOld(!showOld)}
                size={5}
              />
            }
            type={showOld ? 'text' : 'password'}
          />

          <CustomFormControl
            isRequired
            isInvalid={'newPassword' in errors}
            title="New Password"
            onChangeText={handleNewPassword}
            placeholder="Enter New Password"
            ErrorMessage={errors.newPassword}
            value={newPassword}
            HelperText="Password must be at least 6 characters, containing one uppercase, one lowercase and one non-alphanumeric."
            InputRightElement={
              <Icon
                as={
                  <MaterialIcons
                    name={showNew ? 'visibility' : 'visibility-off'}
                  />
                }
                color={colors.black}
                mr="5"
                onPress={() => setShowNew(!showNew)}
                size={5}
              />
            }
            type={showNew ? 'text' : 'password'}
          />

          <Box maxW="70%">
            <ErrorMessage visible={'api' in errors} message={errors.api} />
          </Box>

          <View style={styles.buttonsContainer}>
            {isLoading ? (
              <ActivityIndicator color={colors.primary_overlay_color} />
            ) : (
              <AppButton
                title="Confirm"
                color="green"
                onPress={onPressConfirm}
              />
            )}
          </View>
        </Center>
      </VStack>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonsContainer: {
    width: '50%',
    paddingVertical: 30,
    alignSelf: 'center',
  },
});

export default ChangePasswordScreen;

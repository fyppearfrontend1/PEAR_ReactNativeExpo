import React from 'react';
import { useState } from 'react';
import { Platform, Alert, ActivityIndicator } from 'react-native';
import {
  Image,
  VStack,
  HStack,
  AspectRatio,
  Center,
  ScrollView,
  Text,
  Button,
  Box,
} from 'native-base';
import typography from 'app/config/typography';
import colors from 'app/config/colors';
import { TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import userApi from 'app/api/user';
import routes from 'app/navigation/routes';
import EditField from 'app/components/EditField';
import ErrorMessage from 'app/components/ErrorMessage';
import UserInformationCard from 'app/components/UserInformationCard';
import * as Yup from 'yup';
import { useLocation, useNavigate } from 'react-router-dom';

function AccountEditScreen(props) {
  const [isLoading, setIsLoading] = useState(false);
  const { navigation, route } = props;
  const { state } = Platform.OS === 'web' ? useLocation() : {};
  const userProfile = Platform.OS === 'web' ? state.userProfile : route.params;

  // useNavigate() hook cannot work on mobile
  const navigate = Platform.OS === 'web' ? useNavigate() : null;

  const [formData, setFormData] = useState({
    preferredName: userProfile.preferredName,
    contactNo: userProfile.contactNo,
  });
  const [profilePicture, setProfilePicture] = useState(
    userProfile.profilePicture,
  );
  const [errors, setErrors] = useState({});

  // set front end validation schema according to Validation Rules document on Confluence
  const schema = Yup.object().shape({
    preferredName: Yup.string().required('Preferred Name is a required field.'),
    contactNo: Yup.string()
      .matches(/^$|^[869][0-9]{7}$/, {
        message:
          'Contact No. must start with the digit 6, 8 or 9, and must have 8 digits.',
      })
      .required('Contact No. is a required field.'),
  });

  const handleFormData =
    (input = null) =>
    (e, date = null) => {
      const newData = formData;
      date ? (newData[input] = date) : (newData[input] = e);
      setFormData(() => ({
        preferredName: newData.preferredName,
        contactNo: newData.contactNo,
      }));
    };

  const validate = async () => {
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

  const handleOnPressToSave = async () => {
    // carry out front end validation first before calling api
    const validation = await validate();
    if (!validation) {
      return;
    }

    setIsLoading(true);
    const result = await userApi.updateUser(formData, profilePicture);
    if (!result.ok) {
      // set errors resulting from back end validation after calling api
      setErrors({
        api: result.data.message,
      });
      setIsLoading(false);
      return;
    }

    setIsLoading(false);

    const alertTxt = 'Successfully updated.';
    Platform.OS === 'web' ? alert(alertTxt) : Alert.alert(alertTxt);

    // redirect user to account screen after successful update
    if (Platform.OS === 'web') {
      navigate('/' + routes.ACCOUNT_VIEW, {
        state: { userProfile: userProfile },
      });
    } else {
      navigation.pop();
      navigation.navigate(routes.ACCOUNT_SCREEN);
    }
  };

  const goBack = () => {
    if (Platform.OS === 'web') {
      navigate('/' + routes.ACCOUNT_VIEW, {
        state: { userProfile: userProfile },
      });
    } else {
      navigation.goBack();
    }
  };

  const handleOnPressToImagePicker = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status === 'granted') {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.cancelled) {
        setProfilePicture(result.uri);
      } else {
        return false;
      }
    } else {
      const alertTxt = 'Please enable permissions to pick from image gallery.';
      Platform.OS === 'web' ? alert(alertTxt) : Alert.alert(alertTxt);
    }
  };

  return (
    <ScrollView>
      <VStack mt="4" ml="4" px={Platform.OS === 'web' ? '10%' : null}>
        <Center>
          <HStack>
            <Center>
              <TouchableOpacity
                onPress={handleOnPressToImagePicker}
                alignItems="center"
              >
                <AspectRatio
                  w={Platform.OS === 'web' ? '140%' : '70%'}
                  ratio={1}
                  mb="2"
                  alignSelf="center"
                >
                  <Image
                    borderRadius="full"
                    fallbackSource={{
                      uri: 'https://res.cloudinary.com/dbpearfyp/image/upload/v1634523641/User/Adeline_Tan_Sxxxx515G/ProfilePicture/ffo5oc4jhurmtjjhqcib.jpg',
                    }}
                    resizeMode="cover"
                    source={{
                      uri: profilePicture
                        ? `${profilePicture}`
                        : 'https://res.cloudinary.com/dbpearfyp/image/upload/v1634523641/User/Adeline_Tan_Sxxxx515G/ProfilePicture/ffo5oc4jhurmtjjhqcib.jpg',
                    }}
                    alt="user_image"
                  />
                </AspectRatio>
                <Text alignSelf="center" color={colors.red}> Click to edit profile picture</Text>
              </TouchableOpacity>
            </Center>
          </HStack>
        </Center>

        <EditField
          isRequired
          isInvalid={'preferredName' in errors}
          title="Preferred Name"
          placeholder={userProfile.preferredName}
          onChangeText={handleFormData('preferredName')}
          value={formData.preferredName}
          ErrorMessage={errors.preferredName}
        />

        <EditField
          isRequired
          isInvalid={'contactNo' in errors}
          title="Contact No."
          placeholder={userProfile.contactNo}
          onChangeText={handleFormData('contactNo')}
          value={formData.contactNo}
          ErrorMessage={errors.contactNo}
        />

        <UserInformationCard userProfile={props} />

        <Text
          mb="4"
          color={colors.red}
          fontFamily={Platform.OS === 'ios' ? 'Helvetica' : typography.android}
        >
          {' '}
          Note: To edit other information, please contact system administrator.
        </Text>

        <Box>
          <ErrorMessage visible={'api' in errors} message={errors.api} />
        </Box>

        {isLoading ? (
          <ActivityIndicator color={colors.primary_overlay_color} />
        ) : (
          <HStack
            w="100%"
            space="0"
            alignItems="center"
            justifyContent="space-around"
          >
            <Button
              onPress={() => handleOnPressToSave()}
              w="25%"
              size="md"
              bg={colors.green}
              _text={{
                color: `${colors.white_var1}`,
                fontFamily:
                  Platform.OS === 'ios' ? 'Helvetica' : typography.android,
                fontSize: 'sm',
              }}
            >
              Save
            </Button>

            <Button
              onPress={goBack}
              w="25%"
              size="md"
              bg={colors.pink}
              _text={{
                color: `${colors.white_var1}`,
                fontFamily:
                  Platform.OS === 'ios' ? 'Helvetica' : typography.android,
                fontSize: 'sm',
              }}
            >
              Cancel
            </Button>
          </HStack>
        )}
      </VStack>
    </ScrollView>
  );
}

export default AccountEditScreen;

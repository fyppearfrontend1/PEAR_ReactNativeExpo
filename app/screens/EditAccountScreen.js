import React from 'react';
import { useState } from 'react';
import { Platform, Alert } from 'react-native';
import {
  Image,
  VStack,
  HStack,
  Input,
  FormControl,
  Stack,
  TextArea,
  AspectRatio,
  Center,
  ScrollView,
  Text,
  Button,
} from 'native-base';
import typography from 'app/config/typography';
import colors from 'app/config/colors';
import { TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import userApi from 'app/api/user';

function EditAccountScreen(props) {
  const { navigation, route } = props;
  const userProfile = route.params;
  const [formData, setFormData] = useState({
    preferredName: '',
    contactNo: '',
  });
  const [newProfilePicture, setProfilePicture] = useState({
    uploadProfilePicture: '',
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

  // TODO: pass info & call api
  const handleOnPressToSave = async () => {
    const result = await userApi.updateUser(formData, newProfilePicture);
    console.log(result);

    // Alert.alert("Successfully updated.")
    // navigation.goBack();
  };

  const handleOnPressToCancel = () => {
    navigation.goBack();
  };

  const handleOnPressToImagePicker = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status == 'granted') {
      let data = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      setProfilePicture(() => ({
        uploadProfilePicture: data.uri,
      }));

      // if (!data.cancelled) {
      //   let newFile = { uri: data.uri, type: 'test\${data.uri.split(".")[1]}', name: 'test\${data.uri.split(".")[1]}' };
      //   handleUpload(newFile);
      // }
    } else {
      Alert.alert('Please enable permissions to pick from image gallery.');
    }
  };

  // TODO: upload pic to cloudinary?
  // const handleUpload = (image) => {
  //   const data = new FormData();
  //   data.append('file', image);
  //   data.append('upload_preset', 'pearApp');
  //   data.append('cloudname', 'dbpearfyp');

  //   fetch("https://api.cloudinary.com/v1_1/dbpearfyp/image/upload", {
  //     method: "post",
  //     body: "data"
  //   }).then(res=>res.json())
  //   .then(data=>{console.log(data)})
  // }

  return (
    <ScrollView>
      <VStack mt="4" ml="4">
        <Center>
          <HStack>
            <Center>
              <TouchableOpacity onPress={handleOnPressToImagePicker}>
                <AspectRatio w="80%" ratio={1} mb="2" alignSelf="center">
                  <Image
                    borderRadius="full"
                    source={{ uri: `${userProfile.profilePicture}` }}
                    alt="user_image"
                  />
                </AspectRatio>
              </TouchableOpacity>
            </Center>
          </HStack>
        </Center>

        <FormControl>
          <HStack space={2} alignItems="center">
            <FormControl.Label
              _text={{
                fontFamily: `${
                  Platform.OS === 'ios' ? 'Helvetica' : typography.android
                }`,
                fontSize: 'lg',
                fontWeight: 'thin',
              }}
            >
              First Name
            </FormControl.Label>

            <Input
              color={colors.black_var1}
              fontFamily={
                Platform.OS === 'ios' ? 'Helvetica' : typography.android
              }
              fontSize="lg"
              isReadOnly
              variant="unstyled"
              value={userProfile.firstName}
              w="100%"
            />
          </HStack>
        </FormControl>

        <FormControl>
          <HStack space={2} alignItems="center">
            <FormControl.Label
              _text={{
                fontFamily: `${
                  Platform.OS === 'ios' ? 'Helvetica' : typography.android
                }`,
                fontSize: 'lg',
                fontWeight: 'thin',
              }}
            >
              Last Name
            </FormControl.Label>

            <Input
              color={colors.black_var1}
              fontFamily={
                Platform.OS === 'ios' ? 'Helvetica' : typography.android
              }
              fontSize="lg"
              isReadOnly
              variant="unstyled"
              value={userProfile.lastName}
              w="100%"
            />
          </HStack>
        </FormControl>

        <FormControl>
          <HStack space={2} alignItems="center">
            <FormControl.Label
              _text={{
                fontFamily: `${
                  Platform.OS === 'ios' ? 'Helvetica' : typography.android
                }`,
                fontSize: 'lg',
                fontWeight: 'thin',
              }}
            >
              Role
            </FormControl.Label>

            <Input
              color={colors.black_var1}
              fontFamily={
                Platform.OS === 'ios' ? 'Helvetica' : typography.android
              }
              fontSize="lg"
              isReadOnly
              variant="unstyled"
              value={userProfile.role}
              w="100%"
            />
          </HStack>
        </FormControl>

        <FormControl maxW="60%">
          <HStack space={2} alignItems="center">
            <FormControl.Label
              _text={{
                fontFamily: `${
                  Platform.OS === 'ios' ? 'Helvetica' : typography.android
                }`,
                fontSize: 'lg',
                fontWeight: 'thin',
              }}
            >
              Preferred Name
            </FormControl.Label>

            <Input
              color={colors.black_var1}
              fontFamily={
                Platform.OS === 'ios' ? 'Helvetica' : typography.android
              }
              fontSize="lg"
              variant="filled"
              placeholder={userProfile.preferredName}
              defaultValue={userProfile.preferredName}
              onChangeText={handleFormData('preferredName')}
              value={formData.preferredName}
              w="100%"
            />
          </HStack>
        </FormControl>

        <FormControl maxW="60%">
          <HStack space={2} alignItems="center">
            <FormControl.Label
              _text={{
                fontFamily: `${
                  Platform.OS === 'ios' ? 'Helvetica' : typography.android
                }`,
                fontSize: 'lg',
                fontWeight: 'thin',
              }}
            >
              Contact Number
            </FormControl.Label>

            <Input
              color={colors.black_var1}
              fontFamily={
                Platform.OS === 'ios' ? 'Helvetica' : typography.android
              }
              fontSize="lg"
              variant="filled"
              placeholder={userProfile.contactNo}
              defaultValue={userProfile.contactNo}
              onChangeText={handleFormData('contactNo')}
              value={formData.contactNo}
              type="number"
              w="100%"
            />
          </HStack>
        </FormControl>

        <FormControl>
          <HStack space={2} alignItems="center">
            <FormControl.Label
              _text={{
                fontFamily: `${
                  Platform.OS === 'ios' ? 'Helvetica' : typography.android
                }`,
                fontSize: 'lg',
                fontWeight: 'thin',
              }}
            >
              NRIC
            </FormControl.Label>

            <Input
              color={colors.black_var1}
              fontFamily={
                Platform.OS === 'ios' ? 'Helvetica' : typography.android
              }
              fontSize="lg"
              isReadOnly
              variant="unstyled"
              value={userProfile.nric}
              w="100%"
            />
          </HStack>
        </FormControl>

        <FormControl>
          <HStack space={2} alignItems="center">
            <FormControl.Label
              _text={{
                fontFamily: `${
                  Platform.OS === 'ios' ? 'Helvetica' : typography.android
                }`,
                fontSize: 'lg',
                fontWeight: 'thin',
              }}
            >
              Gender
            </FormControl.Label>

            <Input
              color={colors.black_var1}
              fontFamily={
                Platform.OS === 'ios' ? 'Helvetica' : typography.android
              }
              fontSize="lg"
              isReadOnly
              variant="unstyled"
              value={userProfile.gender}
              w="100%"
            />
          </HStack>
        </FormControl>

        <FormControl>
          <HStack space={2} alignItems="center">
            <FormControl.Label
              _text={{
                fontFamily: `${
                  Platform.OS === 'ios' ? 'Helvetica' : typography.android
                }`,
                fontSize: 'lg',
                fontWeight: 'thin',
              }}
            >
              DOB
            </FormControl.Label>

            <Input
              color={colors.black_var1}
              fontFamily={
                Platform.OS === 'ios' ? 'Helvetica' : typography.android
              }
              fontSize="lg"
              isReadOnly
              variant="unstyled"
              value={userProfile.dob.substring(0, 10)}
              w="100%"
            />
          </HStack>
        </FormControl>

        <FormControl>
          <HStack space={2} alignItems="center">
            <FormControl.Label
              _text={{
                fontFamily: `${
                  Platform.OS === 'ios' ? 'Helvetica' : typography.android
                }`,
                fontSize: 'lg',
                fontWeight: 'thin',
              }}
            >
              Email
            </FormControl.Label>

            <Input
              color={colors.black_var1}
              fontFamily={
                Platform.OS === 'ios' ? 'Helvetica' : typography.android
              }
              fontSize="lg"
              isReadOnly
              variant="unstyled"
              value={userProfile.email}
              w="100%"
            />
          </HStack>
        </FormControl>

        <FormControl>
          <Stack space={0} alignItems="flex-start" flexWrap="wrap">
            <FormControl.Label
              width="100%"
              _text={{
                fontFamily: `${
                  Platform.OS === 'ios' ? 'Helvetica' : typography.android
                }`,
                fontSize: 'lg',
                fontWeight: 'thin',
              }}
            >
              Address
            </FormControl.Label>
            <TextArea
              color={colors.black_var1}
              fontFamily={
                Platform.OS === 'ios' ? 'Helvetica' : typography.android
              }
              fontSize="lg"
              isReadOnly
              input="lg"
              ml="-2.5"
              minH="30%"
              maxH="50%"
              variant="unstyled"
              value={userProfile.address || 'Not available'}
              w="100%"
            />
          </Stack>
        </FormControl>

        <Text
          mb="4"
          color={colors.red}
          fontFamily={Platform.OS === 'ios' ? 'Helvetica' : typography.android}
        >
          {' '}
          Note: To edit other information, please contact system administrator.
        </Text>
        {/* edit info note style */}

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
            onPress={() => handleOnPressToCancel()}
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
      </VStack>
    </ScrollView>
  );
}

export default EditAccountScreen;

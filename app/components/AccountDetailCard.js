import React from 'react';
import { TouchableOpacity, Platform } from 'react-native';
import colors from 'app/config/colors';
import { Image, Text, VStack, Box, HStack } from 'native-base';
// Import Constants from routes
import routes from 'app/navigation/routes';
import { useNavigate } from 'react-router-dom';

function AccountDetailCard(props) {
  const { userProfile, navigation } = props;

  // useNavigate() hook cannot work on mobile
  // const navigate = Platform.OS === 'web' ? useNavigate() : null;

  const handleOnPress = () => {
    if (Platform.OS === 'web') {
      navigation('/' + routes.ACCOUNT_VIEW, {
        state: { userProfile: userProfile },
      });
    } else {
      navigation.push(routes.ACCOUNT_VIEW, { ...userProfile });
    }
  };

  return (
    <TouchableOpacity onPress={handleOnPress}>
      <Box
        minW="90%"
        my={Platform.OS === 'web' ? '2' : '5'}
        px={Platform.OS === 'web' ? '8' : null}
        overflow="visible"
        rounded="lg"
        borderColor={colors.primary_gray}
        borderWidth="1"
        testID="accountDetailCard"
      >
        <HStack space={10}>
          <Image
            alt="user_image"
            borderRadius="full"
            // Note: This is a fall-back uri. Will only be used if source fails to render the image.
            fallbackSource={{
              uri: 'https://res.cloudinary.com/dbpearfyp/image/upload/v1634523641/User/Adeline_Tan_Sxxxx515G/ProfilePicture/ffo5oc4jhurmtjjhqcib.jpg',
            }}
            resizeMode="cover"
            size="lg"
            source={{
              uri: userProfile.profilePicture
                ? `${userProfile.profilePicture}`
                : 'https://res.cloudinary.com/dbpearfyp/image/upload/v1634523641/User/Adeline_Tan_Sxxxx515G/ProfilePicture/ffo5oc4jhurmtjjhqcib.jpg',
            }}
          />
          <VStack mt="3" mb="2">
            <Text alignSelf="flex-start" fontSize="2xl">
              {`${userProfile.preferredName}`}
            </Text>

            <Text alignSelf="flex-start" fontSize="lg">
              {`${userProfile.role}`}
            </Text>
          </VStack>
        </HStack>
      </Box>
    </TouchableOpacity>
  );
}

export default AccountDetailCard;

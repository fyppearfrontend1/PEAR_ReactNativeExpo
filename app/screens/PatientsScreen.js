import React, { useState, useEffect, useContext } from 'react';
import { Center, VStack, HStack, ScrollView, Fab, Icon } from 'native-base';
import { RefreshControl } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import AuthContext from 'app/auth/context';
import authStorage from 'app/auth/authStorage';
import patientApi from 'app/api/patient';
import useCheckExpiredThenLogOut from 'app/hooks/useCheckExpiredThenLogOut';
import PatientScreenCard from 'app/components/PatientScreenCard';
import colors from 'app/config/colors';
import ActivityIndicator from 'app/components/ActivityIndicator';
import routes from 'app/navigation/routes';
import { useFocusEffect } from '@react-navigation/native';
import { SearchBar } from 'react-native-elements';
import { StyleSheet, View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import ProfileNameButton from 'app/components/ProfileNameButton';

function PatientsScreen(props) {
  // Destructure props
  const [isLoading, setIsLoading] = useState(false);
  const [listOfPatients, setListOfPatients] = useState();
  const checkExpiredLogOutHook = useCheckExpiredThenLogOut();
  const { navigation } = props;

  const { user, setUser } = useContext(AuthContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  // set default value to my patients
  const [filterValue, setFilterValue] = useState('myPatients');
  const [originalListOfPatients, setOriginalListOfPatients] = useState([]);
  const [isReloadPatientList, setIsReloadPatientList] = useState(true);
  const [dropdownItems, setDropdownItems] = useState([
    {
      label: 'My Patients',
      value: 'myPatients',
      icon: () => (
        <MaterialCommunityIcons
          name="account-multiple"
          size={18}
          color={colors.black_var1}
        />
      ),
    },
    {
      label: 'All Patients',
      value: 'allPatients',
      icon: () => (
        <MaterialCommunityIcons
          name="account-group"
          size={18}
          color={colors.black_var1}
        />
      ),
    },
  ]);

  // Refreshes every time the user navigates to PatientsScreen - OUTDATED
  // Now refresh only when new patient is added or user requested refresh
  useFocusEffect(
    React.useCallback(() => {
      // Reference https://stackoverflow.com/questions/21518381/proper-way-to-wait-for-one-function-to-finish-before-continuing
      // Resolved the issue of `setListOfPatients` before successfully calling getPatient api.
      if (isReloadPatientList) {
        setIsLoading(true);
        const promiseFunction = async () => {
          const response = await getListOfPatients();
          setListOfPatients(response.data);
        };
        setIsReloadPatientList(false);
        promiseFunction();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isReloadPatientList]),
  );

  useEffect(() => {
    getListOfPatients();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterValue]);

  const getListOfPatients = async () => {
    setIsLoading(true);
    const response =
      filterValue === 'myPatients'
        ? await patientApi.getPatientListByUserId()
        : await patientApi.getPatientList();

    if (!response.ok) {
      // Check if token has expired, if yes, proceed to log out
      // checkExpiredLogOutHook.handleLogOut(response);
      setUser(null);
      // await authStorage.removeToken();
      return;
    }
    setOriginalListOfPatients(response.data.data);
    setListOfPatients(response.data.data);
    setIsLoading(false);
    return response.data;
  };

  const handleFabOnPress = () => {
    navigation.navigate(routes.PATIENT_ADD_PATIENT);
    setIsReloadPatientList(true);
  };

  // Show all patients as expected when nothing is keyed into the search
  useEffect(() => {
    if (!searchQuery) {
      // console.log(
      //   'Setting list of patients to original list:',
      //   originalListOfPatients,
      // );
      setListOfPatients(originalListOfPatients);
    }
    // added originalListOfPatients into the dependency
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  // Set the search query to filter patient list
  const handleSearch = (text) => {
    // console.log('Handling search query:', text);
    setSearchQuery(text);
  };

  // Filter patient list with search query
  const filteredList = listOfPatients
    ? listOfPatients.filter((item) => {
        // console.log(item);
        const fullName = `${item.firstName} ${item.lastName}`;
        return fullName.toLowerCase().includes(searchQuery.toLowerCase());
      })
    : null;

  return (
    <>
      {isLoading ? (
        <ActivityIndicator visible />
      ) : (
        <Center backgroundColor={colors.white_var1}>
          <HStack style={{ flexDirection: 'row', width: '100%', zIndex: 1 }}>
            <View style={{ flex: 1, zIndex: 0 }}>
              <SearchBar
                placeholder="Search"
                //platform="ios"
                onChangeText={handleSearch}
                value={searchQuery}
                lightTheme={true}
                containerStyle={styles.searchBarContainer}
                inputContainerStyle={{
                  backgroundColor: colors.white,
                  marginTop: 4.5,
                  borderRadius: 10,
                }}
                inputStyle={{ fontSize: 14 }}
                style={styles.searchBar}
              />
            </View>
            <View style={{ flex: 1, zIndex: 0 }}>
              <DropDownPicker
                open={dropdownOpen}
                value={filterValue}
                items={dropdownItems}
                setOpen={setDropdownOpen}
                setValue={setFilterValue}
                setItems={setDropdownItems}
                onChangeItem={(item) => setFilterValue(item.value)}
                mode="BADGE"
                theme="LIGHT"
                multiple={false}
                style={styles.dropDown}
                itemSeparator={true}
                itemSeparatorStyle={{
                  backgroundColor: colors.primary_gray,
                }}
                dropDownContainerStyle={{
                  height: 85,
                  marginTop: 9,
                  marginLeft: 12.1,
                  width: '93%',
                  backgroundColor: colors.white,
                }}
                listItemLabelStyle={{
                  fontSize: 12,
                }}
                selectedItemContainerStyle={{
                  backgroundColor: colors.primary_gray,
                }}
                placeholderStyle={{
                  color: colors.primary_overlay_color,
                }}
              />
            </View>
          </HStack>
          <ScrollView
            w="100%"
            height="93%"
            refreshControl={
              <RefreshControl
                refreshing={isReloadPatientList}
                onRefresh={getListOfPatients}
              />
            }
          >
            <VStack>
              {filteredList && filteredList.length > 0
                ? filteredList.map((item, index) => (
                    // <PatientScreenCard
                    //   patientProfile={item}
                    //   key={index}
                    //   navigation={navigation}
                    // />
                    <ProfileNameButton
                      navigation={navigation}
                      profile={item}
                      isPatient={true}
                      size={70}
                      key={index}
                    />
                  ))
                : null}
            </VStack>
          </ScrollView>
          <Center position="absolute" right="5" bottom="2%">
            <Fab
              backgroundColor={colors.pink}
              icon={
                <Icon
                  as={MaterialIcons}
                  color={colors.white}
                  name="person-add-alt"
                  size="lg"
                  placement="bottom-right"
                />
              }
              onPress={handleFabOnPress}
              renderInPortal={false}
              shadow={2}
              size="sm"
            />
          </Center>{' '}
        </Center>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  searchBarContainer: {
    marginLeft: '2%',
    width: '100%',
    backgroundColor: 'white',
    borderBottomColor: 'transparent',
    borderTopColor: 'transparent',
  },
  searchBar: {
    alignContent: 'flex-start',
    justifyContent: 'flex-start',
  },
  dropDown: {
    marginTop: 12,
    marginLeft: '3%',
    alignContent: 'flex-end',
    justifyContent: 'flex-end',
    width: '93%',
    borderColor: colors.primary_overlay_color,
  },
});

export default PatientsScreen;

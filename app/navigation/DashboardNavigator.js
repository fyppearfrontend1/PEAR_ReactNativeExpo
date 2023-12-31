import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DashboardScreen from 'app/screens/DashboardScreen';
import PatientProfile from 'app/screens/PatientProfileScreen';
import PatientInformationScreen from 'app/screens/PatientInformationScreen';
import PatientActivityPreferenceScreen from 'app/screens/PatientActivityPreferenceScreen';
import PatientAllergyScreen from 'app/screens/PatientAllergyScreen';
import PatientHolidayScreen from 'app/screens/PatientHolidayScreen';
import PatientPhotoAlbumScreen from 'app/screens/PatientPhotoAlbumScreen';
import PatientPreferenceScreen from 'app/screens/PatientPreferenceScreen';
import PatientPrescriptionScreen from 'app/screens/PatientPrescriptionScreen';
import PatientProblemLog from 'app/screens/PatientProblemLog';
import PatientVitalScreen from 'app/screens/PatientVitalScreen';
import PatientRoutineScreen from 'app/screens/PatientRoutineScreen';

// Import Constants from Routes
import routes from 'app/navigation/routes';
import { Image, Row } from 'native-base';
import { TouchableOpacity, Text } from 'react-native';
import ActivityFilterCard from 'app/components/ActivityFilterCard';
import dashboardApi from 'app/api/dashboard';
import PatientDailyHighlights from 'app/components/PatientDailyHighlights';

// Refer to this: https://reactnavigation.org/docs/hello-react-navigation
const Stack = createNativeStackNavigator();

// Refer to this for configuration: https://reactnavigation.org/docs/native-stack-navigator#options
function DashboardNavigator() {
  const [modalVisible, setModalVisible] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedStartTime, setSelectedStartTime] = useState(
    new Date(
      currentTime.getFullYear(),
      currentTime.getMonth(),
      currentTime.getDate(),
      0,
      0,
      0,
    ),
  );
  const [selectedEndTime, setSelectedEndTime] = useState(
    new Date(
      currentTime.getFullYear(),
      currentTime.getMonth(),
      currentTime.getDate(),
      23,
      59,
      59,
    ),
  );
  const [patientsData, setPatientsData] = useState([]);
  const [filteredPatientsData, setFilteredPatientsData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activityList, setActivityList] = useState([]);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [activityFilterList, setActivityFilterList] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [statusCode, setStatusCode] = useState();
  const [highlightsModalVisible, setHighlightsModalVisible] = useState(true);

  const getDefaultStartTime = () =>
    new Date(
      currentTime.getFullYear(),
      currentTime.getMonth(),
      currentTime.getDate(),
      0,
      0,
      0,
    );

  const getDefaultEndTime = () =>
    new Date(
      currentTime.getFullYear(),
      currentTime.getMonth(),
      currentTime.getDate(),
      23,
      59,
      59,
    );

  const getActivityList = () => {
    const activities = [];
    patientsData.forEach((patient) => {
      patient.activities.forEach((activity) => {
        if (!activities.includes(activity.activityTitle)) {
          activities.push(activity.activityTitle);
        }
      });
    });
    activities.sort();
    return activities;
  };
  const compareDates = (activityDate, selectedDateLocal) => {
    return (
      activityDate.getFullYear() === selectedDateLocal.getFullYear() &&
      activityDate.getMonth() === selectedDateLocal.getMonth() &&
      activityDate.getDate() === selectedDateLocal.getDate()
    );
  };

  const isSelectedActivity = (activityTitle) => {
    return (
      selectedActivity === null || selectedActivity.title === activityTitle
    );
  };

  const isWithinTimeRange = (activityStart, activityEnd) => {
    if (
      activityStart.getHours() > selectedEndTime.getHours() ||
      activityEnd.getHours() < selectedStartTime.getHours()
    ) {
      return false;
    }
    return !(
      (activityStart.getHours() === selectedEndTime.getHours() &&
        activityStart.getMinutes() > selectedEndTime.getMinutes()) ||
      (activityEnd.getHours() === selectedStartTime.getHours() &&
        activityEnd.getMinutes() < selectedStartTime.getMinutes())
    );
  };
  const updateFilteredPatientsData = () => {
    const filtered = [];
    patientsData.forEach((patient) => {
      const activities = [];
      patient.activities.forEach((activity) => {
        const activityDate = new Date(activity.date);
        if (compareDates(activityDate, selectedDate)) {
          if (
            isWithinTimeRange(
              new Date(activity.startTime),
              new Date(activity.endTime),
            ) &&
            isSelectedActivity(activity.activityTitle)
          ) {
            activities.push({
              activityTitle: activity.activityTitle,
              date: activity.date,
              startTime: activity.startTime,
              endTime: activity.endTime,
            });
          }
        }
      });

      if (activities.length !== 0) {
        filtered.push({
          patientImage: patient.patientImage,
          patientId: patient.patientId,
          patientName: patient.patientName,
          activities: activities,
        });
      }
    });

    setFilteredPatientsData(filtered);
  };

  const refreshDashboardData = () => {
    setIsLoading(true);
    setIsError(false);
    dashboardApi
      .getDashboard()
      .then((res) => {
        if (res.status === 200) {
          setPatientsData(res.data.data);
          setIsLoading(false);
          setStatusCode(res.status);
        } else {
          setIsLoading(false);
          setIsError(true);
          setStatusCode(res.status);
        }
      })
      .catch((err) => {
        setIsLoading(false);
        setIsError(true);
        setStatusCode(err.response.status);
      });
  };

  const noDataMessage = () => {
    // Display error message if API request fails
    if (isError) {
      if (statusCode === 401) {
        return <Text>Error: User is not authenticated.</Text>;
      } else if (statusCode >= 500) {
        return <Text>Error: Server is down. Please try again later.</Text>;
      }
      return <Text>{statusCode} error has occurred.</Text>;
    }

    return <Text>No schedule can be found.</Text>;
  };

  const handlePullToRefresh = () => {
    refreshDashboardData();
    setCurrentTime(new Date());
  };

  useEffect(() => {
    refreshDashboardData();
  }, []);

  useEffect(() => {
    updateFilteredPatientsData();
    setActivityList(getActivityList());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patientsData]);

  useEffect(() => {
    setSelectedStartTime(getDefaultStartTime());
    setSelectedEndTime(getDefaultEndTime());
    setSelectedActivity(null);
    setActivityFilterList(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTime, selectedDate]);

  useEffect(() => {
    updateFilteredPatientsData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedStartTime, selectedEndTime, selectedActivity]);

  return (
    <Stack.Navigator>
      <Stack.Screen
        name={routes.DASHBOARD_SCREEN}
        options={{
          headerRight: () => (
            <Row space={4}>
              <TouchableOpacity onPress={() => setModalVisible(true)}>
                <Image
                  alt={'filter'}
                  source={{
                    uri: 'https://cdn-icons-png.flaticon.com/512/7693/7693332.png',
                  }}
                  size={'25px'}
                />
                <ActivityFilterCard
                  modalVisible={modalVisible}
                  setModalVisible={setModalVisible}
                  selectedStartTime={selectedStartTime}
                  setSelectedStartTime={setSelectedStartTime}
                  selectedEndTime={selectedEndTime}
                  setSelectedEndTime={setSelectedEndTime}
                  updateFilteredActivityData={updateFilteredPatientsData}
                  activityList={activityList}
                  setSelectedActivity={setSelectedActivity}
                  activityFilterList={activityFilterList}
                  setActivityFilterList={setActivityFilterList}
                  getDefaultStartTime={getDefaultStartTime}
                  getDefaultEndTime={getDefaultEndTime}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setHighlightsModalVisible(!modalVisible)}
                testID={'highlightsButton'}
              >
                <Image
                  alt={'daily-highlights'}
                  source={{
                    uri: 'https://cdn-icons-png.flaticon.com/512/747/747310.png',
                  }}
                  size={'25px'}
                />
                <PatientDailyHighlights
                  modalVisible={highlightsModalVisible}
                  setModalVisible={setHighlightsModalVisible}
                />
              </TouchableOpacity>
            </Row>
          ),
        }}
      >
        {() => (
          <DashboardScreen
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            filteredActivityData={filteredPatientsData}
            currentTime={currentTime}
            isLoading={isLoading}
            handlePullToRefresh={handlePullToRefresh}
            noDataMessage={noDataMessage}
          />
        )}
      </Stack.Screen>
      <Stack.Screen
        name={routes.PATIENT_PROFILE}
        component={PatientProfile}
        options={{
          headerShown: true,
          headerBackTitleVisible: false,
          title: 'Patient Profile',
        }}
      />
      <Stack.Screen
        name={routes.PATIENT_INFORMATION}
        component={PatientInformationScreen}
        options={{
          headerShown: true,
          headerBackTitleVisible: false,
          title: 'Patient Information',
        }}
      />
      <Stack.Screen
        name={routes.PATIENT_ACTIVITY_PREFERENCE}
        component={PatientActivityPreferenceScreen}
        options={{
          headerShown: true,
          headerBackTitleVisible: false,
          title: 'Activity Preference',
        }}
      />
      <Stack.Screen
        name={routes.PATIENT_ALLERGY}
        component={PatientAllergyScreen}
        options={{
          headerShown: true,
          headerBackTitleVisible: false,
          title: 'Allergy',
        }}
      />
      <Stack.Screen
        name={routes.PATIENT_HOLIDAY}
        component={PatientHolidayScreen}
        options={{
          headerShown: true,
          headerBackTitleVisible: false,
          title: 'Holiday',
        }}
      />
      <Stack.Screen
        name={routes.PATIENT_PHOTO_ALBUM}
        component={PatientPhotoAlbumScreen}
        options={{
          headerShown: true,
          headerBackTitleVisible: false,
          title: 'Photo Album',
        }}
      />
      <Stack.Screen
        name={routes.PATIENT_PREFERENCE}
        component={PatientPreferenceScreen}
        options={{
          headerShown: true,
          headerBackTitleVisible: false,
          title: 'Preference',
        }}
      />
      <Stack.Screen
        name={routes.PATIENT_PRESCRIPTION}
        component={PatientPrescriptionScreen}
        options={{
          headerShown: true,
          headerBackTitleVisible: false,
          title: 'Prescription',
        }}
      />
      <Stack.Screen
        name={routes.PATIENT_PROBLEM_LOG}
        component={PatientProblemLog}
        options={{
          headerShown: true,
          headerBackTitleVisible: false,
          title: 'Problem Log',
        }}
      />
      <Stack.Screen
        name={routes.PATIENT_VITAL}
        component={PatientVitalScreen}
        options={{
          headerShown: true,
          headerBackTitleVisible: false,
          title: 'Vital',
        }}
      />
      <Stack.Screen
        name={routes.PATIENT_ROUTINE}
        component={PatientRoutineScreen}
        options={{
          headerShown: true,
          headerBackTitleVisible: false,
          title: 'Routine',
        }}
      />
    </Stack.Navigator>
  );
}

export default DashboardNavigator;

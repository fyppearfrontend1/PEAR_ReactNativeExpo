import React, { useState } from 'react';
import { Platform } from 'react-native';

import PatientAddPatientInfoScreen from 'app/screens/PatientAddPatientInfoScreen';
import PatientAddGuardianScreen from 'app/screens/PatientAddGuardianScreen';
import PatientAddAllergyScreen from 'app/screens/PatientAddAllergyScreen';
import * as ImagePicker from 'expo-image-picker';
// import Joi from 'joi';
import * as Yup from 'yup';
import mime from 'mime';

function PatientAddScreen(props) {
  // state for steps
  const [step, setStep] = useState(1);

  // state for datepicker
  const [show, setShow] = useState({
    DOB: false,
    StartDate: false,
    EndDate: false,
  });

  // state for components
  const [componentList, setComponentList] = useState({
    guardian: [{}],
    allergy: [{}],
  });

  const newDate = new Date();

  const [errorMessage, setErrorMessage] = useState('');

  // data validation using Yup
  // Reference: https://github.com/jquense/yup

  const schema = Yup.object().shape({
    patientInfo: Yup.object().shape({
      FirstName: Yup.string().required(),
      LastName: Yup.string().required(),
      PreferredName: Yup.string().required(),
      PreferredLanguageListID: Yup.number().required(),
      NRIC: Yup.string()
        .matches(/^[A-Za-z]\d{7}[A-Za-z]$/, { message: 'Invalid NRIC' })
        .length(9)
        .required(),
      Address: Yup.string().required(),
      TempAddress: Yup.string().notRequired(),
      // TODO: fix validation for HomeNo and HandphoneNo
      HomeNo: Yup.string()
        .matches(/^6[0-9]{7}$/, { message: 'Invalid Home Telephone No.' })
        .nullable()
        .default(),
      HandphoneNo: Yup.string()
        .matches(/^[89]\d{7}$/, { message: 'Invalid Handphone No.' })
        .nullable()
        .default(),
      Gender: Yup.string().required(),
      DOB: Yup.date().required(),
      StartDate: Yup.date().required(),
      EndDate: Yup.date().notRequired(),
      PrivacyLevel: Yup.string().required(),
      UpdateBit: Yup.boolean().required(),
      AutoGame: Yup.boolean().required(),
      IsActive: Yup.boolean().required(),
      IsRespiteCare: Yup.boolean().required(),
      TerminationReason: Yup.string().notRequired(),
      InactiveReason: Yup.string().notRequired(),
      ProfilePicture: Yup.string().notRequired(),
      UploadProfilePicture: Yup.object()
        .shape({
          uri: Yup.string().notRequired(),
          name: Yup.string().notRequired(),
          type: Yup.string().notRequired(),
        })
        .notRequired(),
    }),
    guardianInfo: Yup.array()
      .of(
        Yup.object().shape({
          FirstName: Yup.string().required(),
          LastName: Yup.string().required(),
          NRIC: Yup.string()
            .matches(/^[A-Za-z]\d{7}[A-Za-z]$/, { message: 'Invalid NRIC' })
            .length(9)
            .required(),
          Email: Yup.string().email('Invalid email address').required(),
          RelationshipID: Yup.number().required(),
          IsActive: Yup.boolean().required(),
          ContactNo: Yup.string()
            .matches(/^[89]\d{7}$/, { message: 'Invalid Contact No.' })
            .required(),
        }),
      )
      .min(1)
      .max(2)
      .required(),

    allergyInfo: Yup.array()
      .of(
        Yup.object().shape({
          AllergyListID: Yup.number().required(),
          AllergyReactionListID: Yup.number().notRequired(),
          AllergyRemarks: Yup.string().notRequired(),
        }),
      )
      .min(1)
      .required(),
  });

  const patientData = {
    patientInfo: {
      FirstName: 'Patient',
      LastName: '',
      PreferredName: 'Patient',
      PreferredLanguageListID: 1,
      NRIC: 'S0948274A',
      Address: 'MyHome',
      TempAddress: '',
      HomeNo: '',
      HandphoneNo: '',
      Gender: 'M',
      DOB: newDate,
      StartDate: newDate,
      EndDate: newDate,
      PrivacyLevel: '2',
      UpdateBit: true,
      AutoGame: true,
      IsActive: true,
      IsRespiteCare: false,
      TerminationReason: '',
      InactiveReason: '',
      ProfilePicture: '',
      UploadProfilePicture: {
        uri: '',
        name: '',
        type: '',
      },
    },

    guardianInfo: [
      {
        FirstName: 'gFirst',
        LastName: 'gLast',
        NRIC: 'S9658567Z',
        Email: 'gg@gmail.com',
        RelationshipID: 1,
        IsActive: true,
        ContactNo: '95655856',
      },
    ],

    allergyInfo: [
      {
        AllergyListID: 3,
        AllergyReactionListID: 3,
        AllergyRemarks: 'gg',
      },
    ],
  };

  const [formData, setFormData] = useState(patientData);

  const componentHandler = (page = '', list = []) => {
    if (list) {
      setComponentList((prevState) => ({
        // eg. componentList: { guardian: [{..}, {..}]}
        ...prevState,
        [page]: list,
      }));
    }
  };

  const validateStep = async (formData) => {
    const stepSchema = schema.fields[Object.keys(formData)[step - 1]];
    const toValidate = formData[Object.keys(formData)[step - 1]];
    try {
      // Validate the form data against the schema
      await stepSchema.validate(toValidate, { abortEarly: false });
      setErrorMessage('');

      return { success: true };
    } catch (error) {
      if (error.inner) {
        const errors = {};
        error.inner.forEach((e) => {
          errors[e.path] = e.message;
        });
        setErrorMessage(errors);
        console.log(errors);
        return { success: false, errors };
      } else {
        return { success: false, errors: [error.message] };
      }
    }
  };

  // for each step of form, validate the data against schema
  // function for going to next step by increasing step state by 1
  // and to set component list
  const nextQuestionHandler = async (formData, page = '', list = []) => {
    const promiseResult = await validateStep(formData);
    console.log(promiseResult);
    // If the validation is successful, continue to the next question
    if (promiseResult.success) {
      componentHandler(page, list);
      setStep((prevStep) => prevStep + 1);
    }
  };

  // function for going to previous step by decreasing step state by 1
  // and to set component list
  const prevQuestionHandler = (page = '', list = []) => {
    componentHandler(page, list);
    setStep((prevStep) => prevStep - 1);
  };

  // Reference: https://docs.expo.dev/versions/latest/sdk/imagepicker/
  const pickImage = (page, input) => async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    console.log('after picking picture', result);
    const newImageUri = 'file:///' + result.uri.split('file:/').join('');
    if (!result.cancelled) {
      var img = formData[page];
      img[input] = {
        uri: newImageUri,
        name: newImageUri.split('/').pop(),
        type: mime.getType(newImageUri),
      };

      setFormData((prevState) => ({
        ...prevState,
        [page]: img,
      }));
    }
  };
  // handling form input data by taking onchange value and updating our previous form data state
  const handleFormData =
    (page = '', input, index = null) =>
    (e, date = null) => {
      // set show as false when date is selected on datepicker
      if (Platform.OS === 'android') {
        setShow((prevState) => ({
          ...prevState,
          [input]: false,
        }));
      }
      if (page === 'patientInfo') {
        const newData = formData[page];

        // additional check to convert HomeNo and HandphoneNo to string
        if (input === 'HomeNo' || input === 'HandphoneNo') {
          newData[input] = date
            ? date
            : e.$d //e['$d']-check if input from MUI date-picker
            ? e.$d
            : e.toString(); // convert to string
        } else {
          newData[input] = date
            ? date
            : e.$d //e['$d']-check if input from MUI date-picker
            ? e.$d
            : parseInt(e) // check if integer (for dropdown)
            ? parseInt(e) // change to integer
            : e; // eg. guardianInfo[0].FirstName = e
        }

        setFormData((prevState) => ({
          ...prevState,
          [page]: newData,
        }));
      } else {
        // guardianInfo or allergyInfo
        const newData = formData[page].slice();

        // additional check to convert ContactNo  to string
        if (input === 'ContactNo') {
          newData[index][input] = date
            ? date
            : parseInt(e) // check if integer (for dropdown)
            ? parseInt(e).toString() // change to string
            : e.toString(); // convert to string
        } else {
          newData[index][input] = date
            ? date
            : parseInt(e) // check if integer (for dropdown)
            ? parseInt(e) // change to integer
            : e; // eg. guardianInfo[0].FirstName = e
        }

        setFormData((prevState) => ({
          ...prevState,
          [page]: newData,
        }));
      }
    };

  switch (step) {
    case 1:
      return (
        <PatientAddPatientInfoScreen
          nextQuestionHandler={nextQuestionHandler}
          handleFormData={handleFormData}
          formData={formData}
          componentList={componentList}
          pickImage={pickImage}
          show={show}
          setShow={setShow}
          errorMessage={errorMessage}
        />
      );
    case 2:
      return (
        <PatientAddGuardianScreen
          nextQuestionHandler={nextQuestionHandler}
          prevQuestionHandler={prevQuestionHandler}
          handleFormData={handleFormData}
          formData={formData}
          setFormData={setFormData}
          componentList={componentList}
          errorMessage={errorMessage}
        />
      );
    case 3:
      return (
        <PatientAddAllergyScreen
          nextQuestionHandler={nextQuestionHandler}
          prevQuestionHandler={prevQuestionHandler}
          handleFormData={handleFormData}
          formData={formData}
          setFormData={setFormData}
          componentList={componentList}
          validateStep={validateStep}
        />
      );
    default:
      return <div className="App" />;
  }
}

export default PatientAddScreen;

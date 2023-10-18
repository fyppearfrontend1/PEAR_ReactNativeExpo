// Libs
import React, { useState, useEffect } from 'react';
import { Platform, StyleSheet, View, Text } from 'react-native';
import { Input } from 'native-base';

// Configurations
import typography from 'app/config/typography';
import colors from 'app/config/colors';

// Components
import ErrorMessage from 'app/components/ErrorMessage';

function InputFieldCommon({
  testID,
  isRequired = false, 
  autoCapitalize,
  color,
  background,
  showTitle,
  title,
  value,
  onChangeText,
  InputLeftElement,
  InputRightElement,
  type,
  keyboardType,
  maxLength,
  validation,
  onChildData,
  variant,
}) {
  const requiredIndicator = <Text style={styles.RequiredIndicator}> *</Text>;

  // This state and subsequent useEffect are used to track if the component is in its first render. This is mainly used to
  // ensure that the submission blocking in the parent component is active (as it is first rendered, user will not
  // likely have filled anything). This also ensures that since there will be no input, the component error message
  // does not show until the user focuses and violates the validation with their input.
  const [isFirstRender, setIsFirstRender] = useState(true);
  
  const [isError, setIsError] = useState({
    error: false,
    errorMsg: '',
  });

  useEffect(() => {
    onChildData ? onChildData(isFirstRender || isError.error) : null;
    setIsFirstRender(false);
    setIsError({
      ...isError,
      error: isRequired && value.length === 0,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // This is used to update the parent component that there is a validation error
  // validation passed via the onChildData prop.
  useEffect(() => {
    if (!isFirstRender) {
      onChildData ? onChildData(isError.error) : null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isError, onChildData]);


  const validate = () => {
    msg = ''
    if(isRequired) {
      msg = validateNotEmpty();
    }
    switch(validation) {
      case "name": {
        msg = msg ? msg : validateAlphaOnly();
        break;
      }
      case "nric": {
        msg = msg ? msg : validateNRIC();
        break;
      }
      case "home phone": {
        msg = msg ? msg : validateHomePhoneNo();
        break;
      }
      case "mobile phone": {
        msg = msg ? msg : validateMobilePhoneNo();
        break;
      }
      case "email": {
        msg = msg ? msg : validateEmail();
      }
    }    

    setIsError({
      ...isError,
      error: msg ? true : false,
      errorMsg: msg ? msg : ''
    });

  }

  const validateAlphaOnly = () => {
    if (/[!@#$%^&*(),.?":{}|<>]/g.test(value) || /\d+/g.test(value)) {
      return 'Field cannot contain numbers or symbols';
    }   
  };

  
  const validateNotEmpty = () => {
    if (isRequired && value <= 0) {
      return 'Field cannot be empty';
    }
  }

  const validateNRIC = () => {
    if(!/^[STFGMstfgm]\d{7}[A-Za-z]$/.test(value)) {
      return 'Invalid NRIC'
    }
  }

  const validateHomePhoneNo = () => {
    if (!/^$|^6[0-9]{7}$/.test(value)) {
      return 'Home Telephone No. must start with the digit 6, and must have 8 digits.';
    } 
  }

  const validateMobilePhoneNo = () => {
    if (!/^$|^[89][0-9]{7}$/.test(value)) {
      return 'Mobile No. must start with the digit 8 or 9, and must have 8 digits.';
    }
  }

  const validateEmail = () => {
    if (!/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(value)) {
      return 'Invalid Email';
    }
  }
  return (
    <View style={styles.ComponentContainer}>
      {showTitle ? (
        <Text style={styles.TitleMsg}>
          {title}:{isRequired ? requiredIndicator : ''}
        </Text>
      ) : null }
      <Input
        accessible={true}
        autoCapitalize={autoCapitalize}
        testID={testID}
        backgroundColor={background}
        color={color}
        placeholderTextColor={color}
        borderColor={
          isError.errorMsg === '' ? colors.light_gray3 : colors.red
        }
        textAlignVertical={variant === 'multiLine' ? 'top' : 'center'}
        borderRadius="25"
        height={variant === 'multiLine' ? '150' : '50'}
        value={value}
        onChangeText={onChangeText}
        onEndEditing={validate}
        placeholder={title}
        InputLeftElement={InputLeftElement}
        InputRightElement={InputRightElement}
        type={type}
        keyboardType={keyboardType}
        maxLength={maxLength}
        style={styles.InputField}
      />
      {isError.errorMsg ? (
        <ErrorMessage message={isError.errorMsg} visible={true} />
      ) : null}
    </View>
  );
}

InputFieldCommon.defaultProps = {
  testID: '',
  background: null,
  isRequired: false, 
  autoCapitalize: "words",
  InputLeftElement: null,
  InputRightElement: null,
  showTitle: true,
  type: 'text',
  keyboardType: 'default',
  maxLength: null,
  onChildData: null,
  setErrorState: null,
  variant: "singleLine",
};

const styles = StyleSheet.create({
  ComponentContainer: {
    display: 'flex',
    width: '100%',
    marginTop: 5,
    justifyContent: 'flex-start',
  },
  TitleMsg: {
    fontSize: 13.5,
    fontWeight: 'bold',
    marginBottom: 5,
    marginTop: 10,
    color: colors.light_gray2,
    fontFamily: Platform.OS === 'ios' ? typography.ios : typography.android,
  },
  ErrorMsg: {
    color: colors.red,
    fontFamily: Platform.OS === 'ios' ? typography.ios : typography.android,
    fontSize: 15,
  },
  RequiredIndicator: {
    color: colors.red,
    fontSize: 18,
  },
  InputField: {
    fontSize: 16,
    width: '100%',
    marginVertical: '5%',
    color: colors.black_var1,
    fontFamily: Platform.OS === 'ios' ? typography.ios : typography.android,
  },
});

export default InputFieldCommon;

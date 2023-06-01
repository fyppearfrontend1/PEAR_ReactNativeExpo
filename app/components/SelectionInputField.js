import React, { useState, useEffect } from 'react';
import { Platform, StyleSheet, View, Text } from 'react-native';
import { VStack, Select } from 'native-base';
import typography from 'app/config/typography';
import colors from 'app/config/colors';
import ErrorMessage from 'app/components/ErrorMessage';

function SelectionInputField({
  isRequired,
  title,
  placeholderText,
  onDataChange,
  value,
  dataArray,
  onChildData,
}) {
  const requiredIndicator = <Text style={styles.RequiredIndicator}> *</Text>;
  const [isFirstRender, setIsFirstRender] = useState(true);
  const [isError, setIsError] = useState({
    error: false,
    errorMsg: '',
  });
  const [selectedValue, setSelectedValue] = useState(
    value ? value : dataArray[0].value,
  );

  const valueChangeHandler = (selected) => {
    setSelectedValue(selected);
    onDataChange(selected);
  };

  useEffect(() => {
    onChildData ? onChildData(isFirstRender || isError.error) : null;
    setIsFirstRender(false);
    setIsError({
      ...isError,
      error: isRequired && selectedValue.length === 0,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isFirstRender) {
      onChildData ? onChildData(isError.error) : null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isError, onChildData]);

  return (
    <View style={styles.ComponentContainer}>
      <VStack>
        <Text style={styles.TitleMsg}>
          {title}:{isRequired ? requiredIndicator : ''}
        </Text>
        <Select
          accessibilityLabel={title}
          borderRadius="25"
          fontFamily={
            Platform.OS === 'ios' ? typography.ios : typography.android
          }
          height="50"
          minWidth="full"
          minHeight="3%"
          placeholder={placeholderText}
          placeholderTextColor={colors.medium}
          fontSize="16"
          selectedValue={selectedValue}
          onValueChange={valueChangeHandler}
        >
          {dataArray.map((item) => (
            <Select.Item key={item} label={item.label} value={item.value} />
          ))}
        </Select>
        {isError.errorMsg ? (
          <ErrorMessage message={isError.errorMsg} visible={true} />
        ) : null}
      </VStack>
    </View>
  );
}

SelectionInputField.defaultProps = {
  isRequired: false,
};

const styles = StyleSheet.create({
  ComponentContainer: {
    display: 'flex',
    width: '80%',
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
  RequiredIndicator: {
    color: colors.red,
  },
});

export default SelectionInputField;

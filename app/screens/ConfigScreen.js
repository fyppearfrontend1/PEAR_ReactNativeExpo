import React, { useContext } from 'react';
import authStorage from 'app/auth/authStorage';
import MessageDisplayCard from 'app/components/MessageDisplayCard';
import AuthContext from 'app/auth/context';
// import authStorage from 'app/auth/authStorage';

const getUserTokens = async () => {
  const accessToken1 = await authStorage.getToken('userAuthToken');
  const refreshToken1 = await authStorage.getToken('userRefreshToken');
  console.log(accessToken1);
  console.log(refreshToken1);
  // setUser(null);
  // await authStorage.removeToken();
  return;
};

function ConfigScreen() {
  const { setUser } = useContext(AuthContext);
  getUserTokens();
  // setUser(null);
  return <MessageDisplayCard TextMessage={'Configuration Screen'} />;
}

export default ConfigScreen;

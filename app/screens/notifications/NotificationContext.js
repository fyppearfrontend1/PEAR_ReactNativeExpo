import { createContext, useContext } from 'react';

const NotificationContext = createContext({
  shouldRefetchAcceptNotifications: false,
  shouldRefetchRejectNotifications: false,
  setRefetchAcceptNotifications: () => {},
  setRefetchRejectNotifications: () => {},
});

export const useNotificationContext = () => {
  return useContext(NotificationContext);
};

export default NotificationContext;

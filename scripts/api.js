import { Notification } from './Notification';

export const API_URL = 
  import.meta.env.DEV ? 'http://localhost:2125' : 'https://api.rootdiv.ru/stand-up';

const sendError = error => {
  console.error(`Возникла проблема с fetch запросом ${error.message}`);
  Notification.getInstance().show('Возникла ошибка сервера, попробуйте позже', false);
};

export const getComedians = async () => {
  try {
    const response = await fetch(`${API_URL}/comedians`);
    if (!response.ok) {
      throw new Error(`Сервер вернул ошибку: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    sendError(error);
  }
};

export const getClient = async ticket => {
  try {
    const response = await fetch(`${API_URL}/clients/${ticket}`);
    if (response.status === 500) {
      throw new Error(`Сервер вернул ошибку: ${response.status}`);
    } else if (response.status === 400 || response.status === 404) {
      Notification.getInstance().show(await response.text(), false);
      return false;
    }
    return response.json();
  } catch (error) {
    sendError(error);
  }
};

export const sendData = async (method, data, id) => {
  try {
    const response = await fetch(`${API_URL}/clients${id ? `/${id}` : ''}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (response.status === 500) {
      throw new Error(`Сервер вернул ошибку: ${response.status}`);
    } else if (response.status === 400 || response.status === 404) {
      Notification.getInstance().show(await response.text(), false);
      return false;
    }
    return true;
  } catch (error) {
    sendError(error);
    return false;
  }
};

import { Notification } from './Notification';

export const getComedians = async () => {
  try {
    const response = await fetch(`${location.protocol}//${location.hostname}:2125/comedians`);
    if (!response.ok) {
      throw new Error(`Сервер вернул ошибку: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error(`Возникла проблема с fetch запросом ${error.message}`);
    Notification.getInstance().show('Возникла ошибка сервера, попробуйте зайти позже', false);
  }
};

export const sendData = async (method, data, id) => {
  try {
    const response = await fetch(`${location.protocol}//${location.hostname}:2125/clients${id ? `/${id}` : ''}`, {
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
    console.error(`Возникла проблема с fetch запросом ${error.message}`);
    Notification.getInstance().show('Возникла ошибка сервера, попробуйте позже', false);
    return false;
  }
};

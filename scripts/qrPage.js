import { Notification } from './Notification';
import { getClient, getComedians } from './api';
import { displayClientInfo, displayBooking } from './display';
import { showQrController } from './showQrController';

const getTicket = () => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get('t');
};

export const initQrPage = async () => {
  const clientInfo = document.querySelector('.booking__client-info');
  const bookingPerformances = document.querySelector('.booking__performances');

  const ticket = getTicket();

  if (ticket?.length === 8 && /\d{8}/.test(ticket)) {
    const clientData = await getClient(ticket);
    const comediansData = await getComedians();
    if (clientData && comediansData?.length) {
      displayClientInfo(clientInfo, clientData);
      displayBooking(bookingPerformances, clientData, comediansData);
      showQrController(bookingPerformances);
    }
  } else {
    Notification.getInstance().show('Произошла ошибка, проверьте ссылку!', false);
  }
};

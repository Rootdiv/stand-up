import './style.scss';
import { initForm } from './scripts/form';
import { getComedians } from './scripts/api';
import { createComedianBlock } from './scripts/comedians';
import { initChangeSection } from './scripts/changeSection';
import { initQrPage } from './scripts/qrPage';

export const bookingComediansList = document.querySelector('.booking__comedians-list');
export const bookingButtonSubmit = document.querySelector('.booking__button_submit');

const init = async () => {
  if (window.location.pathname.endsWith('qr.html')) {
    initQrPage();
    return;
  }

  const countComedians = document.querySelector('.event__info-item_comedians .event__info-number');
  const bookingForm = document.querySelector('.booking__form');
  const bookingInputFullName = document.querySelector('.booking__input_fullname');
  const bookingInputPhone = document.querySelector('.booking__input_phone');
  const bookingInputTicket = document.querySelector('.booking__input_ticket');

  const event = document.querySelector('.event');
  const eventButtonReserve = document.querySelector('.event__button_reserve');
  const eventButtonEdit = document.querySelector('.event__button_edit');
  const booking = document.querySelector('.booking');
  const bookingTitle = document.querySelector('.booking__title');

  const comedians = await getComedians();

  if (comedians) {
    countComedians.textContent = comedians.length;
    const comedianBlock = createComedianBlock(comedians);
    bookingComediansList.append(comedianBlock);

    const changeSection = initChangeSection(
      event,
      eventButtonReserve,
      eventButtonEdit,
      booking,
      bookingTitle,
      bookingForm,
      comedians,
    );

    initForm(bookingForm, bookingInputFullName, bookingInputPhone, bookingInputTicket, changeSection);
  }
};

init();

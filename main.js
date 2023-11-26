import './style.scss';
import { initForm } from './scripts/form';
import { getComedians } from './scripts/api';
import { createComedianBlock } from './scripts/comedians';

const init = async () => {
  const countComedians = document.querySelector('.event__info-item_comedians .event__info-number');
  const bookingComediansList = document.querySelector('.booking__comedians-list');
  const bookingForm = document.querySelector('.booking__form');
  const bookingButtonSubmit = document.querySelector('.booking__button_submit');
  const bookingInputFullName = document.querySelector('.booking__input_fullname');
  const bookingInputPhone = document.querySelector('.booking__input_phone');
  const bookingInputTicket = document.querySelector('.booking__input_ticket');

  const comedians = await getComedians();

  initForm(bookingForm, bookingButtonSubmit, bookingInputFullName, bookingInputPhone, bookingInputTicket);

  if (comedians) {
    countComedians.textContent = comedians.length;
    const comedianBlock = createComedianBlock(comedians, bookingComediansList, bookingButtonSubmit);
    bookingComediansList.append(comedianBlock);
  }
};

init();

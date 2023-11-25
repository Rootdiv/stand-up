import { Notification } from './scripts/notification';
import './style.scss';
import TomSelect from 'tom-select';
import Inputmask from 'inputmask';
import JustValidate from 'just-validate';

const MAX_COMEDIANS = 6;

const notification = Notification.getInstance();

const bookingComediansList = document.querySelector('.booking__comedians-list');
const bookingForm = document.querySelector('.booking__form');

const createComedianBlock = comedians => {
  const bookingComedian = document.createElement('li');
  bookingComedian.className = 'booking__comedian';

  const bookingSelectComedian = document.createElement('select');
  bookingSelectComedian.className = 'booking__select booking__select_comedian';

  const bookingSelectTime = document.createElement('select');
  bookingSelectTime.className = 'booking__select booking__select_time';

  const inputHidden = document.createElement('input');
  inputHidden.name = 'booking';
  inputHidden.type = 'hidden';

  const bookingHall = document.createElement('button');
  bookingHall.className = 'booking__hall';
  bookingHall.type = 'button';

  bookingComedian.append(bookingSelectComedian, bookingSelectTime, inputHidden);

  const bookingTomSelectComedian = new TomSelect(bookingSelectComedian, {
    hideSelected: true,
    placeholder: 'Выбрать комика',
    options: comedians.map(item => ({
      value: item.id,
      text: item.comedian,
    })),
  });

  const bookingTomSelectTime = new TomSelect(bookingSelectTime, {
    hideSelected: true,
    placeholder: 'Время',
  });

  bookingTomSelectTime.disable();

  bookingTomSelectComedian.on('change', id => {
    const { performances } = comedians.find(item => item.id === id);
    bookingTomSelectTime.clear();
    bookingTomSelectTime.clearOptions();
    bookingTomSelectTime.addOptions(
      performances.map(item => ({
        value: item.time,
        text: item.time,
      })),
    );
    bookingTomSelectTime.enable();
    bookingTomSelectComedian.blur();
    bookingHall.remove();
  });

  bookingTomSelectTime.on('change', time => {
    if (!time) return;
    const idComedian = bookingTomSelectComedian.getValue();
    const { performances } = comedians.find(item => item.id === idComedian);
    const { hall } = performances.find(item => item.time === time);
    inputHidden.value = `${idComedian},${time}`;
    bookingTomSelectTime.blur();
    bookingHall.textContent = hall;
    bookingComedian.append(bookingHall);
  });

  const createNextBookingComedian = () => {
    if (bookingComediansList.children.length < MAX_COMEDIANS) {
      const nextComediansBlock = createComedianBlock(comedians);
      bookingComediansList.append(nextComediansBlock);
    }
    bookingTomSelectTime.off('change', createNextBookingComedian);
  };

  bookingTomSelectTime.on('change', createNextBookingComedian);

  return bookingComedian;
};

const getComedians = async () => {
  const response = await fetch(`${location.protocol}//${location.hostname}:2125/comedians`);
  return response.json();
};

const init = async () => {
  const countComedians = document.querySelector('.event__info-item_comedians .event__info-number');

  const comedians = await getComedians();

  countComedians.textContent = comedians.length;

  const comedianBlock = createComedianBlock(comedians);

  bookingComediansList.append(comedianBlock);

  const validate = new JustValidate(bookingForm, {
    errorFieldCssClass: 'booking__input_invalid',
    successFieldCssClass: 'booking__input_valid',
  });

  const bookingInputFullName = document.querySelector('.booking__input_fullname');
  const bookingInputPhone = document.querySelector('.booking__input_phone');
  const bookingInputTicket = document.querySelector('.booking__input_ticket');

  new Inputmask('+7(999)-999-99-99').mask(bookingInputPhone);
  new Inputmask('99999999').mask(bookingInputTicket);

  validate
    .addField(bookingInputFullName, [{ rule: 'required', errorMessage: 'Заполните Имя Фамилия' }])
    .addField(bookingInputPhone, [
      { rule: 'required', errorMessage: 'Заполните Телефон' },
      {
        validator() {
          const phone = bookingInputPhone.inputmask.unmaskedvalue();
          return phone.length === 10;
        },
        errorMessage: 'Некорректный телефон',
      },
    ])
    .addField(bookingInputTicket, [
      { rule: 'required', errorMessage: 'Заполните Номер билета' },
      {
        validator() {
          const ticket = bookingInputTicket.inputmask.unmaskedvalue();
          return ticket.length === 8;
        },
        errorMessage: 'Неверный номер билета',
      },
    ])
    .onFail(fields => {
      let errorMessage = '';
      for (const key in fields) {
        if (!Object.hasOwnProperty.call(fields, key)) {
          continue;
        }
        const element = fields[key];
        if (!element.isValid) {
          errorMessage += `${element.errorMessage}, `;
        }
      }

      notification.show(errorMessage.slice(0, -2), false);
    });

  bookingForm.addEventListener('submit', event => {
    event.preventDefault();
    const data = { booking: [] };
    const times = new Set();

    new FormData(bookingForm).forEach((value, field) => {
      if (field === 'booking') {
        const [comedian, time] = value.split(',');
        if (comedian && time) {
          data.booking.push({ comedian, time });
          times.add(time);
        }
      } else {
        data[field] = value;
      }

      if (times.size !== data.booking.length) {
        notification.show('Нельзя быть в одно время на двух выступлениях', false);
      }
    });
  });
};

init();

import { Notification } from './Notification';
import { bookingComediansList, bookingButtonSubmit } from '../main';
import Inputmask from 'inputmask';
import JustValidate from 'just-validate';
import { sendData } from './api';

const notification = Notification.getInstance();

export const initForm = (bookingForm, bookingInputFullName, bookingInputPhone, bookingInputTicket, changeSection) => {
  const validate = new JustValidate(bookingForm, {
    errorFieldCssClass: 'booking__input_invalid',
    successFieldCssClass: 'booking__input_valid',
  });

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
          bookingButtonSubmit.disabled = true;
        }
      }

      notification.show(errorMessage.slice(0, -2), false);
    })
    .onValidate(() => {
      bookingButtonSubmit.disabled = false;
    });

  bookingForm.addEventListener('submit', async event => {
    event.preventDefault();

    if (!validate.isValid) {
      bookingButtonSubmit.disabled = true;
      return;
    }

    const data = { booking: [] };
    const times = new Set();

    new FormData(bookingForm).forEach((value, field) => {
      if (field === 'booking') {
        const [comedian, time] = value.split(',');
        if (comedian && time) {
          data.booking.push({ comedian, time });
          times.add(time);
        }
      } else if (field === 'phone') {
        data.phone = value.replace(/[()-]/g, '');
      } else {
        data[field] = value;
      }
    });

    if (times.size !== data.booking.length) {
      notification.show('Нельзя быть в одно время на двух выступлениях', false);
      bookingButtonSubmit.disabled = true;
      return;
    }

    if (times.size === 0) {
      bookingButtonSubmit.disabled = true;
      notification.show('Необходимо выбрать комика и/или время', false);
      return;
    }

    let isSend = false;
    const method = bookingForm.getAttribute('method');
    if (method === 'PATCH') {
      isSend = await sendData(method, data, data.ticket);
    } else {
      isSend = await sendData(method, data);
    }

    if (isSend) {
      notification.show('Бронь принята', true);
      changeSection();
      bookingForm.reset();
      bookingButtonSubmit.disabled = false;
      bookingComediansList.textContent = '';
    }
  });
};

import { Notification } from './Notification';
import Inputmask from 'inputmask';
import JustValidate from 'just-validate';

const notification = Notification.getInstance();

export const initForm = (
  bookingForm,
  bookingButtonSubmit,
  bookingInputFullName,
  bookingInputPhone,
  bookingInputTicket,
) => {
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
        } else if (times.size === 0) {
          bookingButtonSubmit.disabled = true;
          notification.show('Необходимо выбрать выступление', false);
        }
      } else {
        data[field] = value;
      }

      if (times.size !== data.booking.length) {
        notification.show('Нельзя быть в одно время на двух выступлениях', false);
        bookingButtonSubmit.disabled = true;
      }
    });
  });
};

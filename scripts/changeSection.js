import { bookingComediansList } from '../main';
import { createComedianBlock } from './comedians';

export const initChangeSection = (
  event,
  eventButtonReserve,
  eventButtonEdit,
  booking,
  bookingTitle,
  bookingForm,
  comedians,
) => {
  eventButtonReserve.style.transition = 'opacity 0.5s, visibility 0.5s';
  eventButtonEdit.style.transition = 'opacity 0.5s, visibility 0.5s';

  eventButtonReserve.classList.remove('event__button_hidden');
  eventButtonEdit.classList.remove('event__button_hidden');

  const changeSection = () => {
    event.classList.toggle('event__hidden');
    booking.classList.toggle('booking__hidden');

    if (!bookingComediansList.childElementCount) {
      const comedianBlock = createComedianBlock(comedians);
      bookingComediansList.append(comedianBlock);
    }
  };

  eventButtonReserve.addEventListener('click', () => {
    changeSection();
    bookingTitle.textContent = 'Забронируйте место в зале';
    bookingForm.method = 'POST';
  });

  eventButtonEdit.addEventListener('click', () => {
    changeSection();
    bookingTitle.textContent = 'Редактирование брони';
    bookingForm.method = 'PATCH';
  });

  return changeSection;
};

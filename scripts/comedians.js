import TomSelect from 'tom-select';
const MAX_COMEDIANS = 6;

export const createComedianBlock = (comedians, bookingComediansList, bookingButtonSubmit) => {
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
    bookingButtonSubmit.disabled = true;
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
    if (bookingButtonSubmit.disabled) {
      bookingButtonSubmit.disabled = false;
    }
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
      const nextComediansBlock = createComedianBlock(comedians, bookingComediansList, bookingButtonSubmit);
      bookingComediansList.append(nextComediansBlock);
    }
    bookingTomSelectTime.off('change', createNextBookingComedian);
  };

  bookingTomSelectTime.on('change', createNextBookingComedian);

  return bookingComedian;
};

export const displayClientInfo = (parent, data) => {
  const bookingClientFullName = document.createElement('p');
  bookingClientFullName.className = 'booking__client-item';
  bookingClientFullName.textContent = `Имя: ${data.fullName}`;

  const bookingClientPhone = document.createElement('p');
  bookingClientPhone.className = 'booking__client-item';
  bookingClientPhone.textContent = `Телефон: ${data.phone}`;

  const bookingClientTicket = document.createElement('p');
  bookingClientTicket.className = 'booking__client-item';
  bookingClientTicket.textContent = `Номер билета: ${data.ticket}`;

  parent.append(bookingClientFullName, bookingClientPhone, bookingClientTicket);
};

export const displayBooking = (parent, clientData, comediansData) => {
  const bookingComediansList = document.createElement('ul');
  bookingComediansList.className = 'booking__list';

  const bookingComedians = clientData.booking.map(bookingComedian => {
    const comedian = comediansData.find(item => item.id === bookingComedian.comedian);
    const performances = comedian.performances.find(item => bookingComedian.time === item.time);
    return {
      comedian,
      performances,
    };
  });

  bookingComedians.sort((a, b) => a.performances.time.localeCompare(b.performances.time));

  const comedianElements = bookingComedians.map(({ comedian, performances: { time, hall } }) => {
    const comedianItem = document.createElement('li');
    comedianItem.className = 'booking__item';

    const comedianTitle = document.createElement('h3');
    comedianTitle.textContent = comedian.comedian;

    const comedianTime = document.createElement('p');
    comedianTime.className = 'booking__time';
    comedianTime.textContent = `Время: ${time}`;

    const comedianButton = document.createElement('button');
    comedianButton.dataset.booking = `${clientData.fullName} ${clientData.phone} ${clientData.ticket} ${time} ${hall}`;
    comedianButton.className = 'booking__hall';
    comedianButton.textContent = hall;
    comedianButton.type = 'button';

    comedianItem.append(comedianTitle, comedianTime, comedianButton);

    return comedianItem;
  });

  bookingComediansList.append(...comedianElements);

  parent.append(bookingComediansList);
};

export const daysLeft = (deadline) => {
  const difference = new Date(deadline).getTime() - Date.now();
  if (difference <=0) {
    return 'Ended';
  }
  const remainingDays = difference / (1000 * 3600 * 24);

  return remainingDays.toFixed(0);
};

export const timeLeft = (deadline) => {
  const difference = new Date(deadline).getTime() - Date.now();
  if (difference <= 0) {
    return 'Ended';
  }

  // const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.abs(Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)));

  return `${hours}:${minutes}`;
};

export const calculateBarPercentage = (goal, raisedAmount) => {
  const percentage = Math.round((raisedAmount * 100) / goal);

  return percentage;
};

export const checkIfImage = (url, callback) => {
  const img = new Image();
  img.src = url;

  if (img.complete) callback(true);

  img.onload = () => callback(true);
  img.onerror = () => callback(false);
};

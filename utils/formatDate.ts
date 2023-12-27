export const formatDate = (date: any) => {
  const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
  const month =
    date.getMonth() + 1 <= 9 ? date.getMonth() + 1 : date.getMonth() + 1;
  console.log('month', switchMonths(month), month);
  return `${day} ${switchMonths(month)}`;
};
function switchMonths(params: number) {
  switch (params) {
    case 1:
      return 'Jan';
    case 2:
      return 'Fev';
    case 3:
      return 'Mar';
    case 4:
      return 'Abr';
    case 5:
      return 'Mai';
    case 6:
      return 'Jun';
    case 7:
      return 'Jul';
    case 8:
      return 'Ago';
    case 9:
      return 'Set';
    case 10:
      return 'Out';
    case 11:
      return 'Nov';
    case 12:
      return 'Dez';
  }
}

export function calendarDay(data: Date) {
  const diasDaSemana = [];
  const dataObj = new Date(data);
  const diaDaSemana = dataObj.getUTCDay();
  for (let i = 0; i < 7; i++) {
    const dia = dataObj.getUTCDate() + i - diaDaSemana;
    diasDaSemana.push(dia);
  }
  return diasDaSemana;
}

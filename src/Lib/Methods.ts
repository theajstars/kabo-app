function validateEmail(email: string) {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}
const getFinancialValueFromNumeric = (value: number | string | undefined) => {
  if (value !== undefined) {
    return parseInt(value.toString()).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
  return "...";
};

const getFullDate = (dateString: string | undefined) => {
  if (dateString) {
    const d = new Date(dateString);
    const MONTHS = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const year = d.getFullYear();
    const month = MONTHS[d.getMonth()];
    const day = DAYS[d.getDay()];
    return `${day} ${d.getDate()} ${month}, ${year} `;
  }
  return dateString;
};
const getHalfDate = (dateString: string | undefined) => {
  if (dateString) {
    const d = new Date(dateString);
    const MONTHS = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const year = d.getFullYear();
    const month = MONTHS[d.getMonth()];

    return `${month}-${d.getDate()}-${year} `;
  }
  return dateString;
};
function validatePhoneNumber(input_str: string) {
  var re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
  let str = input_str.replaceAll("+", "");
  if (str.substring(0, 3) === "234") {
    str = str.replace("234", "");
  }
  // var re = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;

  return re.test(str);
}
export {
  validateEmail,
  getFinancialValueFromNumeric,
  getFullDate,
  getHalfDate,
  validatePhoneNumber,
};

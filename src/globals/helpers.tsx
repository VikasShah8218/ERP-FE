import "datejs";
// form data helpers
const getFormInputsData = (refs) => {
  const data = {};
  let errors = 0;
  Object.entries(refs).forEach(function ([key, ref]) {
    const element = ref.current;
    const value = element.value.trim();
    if (element.hasAttribute("required")) {
      if (value) {
        data[key] = value;
        if (element.classList.contains("error")) {
          element.classList.remove("error");
        }
      } else {
        errors++;
        if (!element.classList.contains("error")) {
          element.classList.add("error");
        }
      }
    } else data[key] = value;
  });
  return errors === 0 ? data : null;
};
const setFormInputsData = (refs, data) => {
  Object.entries(refs).forEach(function ([key, ref]) {
    if (data[key]) {
      ref.current.value = data[key];
    }
  });
};
// form input validator
const validatePin = (event) => {
  event.target.value = event.target.value.replace(/\D/g, "").slice(0, 6);
};
const validatePhone = (event) => {
  event.target.value = event.target.value.replace(/\D/g, "").slice(0, 10);
};
const validateLowerCase = (event) => {
  event.target.value = event.target.value.toLowerCase();
};
// date time & time zons conversion helpers
const fromatDateTimeToDateTime = (datetimeStr) => {
  return Date.parse(datetimeStr.split(".")[0])
    .add({ hours: 5, minutes: 30 })
    .toString("ddd, MMM d, yyyy HH:mm:ss");
};
const fromatDateTimeToDate = (datetimeStr) => {
  return Date.parse(datetimeStr.split(".")[0])
    .add({ hours: 5, minutes: 30 })
    .toString("dd-MMM-yyyy");
};
const fromatDateToDate = (datetimeStr) => {
  return Date.parse(datetimeStr).toString("dd-MMM-yyyy");
};
// exporting helpers
export {
  getFormInputsData,
  setFormInputsData,
  validatePin,
  validatePhone,
  validateLowerCase,
  fromatDateTimeToDateTime,
  fromatDateTimeToDate,
  fromatDateToDate,
};

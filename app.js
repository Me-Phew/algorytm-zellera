const weekdays = [
  "wtorek",
  "środa",
  "czwartek",
  "piątek",
  "sobota",
  "niedziela",
  "poniedziałek",
];

const yearInput = document.querySelector("input.year");
const monthInput = document.querySelector("input.month");
const dayInput = document.querySelector("input.day");

const toSentenceCase = (text) => {
  if (!text || text.length === 0) {
    return "";
  }

  return `${text[0].toUpperCase()}${text.substring(1)}`;
};

function isTextSelected(input) {
  if (typeof input.selectionStart == "number") {
    return (
      input.selectionStart == 0 && input.selectionEnd == input.value.length
    );
  } else if (typeof document.selection != "undefined") {
    input.focus();
    return document.selection.createRange().text == input.value;
  }
}

const handleOnlyNumbersInput = (maxLength, e, customHook = undefined) => {
  if (
    e.key === "Backspace" ||
    e.key === "Tab" ||
    e.key.startsWith("Arrow") ||
    e.ctrlKey
  ) {
    return;
  }

  if (!e.code.startsWith("Digit")) {
    e.preventDefault();
    return;
  }

  const value = e.target.value;

  const valueLength = value.length;

  if (isTextSelected(e.target)) {
    return;
  }

  if (valueLength === maxLength) {
    e.preventDefault();
  }

  if (valueLength === maxLength - 1) {
    if (parseInt(value) === 0 && e.code === "Digit0") {
      e.preventDefault();
    }
  }

  if (customHook) {
    customHook(e);
  }
};

const preventPaste = (e) => e.preventDefault();

yearInput.addEventListener("keydown", (e) => handleOnlyNumbersInput(4, e));

const monthValidationHook = (e) => {
  const newValue = parseInt(e.target.value + e.key);

  if (newValue > 12) {
    e.preventDefault();
  }
};

monthInput.addEventListener("keydown", (e) =>
  handleOnlyNumbersInput(2, e, monthValidationHook)
);

const dayValidationHook = (e) => {
  const newValue = parseInt(e.target.value + e.key);

  if (newValue > 31) {
    e.preventDefault();
  }
};

dayInput.addEventListener("keydown", (e) =>
  handleOnlyNumbersInput(2, e, dayValidationHook)
);

yearInput.addEventListener("paste", preventPaste);
monthInput.addEventListener("paste", preventPaste);
dayInput.addEventListener("paste", preventPaste);

const calculateWeekdayIndex = ({ y, m, d }) => {
  const z = m < 3 ? y - 1 : y;
  const c = m < 3 ? 0 : 2;

  return (
    (Math.floor((23 * m) / 9) +
      d +
      4 +
      y +
      Math.floor(z / 4) +
      Math.floor(z / 100) +
      Math.floor(z / 400) -
      c) %
    7
  );
};

let year;
let month;
let day;

const weekdayResult = document.getElementById("weekday-result");
const dateResult = document.getElementById("date-result");

const setError = () => {
  weekdayResult.innerText = "Wprowadź poprawną datę";
};

const handleWeekdayUpdate = () => {
  year = parseInt(yearInput.value);
  month = parseInt(monthInput.value);
  day = parseInt(dayInput.value);

  if (Number.isNaN(year)) {
    setError();
    return;
  }

  if (Number.isNaN(month)) {
    setError();
    return;
  }

  if (Number.isNaN(day)) {
    setError();
    return;
  }

  const weekdayIndex = calculateWeekdayIndex({ y: year, m: month, d: day });
  const weekday = weekdays[weekdayIndex];

  const date = new Date(year, month - 1, day).toLocaleDateString("pl-PL", {
    weekday: "long",
  });

  weekdayResult.innerText = `Algorytm Zellera : ${toSentenceCase(weekday)}`;
  dateResult.innerText = `JavaScript Date : ${toSentenceCase(date)}`;
};

yearInput.addEventListener("input", handleWeekdayUpdate);
monthInput.addEventListener("input", handleWeekdayUpdate);
dayInput.addEventListener("input", handleWeekdayUpdate);

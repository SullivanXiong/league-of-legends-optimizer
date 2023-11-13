// Enum for input types
const InputType = {
  BUTTON: "button",
  CHECKBOX: "checkbox",
  COLOR: "color",
  DATE: "date",
  DATETIME_LOCAL: "datetime-local",
  EMAIL: "email",
  FILE: "file",
  HIDDEN: "hidden",
  IMAGE: "image",
  MONTH: "month",
  NUMBER: "number",
  PASSWORD: "password",
  RADIO: "radio",
  RANGE: "range",
  RESET: "reset",
  SEARCH: "search",
  SUBMIT: "submit",
  TEL: "tel",
  TEXT: "text",
  TIME: "time",
  URL: "url",
  WEEK: "week",
};

export class Field {
  constructor(type, value, options = {}) {
    this.type = type in InputType ? type : InputType.TEXT;
    this.value = value;
    this.options = options; // Optional properties like placeholder, class, id, etc.
  }
}

export class FieldList {
  constructor(field) {
    this.field = field;
  }
}

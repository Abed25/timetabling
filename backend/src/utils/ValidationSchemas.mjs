export const LecturesValidationSchemas = {
  name: {
    isString: { errorMessage: "Name of the units can only be letters" },
    notEmpty: { errorMessage: "Unit name cannot be empty" },
  },
  lecturer: {
    notEmpty: { errorMessage: "Must have a lecturer name" },
    isString: { errorMessage: "Lecturer name can only be letters" },
  },
  day: {
    notEmpty: { errorMessage: "Day cannot be empty" },
    isString: { errorMessage: "Day can only be letters" },
  },
};

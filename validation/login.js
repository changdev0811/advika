//Import Modules
const Validator = require('validator');

const isEmpty = (value) => {
    return (
        value === undefined ||
        value === null ||
        (typeof value === 'object' && Object.keys(value).length === 0) ||
        (typeof value === 'string' && value.trim().length === 0)
    );

}

module.exports = function validateLoginInput(data) {
    let errors = {}

    data.email = !isEmpty(data.email) ? data.email : '';
    data.password = !isEmpty(data.password) ? data.password : '';

    if (!Validator.isEmail(data.email)) {
        errors.email = "Please enter a valid Email";
    }

    if (Validator.isEmpty(data.email)) {
        errors.password = "Email is a required field!";
    }

    if (Validator.isEmpty(data.password)) {
        errors.password = "Password is a required field!";
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}
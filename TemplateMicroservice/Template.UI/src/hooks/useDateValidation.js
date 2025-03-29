import { useState } from 'react';
/**
 * Custom hook to validate date inputs.
 * @param {Function} validateDate - A function to validate the date.
 * @returns {Object} - Contains the date, error, and handlers.
 */
const useDateValidation = (validateDate) => {
      const [date, setDate] = useState('');
      const [error, setError] = useState('');

      const handleDateChange = (newDate) => {
            setDate(newDate);
            if (validateDate) {
                  const validationError = validateDate(newDate);
                  setError(validationError || '');
            }
      };

      return {
            date,
            error,
            setDate: handleDateChange,
      };
};

export default useDateValidation;
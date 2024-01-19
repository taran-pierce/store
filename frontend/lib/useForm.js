import { useState, useEffect } from 'react';

// custom hook for forms
export default function useForm(initial = {}) {
  // create a state object for our inputs
  const [inputs, setInputs] = useState(initial);
  const initialValues = Object.values(initial).join();

  // make sure the form updates when the intial values change
  // catches a use case where the users reloads or goes directly to this page
  useEffect(() => {
    setInputs(initial);
  }, [initialValues]);

  function handleChange(e) {
    let { value, name, type } = e.target;

    // form inputs always save data as strings
    // turn it back to a number if its a number
    if (type === 'number') {
      value = parseInt(value);
    }

    // file uploads are an array
    // so you need to set the value to be an array
    if (type === 'file') {
      [value] = e.target.files;
    }

    // update the state of the inputs
    setInputs({
      ...inputs,
      [name]: value,
    });
  }

  // set form back to initial state
  function resetForm() {
    setInputs(initial);
  }

  // empty the form
  function clearForm() {
    // using Object.entries to loop through object as an array
    // map to modify it to return only the keys but empty values
    // Object.fromEntries to turn the array back into an object
    const blankState = Object.fromEntries(
      Object.entries(inputs).map(([key, value]) => {
        const newValue = '';

        return [key, newValue];
      })
    );

    setInputs(blankState);
  }

  return {
    inputs,
    handleChange,
    resetForm,
    clearForm,
  };
}

export const name = (rule, value, callback) => {
  if (!value) {
    callback('Field required');
  } else if (value.length > 50) {
    callback('Length must not be greater than 50.');
  } else if (!/^[A-Za-z0-9_-]{1,}$/.test(value)) {
    callback(
      'Name cannot contain special characters or spaces except "_","-","."'
    );
  } else {
    callback();
  }
};
export const select = (rule, value, callback) => {
  if (!value) {
    callback('Field required');
  } else {
    callback();
  }
};

export const inputs = (rule, value, callback) => {
  if (value.length < 1) {
    callback('Field required');
  } else {
    callback();
  }
};

export const password = (rule, value, callback) => {
  if (!value) {
    callback('Field required');
  } else if (!/^[\S\n\s]{8,16}$/.test(value)) {
    callback('Password length should be 8 to 16 characters');
  } else {
    callback();
  }
};
export const confirm = field => {
  return (rule, value, callback) => {
    if (!value) {
      callback('Field required');
    } else if (value !== field) {
      callback('Passwords do not match');
      console.log(field);
    } else {
      callback();
    }
  };
};
export const email = (rule, value, callback) => {
  if (!value) {
    callback('Field required');
  } else if (
    !/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(value)
  ) {
    callback('Invalid email address');
  } else {
    callback();
  }
};
export const required = (rule, value, callback) => {
  if (!value) {
    callback('Field required');
  } else {
    callback();
  }
};
export const number = (rule, value, callback) => {
  const reg = /^\d+$/;
  if (value && !reg.test(value)) {
    callback('Input number');
  } else {
    callback();
  }
};

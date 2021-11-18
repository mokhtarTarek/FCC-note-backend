const info = (...params) => {
  //normal logs
  if (process.env.NODE_ENV !== 'test') { 
    console.log(...params)
  }
};

const error = (...params) => {
  //error logs
  if (process.env.NODE_ENV !== 'test') { 
    console.error(...params)
  }
};

module.exports = {
  info,
  error,
};

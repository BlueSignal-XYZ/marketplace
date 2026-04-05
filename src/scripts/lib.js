export const handleError = (msg, err = {}) => {
  console.error({ message: msg, error: err });
};

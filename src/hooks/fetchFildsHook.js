module.exports = function fetchFilds() {
  return async context => {
    const data = context.result.data[0];
    for (let field of data['client']) {
      if (field.type === 'checkBox' || field.type === 'tags') {
        if (field.defaultValue) {
          field.defaultValue = JSON.parse(field.defaultValue);
        }
      }
    }
    for (let field of data['clientGroupe']) {
      if (field.type === 'checkBox' || field.type === 'tags') {
        if (field.defaultValue) {
          field.defaultValue = JSON.parse(field.defaultValue);
        }
      }
    }
    for (let field of data['product']) {
      if (field.type === 'checkBox' || field.type === 'tags') {
        if (field.defaultValue) {
          field.defaultValue = JSON.parse(field.defaultValue);
        }
      }
    }
    for (let field of data['suppliers']) {
      if (field.type === 'checkBox' || field.type === 'tags') {
        if (field.defaultValue) {
          field.defaultValue = JSON.parse(field.defaultValue);
        }
      }
    }
    context.result.data[0] = data;
    return context;
  };
};

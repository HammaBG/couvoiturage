module.exports = function defaultValueTransform() {
  return async context => {
    for (var title in context.data) {
      for (let field of context.data[title]) {
        if (
          (field.type === 'checkBox' || field.type === 'tags') &&
          typeof field.defaultValue !== 'string'
        ) {
          if (field.defaultValue) {
            field.defaultValue = JSON.stringify(field.defaultValue);
          }
        }
      }
    }
    return context;
  };
};

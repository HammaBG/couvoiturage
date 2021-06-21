module.exports = function getByUser() {
  return async context => {
    if (!context.params.payload.clientId) {
      const type = context.params.user.type;
      const role = await context.app.api.service('roles').get(type);
      if (role.frontOffice === true) {
        context.params.query.user = context.params.user._id;
        return context;
      }
      return context;
    }
  };
};

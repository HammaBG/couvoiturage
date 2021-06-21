module.exports = function getByZone() {
  return async context => {
    if (context.params.user) {
      const type = context.params.user.type;
      const role = await context.app.api.service('roles').get(type);
      if (role.frontOffice === true) {
        context.params.query.zone = context.params.user.zone;
        return context;
      }
      return context;
    } else {
      return context;
    }
  };
};

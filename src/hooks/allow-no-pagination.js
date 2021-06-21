// hook to disable pagination if '$limit' is set to '-1'

module.exports = function(context) {
  if (context.params.query && parseInt(context.params.query.$limit) === -1) {
    context.params.paginate = false;
    delete context.params.query.$limit;
  }
};

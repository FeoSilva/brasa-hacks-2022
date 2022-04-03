function BadRequest(message) {
  this.name = 'BadRequest';
  this.statusCode = 404
  this.message = message || 'Não encontrado';
  this.stack = (new Error()).stack;
}
BadRequest.prototype = Object.create(BadRequest.prototype);
BadRequest.prototype.constructor = BadRequest;

module.exports = BadRequest
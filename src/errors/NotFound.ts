function NotFound(message) {
  this.name = 'NotFound'
  this.statusCode = 404
  this.message = message || 'Não encontrado'
  this.stack = new Error().stack
}
NotFound.prototype = Object.create(NotFound.prototype)
NotFound.prototype.constructor = NotFound

export default NotFound

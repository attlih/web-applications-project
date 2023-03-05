module.exports = function (req, res, next) {
  req.admin = (req.user.username === 'admin')
  if (!req.admin) return res.status(403).send('Access denied.')
  next()
}

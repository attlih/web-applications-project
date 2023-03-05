module.exports = function (req, res, next) {
  // set admin flag
  req.admin = (req.user.username === 'admin')
  if (!req.admin) return res.status(403).json({error: 'Access denied.'})
  next()
}

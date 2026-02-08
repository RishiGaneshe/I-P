const path = require('path')


exports.loadProfilePage = (req, res) => {
  return res.sendFile(
    path.join(__dirname, '..', 'public', 'index.html')
  )
}

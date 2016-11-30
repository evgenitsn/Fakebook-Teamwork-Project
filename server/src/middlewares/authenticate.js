import jwt from 'jsonwebtoken'
import config from '../config'
import User from '../models/User'

export default (req, res, next) => {
  const authorizationHeader = req.headers['authorization']
  let token

  if (authorizationHeader) {
    token = authorizationHeader.split(' ')[1]
  }

  if (token) {
    jwt.verify(token, config.jwtSecret, (err, decoded) => {
      console.log(decoded)
      if (err) {
        res.status(401).json({error: 'Failed to authenticate'})
      } else {
        User.findOne({username: decoded.username})
            .select('username email id createdAt')
            .then(user => {
              if (!user) {
                res.status(404).json({error: 'No such user'})
              } else {
                req.currentUser = user
                next()
              }
            })
      }
    })
  }
  else {
    res.status(403).json({
      error: 'No token provided'
    })
  }
}
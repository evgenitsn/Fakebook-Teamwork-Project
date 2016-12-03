import express from 'express'
import commonValidations from '../shared/validations/signup'
import bcrypt from 'bcryptjs'
import { User } from '../models/User'
import isEmpty from 'lodash/isEmpty'

let router = express.Router()

function validateInput(data, otherValidations) {

  let {errors} = otherValidations(data);

  return User.find({$or: [{username: data.username}, {email: data.email}]})
             .then(user => {
               if (user.length) {
                 if (user[0].username === data.username) {
                   errors.username = 'Username is used';
                 }
                 if (user[0].email === data.email) {
                   errors.email = 'Email is used';
                 }
               }
               return {
                 errors,
                 isValid: isEmpty(errors)
               }
             })
}

router.get('/exists/:identifier', (req, res) => {
  User.findOne({$or: [{username: req.params.identifier}, {email: req.params.identifier}]})
    .then(user => {
      res.json({exists: user !== null})
    })
    .catch(err => {
      console.log(err)
      res.json({exists: false})
    })
})

router.get('/:username', (req, res) => {
  User.findOne({username: req.params.username})
      .populate({path: 'statuses',
        populate: [
          { path: 'user', select: 'username' },
          { path: 'comments', options: { sort: { updatedAt: 'desc' }}},
          { path: 'likes' }
        ], options: { sort: { updatedAt: 'desc' }}})
      .then(user => {
        if(user) user.password_digest = ''
        res.json({user})
      })
    .catch(console.log)
})

router.post('/', (req, res) => {
  validateInput(req.body, commonValidations).then(({errors, isValid}) => {
    if (isValid) {
      const {username, email, password} = req.body;

      const salt = bcrypt.genSaltSync(10)
      const password_digest = bcrypt.hashSync(password, salt)

      let user = {
        username: username,
        email: email,
        password_digest: password_digest,
        statuses: [],
        friends: []
      }

      User.create(user)
          .then(user => res.json({success: true}))
          .catch(err => res.status(500).json({error: err}))
    } else {
      res.status(400).json(errors)
    }
  })
})

export default router
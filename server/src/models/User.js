import mongoose from 'mongoose'

let requiredValidationMessage = '{PATH} is required'

let userSchema = mongoose.Schema({
  username: { type: String, required: requiredValidationMessage, unique: true, indexed: true },
  email: { type: String, required: requiredValidationMessage, unique: true },
  password_digest: { type: String, required: requiredValidationMessage },
  statuses: [{type: mongoose.Schema.ObjectId, ref: 'Status'}],
  friends: [{type: mongoose.Schema.ObjectId, ref: 'User'}]
}, {
  timestamps: true,
  collection: 'users'
})

let User = mongoose.model('User', userSchema)

export { User }

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// const userSchema = new Schema({
//     name: {type: String, required: true, unique: true},
//     password: {type: String, required: true, minlength: 8, trim: true},
//     email: {type: String, trim: true, unique: true},
//     city: String,
//     age: Number,
//     tokens: [{token: String}]
// })

const userSchema = mongoose.Schema({
        name: {type: String, trim: true, required: true, unique: true},
        password: {
            type: String, required: true, minlength: 8, trim: true,
            validate(value) {
                if (value.toLowerCase().includes('password')) {
                    throw Error('can not contain password')
                }
            }
        },
        email: {
            type: String, required: true, unique: true, trim: true,
            validate(value) {
                if (!validator.isEmail(value)) {
                    throw new Error('Invalid email address')
                }
            }
        },
        city: {type: String, required: true},
        age: {
            type: Number,
            validate(value) {
                if (value < 1) {
                    throw new Error('can not be a negative number')
                }
            }
        },
    avatar:{type: Buffer},
        tokens: [{
            token: {type: String, required: true}
        }]
    },
    {
        timestamps:
            {
                createdAt: 'created_at',
                updatedAt: 'updated_at'
            }
    }
)

userSchema.pre('save', async function (next) {
    const user = this
    if (user.isModified('password')) {
        // console.log('user password changed from pre save directive')
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

userSchema.pre('remove', async function (next) {
    const user = this
    await user.populate('tasks').execPopulate()
    // console.log(user.tasks)
    if (user.tasks) {
        user.tasks.forEach((task) => {
            task.remove()
        })
    }
    next()
})

userSchema.static('login', async (email, password) => {
    const user = await User.findOne({email: email})
    // console.log(user)
    if (!user) {
        throw new Error('email/password combination is invalid')
    }
    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw new Error('email/password combination is invalid')
    }
    return user
})

userSchema.method('toJSON', function () {
    const user = this.toObject()
    delete user.password
    delete user.tokens
    delete user.avatar
    return user
})

userSchema.method('getJWT', async function () {
    const user = this
    // console.log(user.tokens.keys())
    try {
        const token = await jwt.sign({_id: user._id.toString()}, process.env.JWT_KEY)
        // console.log(token)
        // console.log('before: ' + user.tokens)
        user.tokens = await user.tokens.concat({token})
        // console.log('after: ' + user.tokens)
        await user.save()
        // console.log('user saved')
        return token
    } catch (e) {
        return e
    }
})

userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'user_id'
})

const User = mongoose.model('User', userSchema)

module.exports = User
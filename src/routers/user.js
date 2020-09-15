const express = require('express')
const router = express.Router()

const multer = require('multer')
const uploadAvatar = multer({
    // dest: 'uploads/avatar',
    limits: {
        fileSize: 2049374
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png|tiff)$/)) {
            return cb(new Error('Please upload a image file'))
        }
        cb(undefined, true)
    }
})

const sharp = require('sharp')

const User = require('../models/user')
const auth = require('../middleware/auth')
const {sendWelcomeEmail, sendGoodbyeEmail} = require('../emails/sendgrid')

router.get('/usersall', async (req, res) => {
        try {
            // console.log(`my text ${req.query.active}`)
            // console.log("%cExtra Large Yellow Text with Red Background", "background: red; color: yellow; font-size: x-large");
            const users = await User.find({})
            if (users.length === 0) {
                return res.status(404).send({error: 'No users found'})
            }
            res.status(200).send(users)
        } catch (e) {
            console.log(e.message)
            res.status(500).send(e)
        }
    }
)

router.get('/users/me', auth, async (req, res) => {
        // console.log(req.current_user)
        res.send(req.current_user)
    }
)

router.patch('/users/me', auth, async (req, res) => {
        // console.log(Object.keys(req.body))
        const fields = Object.keys(req.body)
        const allowedFields = ['name', 'password', 'email', 'city', 'age']
        const isAllowed = fields.every((value) => allowedFields.includes(value))
        if (!isAllowed) {
            return res.status(400).send({error: 'Invalid field update'})
        }
        try {
            const user = await User.findById(req.current_user.id)
            fields.forEach((field) => {
                user[field] = req.body[field]
            })
            await user.save()
            res.status(200).send(user)
        } catch (e) {
            res.status(500).send(e)
        }
    }
)

router.delete('/users/me', auth, async (req, res) => {
        try {
            //req.user.remove()
            const user = await User.findById(req.current_user.id)
            // console.log(user)
            user.remove()
            sendGoodbyeEmail(user.email, user.name)
            // // console.log(user)
            res.status(200).send({'response': 'user removed'})
        } catch (e) {
            res.status(500).send({error: 'user not found'})
        }
    }
)

router.post('/users', async (req, res) => {
        let user = new User(
            req.body
        )
        try {
            await user.save()
            sendWelcomeEmail(user.email, user.name)
            const token = await user.getJWT()
            res.status(201).send({user, token})
        } catch (e) {
            res.status(400).send(e)
        }
    }
)

router.post('/users/login', async (req, res) => {
    try {
        // console.log(req.body)
        const user = await User.login(req.body.email, req.body.password)
        // console.log(user)
        const token = await user.getJWT()
        res.status(200).send({user, token})
        // console.log(user,token)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.post('/users/logout', auth, async (req, res) => {
    try {
        // console.log(req.current_user.tokens)
        // console.log(req.token)
        req.current_user.tokens = req.current_user.tokens.filter(
            (record) => record.token !== req.token
        )
        await req.current_user.save()
        // console.log(req.current_user.tokens)
        // console.log(req.token)
        res.status(200).send({'response': 'user logged out'})
    } catch (e) {
        res.status(500).send(e)
    }
})

router.post('/users/logoutall', auth, async (req, res) => {
    try {
        req.current_user.tokens = []
        await req.current_user.save()
        res.status(200).send({'response': 'user logged out'})
    } catch (e) {
        res.status(500).send(e)
    }
})

router.post('/users/me/avatar',
    auth,
    uploadAvatar.single('avatar'),
    async (req, res) => {
        const buffer = await sharp(req.file.buffer).resize({width: 250, height: 250}).png().toBuffer()

        req.current_user.avatar = buffer
        await req.current_user.save()
        try {
            res.send({response: 'avatar uploaded'})
        } catch (e) {
            res.status(500).send(e)
        }
    },
    (error, req, res, next) => {
        res.status(400).send({error: error.message})
    })

router.delete('/users/me/avatar',
    auth,
    uploadAvatar.single('avatar'),
    async (req, res) => {
        req.current_user.avatar = undefined
        await req.current_user.save()
        try {
            res.send({response: 'avatar removed'})
        } catch (e) {
            res.status(500).send(e)
        }
    },
    (error, req, res, next) => {
        res.status(400).send({error: error.message})
    })

router.get('/users/:id/avatar',
    async (req, res) => {
        try {
            const user = await User.findById(req.params.id)
            if (!user || !user.avatar) {
                return res.status(404).send({error: 'image not found'})
            }
            res.set('Content-Type', 'image/png')
            res.send(user.avatar)
        } catch (e) {
            res.status(500).send(e)
        }
    },
    (error, req, res, next) => {
        res.status(400).send({error: error.message})
    })

// router.post('/users/me/avatar',  (req, res) =>{
//     uploadAvatar(req, res,  (err) =>{
//         if (err instanceof multer.MulterError) {
//             // A Multer error occurred when uploading.
//         } else if (err) {
//             // An unknown error occurred when uploading.
//         }
//         console.log()
//         // Everything went fine.
//     })
// })

module.exports = router
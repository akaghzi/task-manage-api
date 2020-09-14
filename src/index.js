const express = require('express')
const port = process.env.PORT || 8989
require('./db/mongoose')
const userRouter = require('../src/routers/user')
const taskRouter = require('../src/routers/task')

const app = express()

// app.use((req, res, next) => {
//          return res.status(503).send({error: 'Site is under maintenance, please try again later'})
// })

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.get('', (req, res) => {
        return res.send({response: 'Hi there'})
    }
)

app.listen(port, () => {
    console.log('task-manager start on port ' + port)
})
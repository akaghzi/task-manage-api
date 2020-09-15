const app = require('./app')
const port = process.env.PORT || 8989

app.listen(port, () => {
    console.log('task-manager start on port ' + port)
})
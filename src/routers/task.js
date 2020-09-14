const express = require('express')
const router = express.Router()
const Task = require('../models/task')
const auth = require('../middleware/auth')

router.get('/tasksall', async (req, res) => {
        // console.log(req.current_user.id)
        try {
            const tasks = await Task.find({})
            // const tasks = await Task.find({user_id: req.current_user.id})
            // console.log(tasks)
            if (tasks.length === 0) {
                return res.status(404).send({error: 'No tasks found'})
            }
            res.status(200).send(tasks)
        } catch (e) {
            console.log(e)
            res.status(500).send(e)
        }
    }
)

router.get('/tasks', auth, async (req, res) => {
        // console.log(req.query)
        try {
            // console.log(req.query)
            const match = {}
            const sort = {}
            if (req.query.sortBy) {
                const parsedSortBy = req.query.sortBy.split(':')
                // const colName = parsedSortBy[0]
                // const sortOrder = parsedSortBy[1]
                // sort[colName] = sortOrder
                sort[parsedSortBy[0]] = parsedSortBy[1] === 'desc' ? -1 : 1
                console.log(sort)
            }
            if (req.query.completed) {
                // right hand of assignment will return true or false
                match.completed = req.query.completed === 'true'
                // await req.current_user.populate('tasks').execPopulate()
                // console.log('all tasks')
            }
            await req.current_user.populate({
                path: 'tasks',
                match,
                options: {
                    limit: parseInt(req.query.limit),
                    skip: parseInt(req.query.skip),
                    sort
                }
            }).execPopulate()
            // console.log('some tasks')

            if (req.current_user.tasks.length === 0) {
                return res.status(404).send({error: 'No tasks found'})
            }
            res.status(200).send(req.current_user.tasks)
        } catch (e) {
            console.log(e)
            res.status(500).send(e)
        }
    }
)

router.get('/tasks/:id', auth, async (req, res) => {
        try {
            // console.log(req.params.id, req.current_user.id)
            // await req.current_user.populate('tasks').execPopulate()
            // console.log(req.current_user.tasks)
            const task = await Task.findOne({_id: req.params.id, user_id: req.current_user._id})
            // const task = req.current_user.tasks.filter((task)=>task.id=req.params.id)
            if (!task) {
                return res.status(404).send({error: 'task not found'})
            }
            res.status(200).send(task)
        } catch (e) {
            res.status(500).send(e)
        }
    }
)

router.patch('/tasks/:id', auth, async (req, res) => {
        // console.log(Object.keys(req.body))
        const fields = Object.keys(req.body)
        const allowedFields = ['name', 'completed']
        const isAllowed = fields.every((value) => allowedFields.includes(value))
        if (!isAllowed) {
            return res.status(400).send({error: 'Invalid field update'})
        }
        try {
            const task = await Task.findOne({_id: req.params['id'], user_id: req.current_user.id})
            if (!task) {
                throw new Error()
            }
            fields.forEach((field) => {
                task[field] = req.body[field]
            })
            await task.save()
            res.status(200).send(task)
        } catch (e) {
            res.status(404).send(e)
        }
    }
)

router.delete('/tasks/:id', auth, async (req, res) => {
        try {
            const task = await Task.findOne({_id: req.params.id, user_id: req.current_user.id})
            if (!task) {
                return res.status(404).send({error: 'task not found'})
            }
            task.remove()
            res.status(200).send(task)
        } catch (e) {
            res.status(500).send(e)
        }
    }
)

router.post('/tasks', auth, async (req, res) => {
        let task = new Task(
            req.body
        )
        task.user_id = req.current_user.id
        try {
            await task.save()
            res.status(201).send(task)
        } catch (e) {
            res.status(400).send(e)
        }
    }
)

module.exports = router
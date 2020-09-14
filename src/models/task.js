const mongoose = require('mongoose')

const taskSchema = mongoose.Schema({
        name: {
            type: String,
            required: true,
            trim: true
        },
        completed: {
            type: Boolean,
            default: false
        },
        user_id: {type: mongoose.Schema.Types.ObjectID, required: true, ref: 'User'}
    },
    {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        }
    }
)

// taskSchema.pre('findOneAndUpdate', function () {
//     // console.log('findOneAndUpdate is called here')
//     this.set({updated_at: new Date()});
// });

const Task = mongoose.model('Task', taskSchema)

module.exports = Task
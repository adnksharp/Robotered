const mongoose = require('mongoose'),
	PostSchema = new mongoose.Schema({
		myId: {
			type: Number,
			required: true,
			min: 0,
			max: 60
		},
		base: { 
			type: Number,
			required: true,
			min: 0,
			max: 180
		},
		shoulder: { 
			type: Number,
			required: true,
			min: 0,
			max: 180
		},
		elbow: { 
			type: Number,
			required: true,
			min: 0,
			max: 180
		},
		wristx: { 
			type: Number,
			required: true,
			min: 0,
			max: 180
		},
		wristy: { 
			type: Number,
			required: true,
			min: 0,
			max: 180
		},
		gripper: { 
			type: Number,
			required: true,
			min: 70,
			max: 120
		}
	},
	{
		timestamps: true,
		versionKey: false
	}
	)

module.exports = mongoose.model('Post', PostSchema)

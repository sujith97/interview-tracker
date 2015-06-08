var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	interviewSchema = new Schema({
		interviewerId: String,
		interviewDate: Date,
		interviewerStatus: String,
		interviewerComments: String
	}),
	candidateSchema = new Schema({
		candidateName: String,
		candidateResume: String,
		candidateStatus: String,
		candidateDescription: String,
		candidateInterviews: [interviewSchema]
	}),
	memberSchema = new Schema({
		memberName: String,
		memberEmail: String
	}),
	projectSchema = new Schema ({
		projectName: String,
		projectUrl: String,
		projectDate: String,
		projectPartner: String,
		projectCandidates: [candidateSchema],
		projectMembers: [memberSchema]
	});

mongoose.model('project', projectSchema);
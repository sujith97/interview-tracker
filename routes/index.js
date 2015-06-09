var express = require('express'),
	mongoose = require('mongoose'),
	fs = require('fs'),
	emailService = require('../services/emailService'),
	router = express.Router(),
	path = require('path'),
	interviewHtmlContent,
	memberAddedHtmlContent,
	candidateAddedHtmlContent,
	candidateAddedHtmlContent,
	feedbackHtmlContent,
	interviewCancelledHtmlContent;

var MONGO_URL = "mongodb://" + process.env.IT_MONGOLAB_UID + ":" 
				+ process.env.IT_MONGOLAB_PASSWORD + "@ds045632.mongolab.com:45632/heroku_app37662283"
mongoose.connect(MONGO_URL);

fs.readdirSync(__dirname + '/../models').forEach(function(fileName) {
	require(__dirname + '/../models/' + fileName);
});

fs.readFile(path.join(__dirname, '../email/interview-assignment.html'), function (err, data) {
  if (err) {
    return console.log(err);
  }
  interviewHtmlContent = data
});

fs.readFile(path.join(__dirname, '../email/member-added.html'), function (err, data) {
  if (err) {
    return console.log(err);
  }
  memberAddedHtmlContent = data
});

fs.readFile(path.join(__dirname, '../email/candidate-added.html'), function (err, data) {
  if (err) {
    return console.log(err);
  }
  candidateAddedHtmlContent = data
});

fs.readFile(path.join(__dirname, '../email/new-candidate.html'), function (err, data) {
  if (err) {
    return console.log(err);
  }
  candidateAddedHtmlContent = data
});

fs.readFile(path.join(__dirname, '../email/candidate-feedback.html'), function (err, data) {
  if (err) {
    return console.log(err);
  }
  feedbackHtmlContent = data
});

fs.readFile(path.join(__dirname, '../email/interview-cancelled.html'), function (err, data) {
  if (err) {
    return console.log(err);
  }
  interviewCancelledHtmlContent = data
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {});
});

/* GET home page. */
router.get('/projects', function(req, res, next) {
  mongoose.model('project').find({}, function(err, mongoResponse) {
  		console.log('Response: ' + JSON.stringify(mongoResponse));
		res.send(mongoResponse);
	});
});

router.post('/project', function(req, res, next) {
	var newProject = req.body;
  var Project = mongoose.model('project');
  var project = new Project(newProject);
  project.save(function(err) {
  	if (err) {
  		console.log(err.message);
  	}
  	res.end();
  })

});

/* GET all candidates. */
router.get('/project/:reqProjectId/candidates', function(req, res, next) {
  mongoose.model('project').findById(req.params.reqProjectId, "projectMembers projectCandidates", function(err, mongoResponse) {
		res.send(mongoResponse);
	});
});

// Saving new candidate
router.post('/project/:reqProjectId/candidate', function(req, res, next) {
	saveNewCandidate(req.params.reqProjectId, req.body, res, true);
});

function saveNewCandidate(projectId, newCandidate, res, sendEml) {
	var Project = mongoose.model('project');
	Project.findById(projectId, function(err, mongoResponse) {
		if (mongoResponse) {
			mongoResponse.projectCandidates.push(newCandidate);
			mongoResponse.save(function(err) {
		  	if (err) {
		  		console.log(err.message);
		  	}
		  	console.log('Saving');
		  	mongoResponse.projectMembers.forEach(function(member) {
			  	var emailModel = {
			  		userName: member.memberName,
			  		candidate: newCandidate.candidateName,
			  		project: mongoResponse.projectName
			  	};
			  	sendEmail(member.memberEmail, emailModel, candidateAddedHtmlContent);
			});
		  	res.end();
		  });
		} else {
			console.log('Unable to find record');
		}
	});
}

/* DELETE candidate. */
router.delete('/project/:reqProjectId/candidate/:reqCandidateId', function(req, res, next) {
  mongoose.model('project').findByIdAndUpdate(req.params.reqProjectId, {
  	'$pull': {
        'projectCandidates': { '_id': req.params.reqCandidateId }
    }
  }, function(err) {
  	if (err) {
  		console.log('Error: ' + err);
  	}
  	res.end();
  });
});

/* PUT candidate. */
router.put('/project/:reqProjectId/candidate/:reqCandidateId', function(req, res, next) {
  mongoose.model('project').findByIdAndUpdate(req.params.reqProjectId, {
  	'$pull': {
        'projectCandidates': { '_id': req.params.reqCandidateId }
    }
  }, function(err) {
  	if (err) {
  		console.log('Error: ' + err);
  	}
  	saveNewCandidate(req.params.reqProjectId, req.body, res, false);
  });
});


/* GET all members. */
router.get('/project/:reqProjectId/members', function(req, res, next) {
  mongoose.model('project').findById(req.params.reqProjectId, "projectMembers", function(err, mongoResponse) {
		res.send(mongoResponse);
	});
});

/* DELETE all members. */
router.delete('/project/:reqProjectId/member/:reqMemberId', function(req, res, next) {
  mongoose.model('project').findById(req.params.reqProjectId, function(err, mongoResponse) {
		mongoResponse.projectMembers.pull(req.params.reqMemberId);
		mongoResponse.save(function(err) {
	  	if (err) {
	  		console.log(err.message);
	  	}
	  	res.end();
	  });
	});
});

// Saving new member
router.post('/project/:reqProjectId/member', function(req, res, next) {
	var newMember = req.body,
			Project = mongoose.model('project');

	Project.findById(req.params.reqProjectId, function(err, mongoResponse) {
		if (mongoResponse) {
			mongoResponse.projectMembers.push(newMember);
			mongoResponse.save(function(err) {
		  	if (err) console.log(err.message);
		  	var emailModel = {
		  		userName: newMember.memberName,
		  		project: mongoResponse.projectName
		  	};
		  	sendEmail(newMember.memberEmail, emailModel, memberAddedHtmlContent);
		  	res.end();
		  });
		} else {
			console.log('Unable to find record');
		}
	});
});

/* GET all interviews. */
router.get('/project/:reqProjectId/candidate/:reqCandidateId', function(req, res, next) {
  mongoose.model('project').findById(req.params.reqProjectId, function(err, projectData) {
		var candidate = projectData.projectCandidates.filter(function(candidate) {
			return candidate._id == req.params.reqCandidateId;
		});
		res.send(candidate[0]);
	});
});

// Saving new interview
router.post('/project/:reqProjectId/candidate/:reqCandidateId/interview', function(req, res, next) {
	var project = mongoose.model('project');
	project.findById(req.params.reqProjectId, function(err, projectData) {
		var candidate = projectData.projectCandidates.filter(function(candidate) {
			return candidate._id == req.params.reqCandidateId;
		});
		candidate[0].candidateInterviews.push(req.body);
		projectData.save(function(err) {
	  	if (err) console.log(err.message);
	  	projectData.projectMembers.forEach(function(member) {
			  if (member._id == req.body.interviewerId) {
			  	var emailModel = {
			  		userName: member.memberName,
			  		time: req.body.interviewDate,
			  		person: candidate[0].candidateName
			  	};
			  	sendEmail(member.memberEmail, emailModel, interviewHtmlContent);
			  }
			});
	  	res.send(candidate[0].candidateInterviews);
	  });
	});
});

// Update interviews
router.put('/project/:reqProjectId/candidate/:reqCandidateId/interviews/:reqInterviewerId/:feedBack', function(req, res, next) {
	var project = mongoose.model('project');
	project.findById(req.params.reqProjectId, function(err, projectData) {
		var candidate = projectData.projectCandidates.filter(function(candidate) {
			return candidate._id == req.params.reqCandidateId;
		});
		var previousInterviews = candidate[0].candidateInterviews;
		candidate[0].candidateInterviews = req.body;
		projectData.save(function(err) {
	  	if (err) {
	  		console.log(err.message);
	  	}
	  	var feedbackMember = projectData.projectMembers.filter(function(projectMember) {
				return projectMember._id == req.params.reqInterviewerId;
			});
			var isFeedback = (req.params.feedBack === "true");
			console.log('Feedback: ' + isFeedback);
			if (feedbackMember && feedbackMember.length > 0 && isFeedback) {
				projectData.projectMembers.forEach(function(member) {
					if (member._id !== feedbackMember[0]._id) {
						var emailModel = {
				  		userName: member.memberName,
				  		memberName: feedbackMember[0].memberName,
				  		candidateName: candidate[0].candidateName
				  	};
				  	sendEmail(member.memberEmail, emailModel, feedbackHtmlContent);
					}
				});
			} else if(feedbackMember && feedbackMember.length > 0) {
					var emailModel = {
				  		userName: feedbackMember[0].memberName,
				  		person: candidate[0].candidateName
				  	};
			  	sendEmail(feedbackMember[0].memberEmail, emailModel, interviewCancelledHtmlContent);
			}
	  	res.send(candidate[0].candidateInterviews);
	  });
	});
});

function sendEmail(interviewerEmail, model, view) {
	var projectUrl = "https://interviewtracker.herokuapp.com/#/projects/";
	var emailContent = view.toString();
	for(key in model) {
		if (model.hasOwnProperty(key)) {
			emailContent = emailContent.replace("{" + key + "}", model[key]);
		}
	}
	emailContent = emailContent.replace("{LINK}", projectUrl);
	emailService.sendEmail(interviewerEmail, emailContent);
};

module.exports = router;

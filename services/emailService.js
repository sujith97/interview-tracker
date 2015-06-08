var nodemailer = require('nodemailer');

var emailService = function() {
	// create reusable transporter object using SMTP transport
	var transporter = nodemailer.createTransport({
	    service: 'Gmail',
	    auth: {
	        user: process.env.IT_EMAIL_ID,
	        pass: process.env.IT_EMAIL_PASSWORD
	    }
	});
	// setup e-mail data with unicode symbols
	var mailOptions = {
	    from: 'capco.interview.tracker@gmail.com', // sender address]
	    subject: 'Interview Tracker Notification'// Subject line
	};
	return {
		sendEmail: sendEmail
	}

	function sendEmail(receipients, htmlContent) {
		mailOptions.to = receipients;
		mailOptions.html = htmlContent;
		// send mail with defined transport object
		transporter.sendMail(mailOptions, function(error, info){
		    if(error){
		        return console.log(error);
		    }
		    console.log('Message sent: ' + info.response);
		});
	};

};

module.exports = emailService();
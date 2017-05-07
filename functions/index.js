var functions = require('firebase-functions');
const nodemailer = require('nodemailer');

const gmailEmail = encodeURIComponent(functions.config().gmail.email);
const gmailPassword = encodeURIComponent(functions.config().gmail.password);
const mailTransport = nodemailer.createTransport(
    `smtps://${gmailEmail}:${gmailPassword}@smtp.gmail.com`);

exports.sendOutInvites = functions.database
		.ref('event/{eventId}')
		.onWrite(event => {
			const post = event.data.val()
			const emails = post.guestEmailList
			const eventId = post.id
			const eventTime = post.dateTime
			const eventLocation = post.location
			const eventName = post.name
			const eventDescription = post.tagline
			const eventHostEmail = post.hostEmail
			var rsvpLink = "https://fir-logindemo-e7938.firebaseapp.com/test.html?eventId="+eventId 
			var message = "Event " + eventName + " is being hosted on "+ eventTime + " at " + eventLocation + " Dont forget to rsvp in the link below :)"
			//console.log(message)
			//console.log(emails)

		for(i in emails){
			var email = emails[i]
			console.log("sending emails to: ", email)
			rsvpLink = rsvpLink + "&guestEmail="+email
			sendEmail(email, eventHostEmail, eventName, message, rsvpLink)
			}
		});


function sendEmail(email, hostemail, eventname, message, rsvpLink) {
  const mailOptions = {
    from: "Party planners "+ hostemail,
    to: email
  };

  console.log(message , rsvpLink)
  mailOptions.subject = "You are invited to "+ eventname+" !" ;
  var htmlMsg = "<body>" + message + "<a href="+rsvpLink+">RSVP</a> </body>"
 mailOptions.html= htmlMsg
 return mailTransport.sendMail(mailOptions).then(() => {
    console.log('Invite sent to', email);
  });
}

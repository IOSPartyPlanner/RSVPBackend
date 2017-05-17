var functions = require('firebase-functions');
const nodemailer = require('nodemailer');

const gmailEmail = encodeURIComponent(functions.config().gmail.email);
const gmailPassword = encodeURIComponent(functions.config().gmail.password);
const mailTransport = nodemailer.createTransport(
    `smtps://${gmailEmail}:${gmailPassword}@smtp.gmail.com`);

exports.sendOutInvites = functions.database
		.ref('event/{eventId}')
		.onWrite(event => {
	      // Only edit data when it is first created.

	      // Exit when the data is deleted.
    	  if (!event.data.exists()) {
        	return;
      	  }
      		
			const post = event.data.val()
			const emails = post.guestEmailList
			const eventId = post.id
			const eventTime = post.dateTime
			const eventLocation = post.location
			const eventName = post.name
			const eventDescription = post.tagline
			const eventHostEmail = post.hostEmail
			var rsvpAppLink = "rsvp://?eventId="+eventId
			var rsvpLink = "https://fir-logindemo-e7938.firebaseapp.com/test.html?eventId="+eventId 
			var message = "Event " + eventName + " is being hosted on "+ eventTime + " at " + eventLocation + " Dont forget to rsvp in the link below :)"

    	  if (event.data.previous.exists()) {
//     	  const original = event.data.val();
//     	  const originalGuestList = original.guestEmailList;
// 		  const previous = event.data.previous.val();
// 		  const previousGuestList = previous.guestEmailList;
// 		 
// 		  console.log("Current data:", originalGuestList.length);
// 		  console.log("Previous data:", previousGuestList.length);
// 		  if (originalGuestList.length < previousGuestList.length){
// 		  	console.log("Email deletion");
// 		 	return;
// 		  } 	
// 		  const diffEmails = symmetricDifference(originalGuestList, previousGuestList);
// 		  if (diffEmails.length > 0){ 
//           	for(i in diffEmails){
// 				var email = diffEmails[i]
// 				console.log("sending emails to: ", email)
// 				rsvpLink = rsvpLink + "&guestEmail="+email+"&eventName="+eventName+"&eventLocation="+eventLocation+"&eventTime="+eventTime
// // 				rsvpAppLink = rsvpAppLink + "&guestEmail="+email+"&eventName="+eventName+"&eventLocation="+eventLocation+"&eventTime="+eventTime
// 				sendEmail(email, eventHostEmail, eventName, message, rsvpLink);//, rsvpAppLink)
// 			}
// 			return;
//           }		
			return;
      	}
		for(i in emails){
			var email = emails[i]
			console.log("sending emails to: ", email)
			rsvpLink = rsvpLink + "&guestEmail="+email+"&eventName="+eventName+"&eventLocation="+eventLocation+"&eventTime="+eventTime
// 			rsvpAppLink = rsvpAppLink + "&guestEmail="+email+"&eventName="+eventName+"&eventLocation="+eventLocation+"&eventTime="+eventTime
			sendEmail(email, eventHostEmail, eventName, message, rsvpLink);//, rsvpAppLink)
			}
		});


function symmetricDifference(a1, a2) {
  var result = [];
  for (var i = 0; i < a1.length; i++) {
    if (a2.indexOf(a1[i]) === -1) {
      result.push(a1[i]);
    }
  }
  for (i = 0; i < a2.length; i++) {
    if (a1.indexOf(a2[i]) === -1) {
      result.push(a2[i]);
    }
  }
  return result;
}
 
function sendEmail(email, hostemail, eventname, message, rsvpLink){//, rsvpAppLink) {
  const mailOptions = {
    from: "Party planners "+ hostemail,
    to: email
  };

  console.log(message , rsvpLink)
  mailOptions.subject = "You are invited to "+ eventname+" !" ;
//   var htmlMsg = "<body>" + message + "<br /><a href="+rsvpLink+" "+rsvpAppLink+">RSVP</a> </body>"
  var htmlMsg = "<body>" + message + "<br /><a href="+rsvpLink+">RSVP</a> </body>"
  mailOptions.html= htmlMsg
  return mailTransport.sendMail(mailOptions).then(() => {
    console.log('Invite sent to', email);
  });
}

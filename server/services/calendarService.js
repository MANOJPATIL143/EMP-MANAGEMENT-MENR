const { google } = require('googleapis');
const { OAuth2 } = google.auth;

const oauth2Client = new OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

oauth2Client.setCredentials({
  refresh_token: process.env.REFRESH_TOKEN,
});

const calendar = google.calendar('v3');

const addEventToCalendar = async (eventDetails) => {
  try {
    const event = {
      summary: eventDetails.summary,
      description: eventDetails.description,
      start: { dateTime: eventDetails.start, timeZone: 'UTC' },
      end: { dateTime: eventDetails.end, timeZone: 'UTC' },
      attendees: eventDetails.attendees,
    };

    const response = await calendar.events.insert({
      auth: oauth2Client,
      calendarId: 'primary',
      resource: event,
    });

    return response.data;
  } catch (err) {
    console.error('Error adding event:', err);
    throw err;
  }
};

module.exports = { addEventToCalendar };

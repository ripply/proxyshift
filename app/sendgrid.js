var config = require('config');
var helper = require('sendgrid').mail;
from_email = new helper.Email("test@example.com");
to_email = new helper.Email("test@example.com");
subject = "Hello World from the SendGrid Node.js Library";
content = new helper.Content("text/plain", "some text here");
mail = new helper.Mail(from_email, subject, to_email, content);

var apiKey;
if (config.has('sendgrid.api.key')) {
    apiKey = config.get('sendgrid.api.key');
}
var sg;
if (apiKey) {
    sg = require('sendgrid').SendGrid(apiKey);
}

var apiKeyExists = apiKey !== undefined;

module.exports = {
    ready: apiKeyExists,
    sendMail: function sendMailViaSendGrid(body, next) {
        var content = [];
        if (body.text) {
            content.push({
                "type": "text/plain",
                "value": body.text
            });
        }
        if (body.html) {
            content.push({
                "type": "text/html",
                "value": body.html
            });
        }

        var from = {
            "email": body.from,
        };
        if (body.fromName) {
            from.name = body.fromName;
        }

        var to = [];

        if (body.to) {
            if (body.to instanceof Array) {
                // shouldn't be happening
                slack.error(undefined, "Trying to send email to multiple recipients\n" + JSON.stringify(body));
                return next("Trying to send email to multiple recipients", {
                    response: 700
                });
            } else {
                if (body.toName !== undefined) {
                    to.push({
                        "email": body.to,
                        "name": body.toName
                    });
                } else {
                    to.push({
                        "email": body.to
                    });
                }
            }
        }

        var substitutions;
        if (body.substitutions !== undefined) {
            substitutions = body.substitutions;
        } else {
            substitutions = {};
        }

        var request = sg.emptyRequest();
        request.body = {
            "content": content,
            "from": from,
            "mail_settings": {
                "spam_check": {
                    "enable": true,
                    "post_to_url": "http://www.proxyshift.com/compliance",
                    "threshold": 3
                }
            },
            "personalizations": [
                {
                    "headers": {
                        "X-Accept-Language": "en",
                        "X-Mailer": "Proxyshift"
                    },
                    "subject": body.subject,
                    "to": to,
                    "substitutions": substitutions
                }
            ],
            "subject": body.subject,
        };

        if (body.template_id) {
            request.body.template_id = body.template_id;
        }

        request.method = 'POST';
        request.path = '/v3/mail/send';
        sg.API(request, function (response) {
            var err;
            if (response.statusCode !== 200) {
                err = response.body;
            }
            next(err, {
                response: response
            });
        });
    }
};

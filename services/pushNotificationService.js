const webpush = require('web-push');

async function sendPushNotification(subscription, body){
    const vapidKeys = {
        "publicKey": process.env.PUSH_TOKEN_PUBLIC_KEY,
        "privateKey": process.env.PUSH_TOKEN_PRIVATE_KEY
    };

    webpush.setVapidDetails(
        'http://localhost:4200',
        vapidKeys.publicKey,
        vapidKeys.privateKey
    );

    const notificationPayload = {
        "notification": {
            "title": "Cancelamento",
            "body": body,
            "icon": "../assets/darkThemeLogoNoBack.ico",
            "vibrate": [250, 150, 250],
            "data": {
                "primaryKey": 1
            },
            "actions": [{
                "action": "explore",
                "title": "Verificar cancelamento"
            }]
        }
    };
    webpush.sendNotification(
        JSON.parse(subscription), JSON.stringify(notificationPayload));
}

module.exports = {
    sendPushNotification: sendPushNotification
}
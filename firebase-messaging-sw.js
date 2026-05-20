importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js");

firebase.initializeApp({
apiKey: "AIzaSyDFKlaUyUt2cvvOfw2DWsNlFbBiKQZep58",
authDomain: "burapa-student-system.firebaseapp.com",
projectId: "burapa-student-system",
storageBucket: "burapa-student-system.firebasestorage.app",
messagingSenderId: "1036953943666",
appId: "1:1036953943666:web:db300edf1558e0316c0ceb"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload){

console.log(
"[firebase-messaging-sw.js] Background message ",
payload
);

self.registration.showNotification(
payload.notification.title,
{
body: payload.notification.body,
icon: "/burapa-logo.png"
}
);

});

self.addEventListener("notificationclick", function(event){

event.notification.close();

event.waitUntil(
clients.openWindow(
"https://burapaubon.github.io/burapa-student-system"
)
);

});

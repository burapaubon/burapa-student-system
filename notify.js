import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
getMessaging,
getToken
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging.js";

const firebaseConfig = {
apiKey: "AIzaSyDFKlaUyUt2cvvOfw2DWsNlFbBiKQZep58",
authDomain: "burapa-student-system.firebaseapp.com",
projectId: "burapa-student-system",
storageBucket: "burapa-student-system.firebasestorage.app",
messagingSenderId: "1036953943666",
appId: "1:1036953943666:web:db300edf1558e0316c0ceb",
measurementId: "G-L2C232CL06"
};

const API =
"https://script.google.com/macros/s/AKfycbyV4PNjlFskTfF0Ol6xrZdWpSCJm54bi33l0M66QpluNo8X6B7Js8LZRtuY7T05KsShoQ/exec";

const app = initializeApp(firebaseConfig);

const messaging = getMessaging(app);

export async function initNotification(){

if(!("Notification" in window)) return;

if(!("serviceWorker" in navigator)) return;

try{

const permission = await Notification.requestPermission();

if(permission !== "granted") return;

const registration = await navigator.serviceWorker.register(
"./firebase-messaging-sw.js"
);

const token = await getToken(messaging,{
vapidKey:"BLtFLsAOb_KbkA6CXk1tPfZtkn2MNz4tzAJqQDmzwjUSpbIr_TQsSM9pabZ08bn-1rCToLqjPy8FQvzGAca3RPs",
serviceWorkerRegistration: registration
});

if(!token){
console.log("ไม่พบ token");
return;
}

localStorage.setItem("fcm_token", token);

await fetch(API,{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
mode:"saveToken",
token:token
})
});

console.log("FCM READY");

}catch(err){

console.error("FCM ERROR:", err);

}

}

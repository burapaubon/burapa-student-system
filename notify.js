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

const app = initializeApp(firebaseConfig);

const messaging = getMessaging(app);

async function initNotification(){

try{

const permission = await Notification.requestPermission();

if(permission !== "granted"){
console.log("ไม่อนุญาตแจ้งเตือน");
return;
}

const registration = await navigator.serviceWorker.register(
"./firebase-messaging-sw.js"
);

const token = await getToken(messaging,{
vapidKey:"BLtFLsAOb_KbkA6CXk1tPfZtkn2MNz4tzAJqQDmzwjUSpbIr_TQsSM9pabZ08bn-1rCToLqjPy8FQvzGAca3RPs",
serviceWorkerRegistration: registration
});

console.log("TOKEN:", token);

localStorage.setItem("fcm_token", token);

alert("เปิดแจ้งเตือนสำเร็จ");

}catch(err){

console.error("FCM ERROR:", err);
alert("เปิดแจ้งเตือนไม่สำเร็จ");

}

}

window.addEventListener("load",()=>{

if(Notification.permission === "default"){

setTimeout(()=>{

const ok = confirm(
"📢 เปิดแจ้งเตือนระบบสถิตินักเรียนหรือไม่?"
);

if(ok){
initNotification();
}

},1200);

}

});

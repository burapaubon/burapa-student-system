const SESSION_LIMIT = 15 * 60 * 1000

const last = localStorage.getItem("last_active")

if(last){

const now = Date.now()

if(now - Number(last) > SESSION_LIMIT){

localStorage.removeItem("adminLogin")
localStorage.removeItem("last_active")

location.href="index.html"

}

}

function updateSession(){

localStorage.setItem("last_active", Date.now())

}

updateSession()

document.addEventListener("click", updateSession)
document.addEventListener("keydown", updateSession)
document.addEventListener("touchstart", updateSession)
document.addEventListener("input", updateSession)

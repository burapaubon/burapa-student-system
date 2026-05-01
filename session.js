const SESSION_LIMIT = 60 * 60 * 1000

const BUFFER = 5 * 60 * 1000

function checkSession(){

const last = localStorage.getItem("last_active")

if(!last) return

const now = Date.now()

if(now - Number(last) > SESSION_LIMIT + BUFFER){

localStorage.removeItem("adminLogin")
localStorage.removeItem("last_active")

location.href = "index.html"
}

}

function updateSession(){
localStorage.setItem("last_active", Date.now())
}

checkSession()
updateSession()

document.addEventListener("click", updateSession)
document.addEventListener("keydown", updateSession)
document.addEventListener("touchstart", updateSession)
document.addEventListener("input", updateSession)

document.addEventListener("visibilitychange", () => {
if (!document.hidden) {
updateSession()
checkSession()
}
})

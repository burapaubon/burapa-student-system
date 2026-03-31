document.addEventListener("DOMContentLoaded", ()=>{

document.querySelectorAll("button, .back").forEach(el=>{
  el.style.transition = "transform 0.1s ease";

  el.addEventListener("mousedown", ()=>{
    el.style.transform = "scale(0.96)";
  });

  el.addEventListener("mouseup", ()=>{
    el.style.transform = "scale(1)";
  });

  el.addEventListener("mouseleave", ()=>{
    el.style.transform = "scale(1)";
  });
});

document.querySelectorAll("button").forEach(el=>{

  el.style.position = "relative";
  el.style.overflow = "hidden";

  el.addEventListener("click", function(e){

    const ripple = document.createElement("span");

    const rect = el.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);

    ripple.style.width = ripple.style.height = size + "px";
    ripple.style.position = "absolute";
    ripple.style.borderRadius = "50%";
    ripple.style.background = "rgba(255,255,255,0.4)";
    ripple.style.left = (e.clientX - rect.left - size/2) + "px";
    ripple.style.top = (e.clientY - rect.top - size/2) + "px";
    ripple.style.pointerEvents = "none";
    ripple.style.transform = "scale(0)";
    ripple.style.transition = "transform 0.5s, opacity 0.5s";
    ripple.style.opacity = "1";

    el.appendChild(ripple);

    requestAnimationFrame(()=>{
      ripple.style.transform = "scale(2)";
      ripple.style.opacity = "0";
    });

    setTimeout(()=>{
      ripple.remove();
    },500);

  });

});

});

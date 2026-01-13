const iname = localStorage.getItem("info_name");
const iref = localStorage.getItem("info_ref");

localStorage.removeItem("info_name");
localStorage.removeItem("info_ref");

document.getElementById("title").innerText = iname;

document.getElementById("Name").innerText = iname;

const vid = document.getElementById("Ref");
vid.src = iref;
vid.load();
vid.play();

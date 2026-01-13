function clear_search(){
    const rt = document.getElementById("res_list");
    rt.innerHTML = "";
}

function find_word(word){
    if(word=="")
        return;

    fetch("lessons/testing.json")
    .then(res => res.json())
    .then(res => res.forEach(cword => {
        if(cword.name.includes(word)){
            const rt = document.getElementById("res_list");
            const ref = document.createElement("li");
            ref.innerText = cword.name;

            ref.addEventListener("click", function() {
                localStorage.setItem("info_name",cword.name);
                localStorage.setItem("info_ref",cword.ref);
                window.location.href = "KHKT-info.html";
            });
            
            rt.appendChild(ref);
        }
    }))
    .catch(error => console.error('Error fetching data:', error));
}

const searchin = document.getElementById("searchbar");

let debounceTimeout;

searchin.addEventListener("keydown", function(event){
    clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(() => {
            clear_search();
            find_word(this.value);
        }, 300); 
})
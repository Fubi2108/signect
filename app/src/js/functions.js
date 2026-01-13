let score = 0;
let first;

function get_rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function click_correct(id) {
    const btn = document.getElementById(id);
    btn.style.backgroundColor = "#4CAF50";
    btn.style.color = "white";
    btn.innerHTML = '<span class="material-symbols-outlined">check_circle</span> Chính xác!';
    btn.classList.add("pulse");

    if (first) {
        score++;
        localStorage.setItem("score", score);
    }
}

function click_wrong(id) {
    const btn = document.getElementById(id);
    btn.style.backgroundColor = "#f44336";
    btn.style.color = "white";
    btn.innerHTML = '<span class="material-symbols-outlined">cancel</span> Thử lại nhé!';

    // Rung nút khi chọn sai
    btn.animate([
        { transform: 'translateX(0)' },
        { transform: 'translateX(-10px)' },
        { transform: 'translateX(10px)' },
        { transform: 'translateX(-10px)' },
        { transform: 'translateX(0)' }
    ], { duration: 300 });

    first = false;
}

function add_ref(id, reflink) {
    if (document.getElementById("iframe_ref")) {
        document.getElementById("iframe_ref").src = reflink;
        return;
    }
    const ref = document.createElement("iframe");
    ref.id = "iframe_ref";
    ref.src = reflink;
    document.getElementById(id).appendChild(ref);
}

function keep_score() {
    if (localStorage.getItem("score"))
        document.getElementById("score_board").innerText = localStorage.getItem("score");
    else
        document.getElementById("score_board").innerText = "0";

    first = true;

    if (score == 1) {
        document.getElementById("pop").className = "popup_open";
    }
}

function generate_question(my_file) {
    keep_score();

    let file = "lessons/" + my_file;
    fetch(file)
        .then(res => res.json())
        .then(res => {
            let pk = [];
            let a;
            let k;

            while (pk.length < 4) {
                a = get_rand(0, res.length - 1);
                k = true;
                for (let i = 0; i < pk.length; i++) {
                    if (a == pk[i]) {
                        k = false;
                    }
                }

                if (k) {
                    pk.push(a);
                }
            }

            a = get_rand(0, 3);

            add_ref("ref", res[pk[a]].ref)

            for (let i = 0; i < 4; i++) {
                document.getElementById("b" + (i + 1)).innerText = res[pk[i]].name;

                if (i == a) {
                    document.getElementById("b" + (i + 1)).onclick = function () {
                        click_correct('b' + (i + 1));
                    }
                }
                else {
                    document.getElementById("b" + (i + 1)).onclick = function () {
                        click_wrong("b" + (i + 1));
                    }
                }
            }
        })
        .catch(error => console.error('Error </3:', error));
}

function go_home() {
    localStorage.clear();
    score = 0;
}
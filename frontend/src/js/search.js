const allWords = [
    // Topic 1
    { "name": "chào", "ref": "public/lessons/topic_1_ref/chao.mp4", "topicId": "1" },
    { "name": "gặp", "ref": "public/lessons/topic_1_ref/gap.mp4", "topicId": "1" },
    { "name": "hẹn gặp lại", "ref": "public/lessons/topic_1_ref/hengaplai.mp4", "topicId": "1" },
    { "name": "sống", "ref": "public/lessons/topic_1_ref/song.mp4", "topicId": "1" },
    { "name": "tạm biệt", "ref": "public/lessons/topic_1_ref/tambiet.mp4", "topicId": "1" },
    { "name": "tên", "ref": "public/lessons/topic_1_ref/ten.mp4", "topicId": "1" },
    { "name": "tuổi", "ref": "public/lessons/topic_1_ref/tuoi.mp4", "topicId": "1" },
    { "name": "rất vui được gặp bạn", "ref": "public/lessons/topic_1_ref/vuigapban.mp4", "topicId": "1" },
    { "name": "xin lỗi", "ref": "public/lessons/topic_1_ref/xinloi.mp4", "topicId": "1" },

    // Topic 2
    { "name": "cha", "ref": "public/lessons/topic_2_ref/cha.mp4", "topicId": "2" },
    { "name": "con", "ref": "public/lessons/topic_2_ref/com.mp4", "topicId": "2" },
    { "name": "con gái", "ref": "public/lessons/topic_2_ref/congai.mp4", "topicId": "2" },
    { "name": "con trai", "ref": "public/lessons/topic_2_ref/contrai.mp4", "topicId": "2" },
    { "name": "gia đình", "ref": "public/lessons/topic_2_ref/giadinh.mp4", "topicId": "2" },
    { "name": "mẹ", "ref": "public/lessons/topic_2_ref/me.mp4", "topicId": "2" },
    { "name": "nhà", "ref": "public/lessons/topic_2_ref/nha.mp4", "topicId": "2" },

    // Topic 3
    { "name": "ăn", "ref": "public/lessons/topic_3_ref/an.mp4", "topicId": "3" },
    { "name": "bánh mì", "ref": "public/lessons/topic_3_ref/banhmi.mp4", "topicId": "3" },
    { "name": "khát nước", "ref": "public/lessons/topic_3_ref/khat.mp4", "topicId": "3" },
    { "name": "nước", "ref": "public/lessons/topic_3_ref/nuoc.mp4", "topicId": "3" },
    { "name": "súp", "ref": "public/lessons/topic_3_ref/sup.mp4", "topicId": "3" },
    { "name": "trà", "ref": "public/lessons/topic_3_ref/tra.mp4", "topicId": "3" },
    { "name": "uống", "ref": "public/lessons/topic_3_ref/uong.mp4", "topicId": "3" }
];

console.log("Loaded " + allWords.length + " words.");

// Helper function to remove accents for easier searching
function removeAccents(str) {
    return str.normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd').replace(/Đ/g, 'D');
}

function clear_search() {
    const rt = document.getElementById("res_list");
    rt.innerHTML = "";
    rt.style.display = "none";
}

function find_word(word) {
    if (!word || word.trim() === "") {
        clear_search();
        return;
    }

    const searchTerm = removeAccents(word.toLowerCase().trim());
    const rt = document.getElementById("res_list");
    rt.innerHTML = "";

    // Filter words - case insensitive AND accent insensitive
    const matches = allWords.filter(item => {
        if (!item.name) return false;
        const normalizedItemName = removeAccents(item.name.toLowerCase());
        return normalizedItemName.includes(searchTerm);
    });

    if (matches.length > 0) {
        matches.forEach(cword => {
            const li = document.createElement("li");
            li.innerText = cword.name; // Display original name with accents
            li.className = "suggestion-item";

            li.addEventListener("click", function () {
                // Navigate to lesson view with topic and specific video
                window.location.href = `KHKT-lesson-view.html?topic=${cword.topicId}&video=${encodeURIComponent(cword.name)}`;
            });
            rt.appendChild(li);
        });
    } else {
        const li = document.createElement("li");
        li.innerText = "Từ này chưa có, chúng mình sẽ cập nhật sau nhé";
        li.className = "no-result-item";
        rt.appendChild(li);
    }

    rt.style.display = "block";
}

const searchin = document.getElementById("searchbar");
let debounceTimeout;

searchin.addEventListener("input", function (event) {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
        find_word(this.value);
    }, 300);
});

// Hide suggestions when clicking outside
document.addEventListener('click', function (event) {
    const searchContainer = document.querySelector('.search-container');
    // If the click is NOT inside the search container, hide results
    if (searchContainer && !searchContainer.contains(event.target)) {
        clear_search();
    }
});
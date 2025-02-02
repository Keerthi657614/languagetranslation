const dropdowns = document.querySelectorAll(".dropdown-container"),
      inputLanguageDropdown = document.querySelector("#input-language"),
      outputLanguageDropdown = document.querySelector("#output-language"),
      inputLanguageSearch = inputLanguageDropdown.querySelector(".dropdown-search"),
      outputLanguageSearch = outputLanguageDropdown.querySelector(".dropdown-search");

function populateDropdown(dropdown, options) {
    dropdown.querySelector("ul").innerHTML = "";
    options.forEach((option) => {
        const li = document.createElement("li");
        const title = `${option.name} (${option.native})`;
        li.innerHTML = title;
        li.dataset.value = option.code;
        li.classList.add("option");
        dropdown.querySelector("ul").appendChild(li);
    });
}

populateDropdown(inputLanguageDropdown, languages);
populateDropdown(outputLanguageDropdown, languages);

dropdowns.forEach((dropdown) => {
    dropdown.addEventListener("click", () => {
        dropdown.classList.toggle("active");
    });

    dropdown.querySelectorAll(".option").forEach((item) => {
        item.addEventListener("click", (e) => {
            dropdown.querySelectorAll(".option").forEach((item) => {
                item.classList.remove("active");
            });
            item.classList.add("active");
            const selected = dropdown.querySelector(".selected");
            selected.innerHTML = item.innerHTML;
            selected.dataset.value = item.dataset.value;
            translate();
        });
    });
});

document.addEventListener("click", (e) => {
    dropdowns.forEach((dropdown) => {
        if (!dropdown.contains(e.target)) {
            dropdown.classList.remove("active");
        }
    });
});

// Filter languages based on search input
function filterLanguages(dropdown, searchQuery) {
    const options = dropdown.querySelectorAll(".option");
    options.forEach((option) => {
        if (option.innerText.toLowerCase().includes(searchQuery.toLowerCase())) {
            option.style.display = "";
        } else {
            option.style.display = "none";
        }
    });
}

inputLanguageSearch.addEventListener("input", (e) => {
    filterLanguages(inputLanguageDropdown, e.target.value);
});

outputLanguageSearch.addEventListener("input", (e) => {
    filterLanguages(outputLanguageDropdown, e.target.value);
});

const swapBtn = document.querySelector(".swap-position"),
      inputLanguage = inputLanguageDropdown.querySelector(".selected"),
      outputLanguage = outputLanguageDropdown.querySelector(".selected"),
      inputTextElem = document.querySelector("#input-text"),
      outputTextElem = document.querySelector("#output-text");

swapBtn.addEventListener("click", () => {
    const temp = inputLanguage.innerHTML;
    inputLanguage.innerHTML = outputLanguage.innerHTML;
    outputLanguage.innerHTML = temp;

    const tempValue = inputLanguage.dataset.value;
    inputLanguage.dataset.value = outputLanguage.dataset.value;
    outputLanguage.dataset.value = tempValue;

    const tempInputText = inputTextElem.value;
    inputTextElem.value = outputTextElem.value;
    outputTextElem.value = tempInputText;

    translate();
});

function translate() {
    const inputText = inputTextElem.value;
    const inputLanguage = inputLanguageDropdown.querySelector(".selected").dataset.value;
    const outputLanguage = outputLanguageDropdown.querySelector(".selected").dataset.value;
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${inputLanguage}&tl=${outputLanguage}&dt=t&q=${encodeURI(inputText)}`;
    
    fetch(url)
        .then((response) => response.json())
        .then((json) => {
            outputTextElem.value = json[0].map((item) => item[0]).join("");
        })
        .catch((error) => {
            console.log(error);
        });
}

inputTextElem.addEventListener("input", () => {
    if (inputTextElem.value.length > 5000) {
        inputTextElem.value = inputTextElem.value.slice(0, 5000);
    }
    translate();
});

const uploadDocument = document.querySelector("#upload-document"),
      uploadTitle = document.querySelector("#upload-title");

uploadDocument.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (
        file.type === "application/pdf" ||
        file.type === "text/plain" ||
        file.type === "application/msword" ||
        file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
        uploadTitle.innerHTML = file.name;
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = (e) => {
            inputTextElem.value = e.target.result;
            translate();
        };
    } else {
        alert("Please upload a valid file");
    }
});

const downloadBtn = document.querySelector("#download-btn");

downloadBtn.addEventListener("click", () => {
    const outputText = outputTextElem.value;
    const outputLanguage = outputLanguageDropdown.querySelector(".selected").dataset.value;
    if (outputText) {
        const blob = new Blob([outputText], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.download = `translated-to-${outputLanguage}.txt`;
        a.href = url;
        a.click();
    }
});

const darkModeCheckbox = document.getElementById("dark-mode-btn");

darkModeCheckbox.addEventListener("change", () => {
    document.body.classList.toggle("dark");
});

const inputChars = document.querySelector("#input-chars");

inputTextElem.addEventListener("input", () => {
    inputChars.innerHTML = inputTextElem.value.length;
});

const micBtn = document.querySelector("#mic-btn");
micBtn.addEventListener("click", () => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = inputLanguage.dataset.value;
    recognition.interimResults = false;

    recognition.start();

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        inputTextElem.value = transcript;
        translate();
    };

    recognition.onerror = (event) => {
        console.error("Speech recognition error: ", event.error);
    };
});

const speakBtn = document.querySelector("#speak-btn");

speakBtn.addEventListener("click", () => {
    const utterance = new SpeechSynthesisUtterance(outputTextElem.value);
    utterance.lang = outputLanguage.dataset.value;
    speechSynthesis.speak(utterance);
});

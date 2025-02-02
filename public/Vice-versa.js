const textarea = document.querySelector("textarea"),
  voicelist = document.querySelector("#voice-select"),
  speechbtn = document.querySelector("#convert-btn"),
  searchInput = document.querySelector("#voice-search"),
  resetbtn = document.getElementById("reset");

let synth = speechSynthesis;
let isSpeaking = true;

voiceSpeech();

function voiceSpeech() {
  // Clear previous options
  voicelist.innerHTML = "";

  for (let voice of synth.getVoices()) {
    let selected = voice.name === "Google US English" ? "selected" : "";
    let option = `<option value="${voice.name}" ${selected}>${voice.name} (${voice.lang})</option>`;
    voicelist.insertAdjacentHTML("beforeend", option);
  }
}

synth.addEventListener("voiceschanged", voiceSpeech);

// Search functionality for filtering voices
searchInput.addEventListener("input", () => {
  const query = searchInput.value.toLowerCase();
  const voices = synth.getVoices();

  // Clear existing options
  voicelist.innerHTML = "";

  // Filter voices based on search query
  voices
    .filter(voice => voice.name.toLowerCase().includes(query) || voice.lang.toLowerCase().includes(query))
    .forEach(voice => {
      let option = `<option value="${voice.name}">${voice.name} (${voice.lang})</option>`;
      voicelist.insertAdjacentHTML("beforeend", option);
    });
});

function textToSpeech(text) {
  let utterance = new SpeechSynthesisUtterance(text);
  for (let voice of synth.getVoices()) {
    if (voice.name === voicelist.value) {
      utterance.voice = voice;
    }
  }
  synth.speak(utterance);
}

speechbtn.addEventListener("click", (event) => {
  event.preventDefault();
  if (textarea.value !== "") {
    if (!synth.speaking) {
      synth.cancel();
      setTimeout(() => {
        textToSpeech(textarea.value);
      }, 500);
    }
    if (textarea.value.length > 80) {
      setInterval(() => {
        if (!synth.speaking && !isSpeaking) {
          isSpeaking = true;
          speechbtn.innerText = "Convert To Speech";
        }
      }, 500);
      if (isSpeaking) {
        synth.resume();
        isSpeaking = false;
        speechbtn.innerText = "Pause Speech";
        resetbtn.style.display = "none";
      } else {
        synth.pause();
        isSpeaking = true;
        speechbtn.innerText = "Resume Speech";
        resetbtn.style.display = "flex";
      }
    } else {
      speechbtn.innerText = "Convert To Speech";
    }
  }
});

resetbtn.addEventListener("click", (event) => {
  event.preventDefault();
  resetEverything();
});

function resetEverything() {
  synth.cancel();
  isSpeaking = true;

  textarea.value = "";
  speechbtn.innerText = "Convert To Speech";
  resetbtn.style.display = "none";
  searchInput.value = "";
  voiceSpeech();
}

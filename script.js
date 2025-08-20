let textInput = document.getElementById("textInput");
let charCount = document.getElementById("charCount");

textInput.addEventListener("input", function() {
  charCount.textContent = textInput.value.length;
});
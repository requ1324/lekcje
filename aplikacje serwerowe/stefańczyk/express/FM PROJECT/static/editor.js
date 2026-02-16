document.addEventListener("DOMContentLoaded", () => {
  const textarea = document.getElementById("editor");
  const lineNumbers = document.getElementById("lineNumbers");
  const bgInput = document.getElementById("bgColor");
  const fontInput = document.getElementById("fontSize");
  const saveBtn = document.getElementById("saveSettings");

  function updateLineNumbers() {
    const lines = textarea.value.split("\n").length;
    lineNumbers.innerHTML = "";
    for (let i = 1; i <= lines; i++) {
      const div = document.createElement("div");
      div.className = "line-number";
      div.textContent = i;
      lineNumbers.appendChild(div);
    }
  }

  textarea.addEventListener("input", updateLineNumbers);
  textarea.addEventListener("scroll", () => {
    lineNumbers.scrollTop = textarea.scrollTop;
  });

  updateLineNumbers();

  // ODCZYT
  fetch("/api/editor-config")
    .then((res) => res.json())
    .then((config) => {
      textarea.style.backgroundColor = config.backgroundColor;
      textarea.style.fontSize = config.fontSize + "px";
      bgInput.value = config.backgroundColor;
      fontInput.value = config.fontSize;
    });

  // LIVE PREVIEW
  bgInput.addEventListener("input", (e) => {
    textarea.style.backgroundColor = e.target.value;
  });

  fontInput.addEventListener("input", (e) => {
    textarea.style.fontSize = e.target.value + "px";
  });

  // ZAPIS
  saveBtn.addEventListener("click", () => {
    fetch("/api/editor-config", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        backgroundColor: bgInput.value,
        fontSize: fontInput.value,
      }),
    });
  });
});

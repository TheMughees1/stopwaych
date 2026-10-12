const display = document.getElementById("display");
let justCalculated = false;

function appendToDisplay(value) {
  if (display.value === "Error" || justCalculated) {
    if (/[0-9.(]/.test(value)) display.value = "";
    justCalculated = false;
  }
  display.value += value;
}

function clearDisplay() {
  display.value = "";
  justCalculated = false;
}

function deleteLast() {
  if (display.value === "Error") return clearDisplay();
  display.value = display.value.slice(0, -1);
  justCalculated = false;
}

function calculateResult() {
  const expression = display.value.trim();
  if (!expression) return;
  // Only arithmetic characters are accepted; no names, properties, or executable code.
  if (!/^[0-9+*/().%\s-]+$/.test(expression)) {
    display.value = "Error";
    return;
  }
  try {
    const normalized = expression.replace(/(\d+(?:\.\d+)?)%/g, "($1/100)");
    const result = Function('"use strict"; return (' + normalized + ')')();
    if (typeof result !== "number" || !Number.isFinite(result)) throw new Error("Invalid result");
    display.value = String(Number(result.toPrecision(12)));
    justCalculated = true;
  } catch {
    display.value = "Error";
    justCalculated = false;
  }
}

document.addEventListener("keydown", (event) => {
  if (/^[0-9.+*/()%\-]$/.test(event.key)) appendToDisplay(event.key);
  else if (event.key === "Enter" || event.key === "=") { event.preventDefault(); calculateResult(); }
  else if (event.key === "Backspace") deleteLast();
  else if (event.key === "Escape") clearDisplay();
});

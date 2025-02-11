// Theme switcher functionality with localStorage support
const toggleSwitch = document.querySelector(
  '.theme-switch input[type="checkbox"]'
);
const currentTheme = localStorage.getItem("theme");

// Check if there's a saved theme preference
if (currentTheme) {
  document.body.classList.add(currentTheme);
  if (currentTheme === "dark-mode") {
    toggleSwitch.checked = true;
  }
}

// Theme switching function
function switchTheme(e) {
  if (e.target.checked) {
    document.body.classList.remove("light-mode");
    document.body.classList.add("dark-mode");
    localStorage.setItem("theme", "dark-mode");
  } else {
    document.body.classList.remove("dark-mode");
    document.body.classList.add("light-mode");
    localStorage.setItem("theme", "light-mode");
  }
}

toggleSwitch.addEventListener("change", switchTheme, false);

// Calculator Mode 1
function calculateMode1() {
  const waveFrequency = parseFloat(
    document.getElementById("waveFrequency1").value
  );

  if (isNaN(waveFrequency) || waveFrequency <= 0) {
    alert("Please enter a valid frequency value greater than 0");
    return;
  }

  const timeDelay = 1 / (2 * waveFrequency);
  let clocks = Math.round((timeDelay * 1000000) / 1.085);

  if (clocks % 2 !== 0) {
    clocks++;
  }

  const B = 65536 - clocks;
  const THDecimal = Math.floor(B / 256);
  const TLDecimal = B % 256;

  const THHexString = THDecimal.toString(16).toUpperCase().padStart(2, "0");
  const TLHexString = TLDecimal.toString(16).toUpperCase().padStart(2, "0");

  document.getElementById("THValue1").textContent = THHexString + "H";
  document.getElementById("TLValue1").textContent = TLHexString + "H";
}

// Calculator Mode 2
function calculateMode2() {
  const waveFrequency = parseFloat(
    document.getElementById("waveFrequency1").value
  );

  if (isNaN(waveFrequency) || waveFrequency <= 0) {
    alert("Please enter a valid frequency value greater than 0");
    return;
  }

  const XTAL = 11.0592e6;
  const T = 1 / waveFrequency;
  const halfperiodMicro = T / 2;
  const counts = Math.floor(halfperiodMicro / 0.000001085);
  const TH = 256 - counts;
  const hexTH = TH.toString(16).toUpperCase().padStart(2, "0");

  document.getElementById("THValue1").textContent = hexTH + "H";
  document.getElementById("TLValue1").textContent = "";
}

// Reverse Calculator Mode 1
function reverseCalculateMode1() {
  const THHexString = document
    .getElementById("THValue3")
    .value.replace("H", "");
  const TLHexString = document
    .getElementById("TLValue3")
    .value.replace("H", "");

  if (!isValidHex(THHexString) || !isValidHex(TLHexString)) {
    alert("Please enter valid hexadecimal values (00-FF)");
    return;
  }

  const THDecimal = parseInt(THHexString, 16);
  const TLDecimal = parseInt(TLHexString, 16);

  const B = THDecimal * 256 + TLDecimal;
  const clocks = 65536 - B;
  const timeDelay = (clocks * 1.085) / 1000000;
  const waveFrequency = 1 / (2 * timeDelay);

  document.getElementById("timeDelay3").textContent =
    timeDelay.toFixed(6) + " s";
  document.getElementById("waveFrequency3").textContent =
    waveFrequency.toFixed(2) + " Hz";
}

// Reverse Calculator Mode 2
function reverseCalculateMode2() {
  const THHexString = document
    .getElementById("THValue3")
    .value.replace("H", "");

  if (!isValidHex(THHexString)) {
    alert("Please enter a valid hexadecimal value for TH (00-FF)");
    return;
  }

  const THDecimal = parseInt(THHexString, 16);
  const clocks = 256 - THDecimal;
  const timeDelay = (clocks * 1.085) / 1000000;
  const waveFrequency = 1 / (2 * timeDelay);

  document.getElementById("timeDelay3").textContent =
    timeDelay.toFixed(6) + " s";
  document.getElementById("waveFrequency3").textContent =
    waveFrequency.toFixed(2) + " Hz";
}

// TMOD Calculator
function calculateTMOD() {
  const tmodValue = document.getElementById("tmodValue").value;

  if (!isValidHex(tmodValue)) {
    alert("Please enter a valid hexadecimal value (00-FF)");
    return;
  }

  const binaryEquivalent = parseInt(tmodValue, 16).toString(2).padStart(8, "0");
  const bitNames = [
    "Gate Timer1 (GATE1)",
    "C/T Timer1 (C/T1)",
    "Mode1 Timer1 (M1)",
    "Mode0 Timer1 (M0)",
    "Gate Timer0 (GATE0)",
    "C/T Timer0 (C/T0)",
    "Mode1 Timer0 (M1)",
    "Mode0 Timer0 (M0)",
  ];

  const mode1Timer1 = binaryEquivalent[4] === "1" ? "mode 1 of Timer 1 " : "";
  const mode1Timer0 = binaryEquivalent[0] === "1" ? "mode 1 of Timer 0 " : "";
  const mode2Timer1 = binaryEquivalent[5] === "1" ? "mode 2 of Timer 1 " : "";
  const mode2Timer0 = binaryEquivalent[1] === "1" ? "mode 2 of Timer 0 " : "";

  const timerModeDescription =
    mode1Timer1 + mode1Timer0 + mode2Timer1 + mode2Timer0;

  document.getElementById(
    "tmodDescription"
  ).textContent = `For TMOD = 0x${tmodValue.toUpperCase()}, ${timerModeDescription}is selected.`;

  let output = "<pre>TMOD Register (8 bits)\n\n";
  output += "7   6   5   4   3   2   1   0\n";
  output += "+---+---+---+---+---+---+---+\n";
  for (let i = 0; i < 8; i++) {
    output += `|   ${bitNames[i].padEnd(19)} `;
    output += binaryEquivalent[i] === "1" ? "| 1 |\n" : "| 0 |\n";
  }
  output += "+---+---+---+---+---+---+---+</pre>";
  document.getElementById("binaryOutput").innerHTML = output;
}

// Helper function to validate hexadecimal input
function isValidHex(hex) {
  return /^[0-9A-Fa-f]{1,2}$/.test(hex);
}

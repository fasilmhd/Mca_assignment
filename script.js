"use strict";

/* ---------- Helpers ---------- */

function showResult(outputId, label, value) {
  const box = document.getElementById(outputId);
  box.textContent = "";

  const labelEl = document.createElement("span");
  labelEl.className = "label";
  labelEl.textContent = label;

  const valueEl = document.createElement("span");
  valueEl.className = "value";
  valueEl.textContent = value;

  box.appendChild(labelEl);
  box.appendChild(valueEl);
}

function showError(outputId, message) {
  const box = document.getElementById(outputId);
  box.textContent = "";
  const err = document.createElement("span");
  err.className = "error";
  err.textContent = message;
  box.appendChild(err);
}

function quote(s) {
  return '"' + s + '"';
}

/* ---------- String functions ---------- */

function handleString(action) {
  const out = "stringOutput";
  const text = document.getElementById("mainText").value;
  const word = document.getElementById("wordInput").value;
  const replacement = document.getElementById("replaceInput").value;
  const startRaw = document.getElementById("startIndex").value;
  const endRaw = document.getElementById("endIndex").value;
  const start = startRaw === "" ? 0 : parseInt(startRaw, 10);
  const end = endRaw === "" ? undefined : parseInt(endRaw, 10);

  if (text === "") {
    showError(out, "Please enter some text first.");
    return;
  }

  const needsWord = ["firstOccurrence", "lastOccurrence", "search", "replaceFirst", "replaceAll"];
  if (needsWord.includes(action) && word === "") {
    showError(out, "Please enter a word in the 'Word to find' field.");
    return;
  }

  switch (action) {
    case "length":
      showResult(out, "text.length", text.length + " characters");
      break;

    case "firstOccurrence": {
      const i = text.indexOf(word);
      showResult(out, "text.indexOf(" + quote(word) + ")",
        i === -1 ? "Not found (-1)" : "First occurrence at index " + i);
      break;
    }

    case "lastOccurrence": {
      const i = text.lastIndexOf(word);
      showResult(out, "text.lastIndexOf(" + quote(word) + ")",
        i === -1 ? "Not found (-1)" : "Last occurrence at index " + i);
      break;
    }

    case "search": {
      const i = text.search(word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
      const count = text.split(word).length - 1;
      showResult(out, "text.search(" + quote(word) + ")",
        i === -1 ? "Word not found" : "Found at index " + i + " (appears " + count + " time" + (count === 1 ? "" : "s") + ")");
      break;
    }

    case "slice":
      showResult(out, "text.slice(" + start + (end !== undefined ? ", " + end : "") + ")",
        quote(text.slice(start, end)));
      break;

    case "substring":
      showResult(out, "text.substring(" + start + (end !== undefined ? ", " + end : "") + ")",
        quote(text.substring(start, end)));
      break;

    case "substr":
      // substr(start, length) - the second value is a LENGTH, not an end index
      showResult(out, "text.substr(" + start + (end !== undefined ? ", " + end : "") + ")",
        quote(text.substr(start, end)));
      break;

    case "replaceFirst":
      showResult(out, "text.replace(" + quote(word) + ", " + quote(replacement) + ")",
        text.replace(word, replacement));
      break;

    case "replaceAll":
      showResult(out, "text.replaceAll(" + quote(word) + ", " + quote(replacement) + ")",
        text.split(word).join(replacement));
      break;

    case "upper":
      showResult(out, "text.toUpperCase()", text.toUpperCase());
      break;

    case "lower":
      showResult(out, "text.toLowerCase()", text.toLowerCase());
      break;
  }
}

/* ---------- Math functions ---------- */

function handleMath(action) {
  const out = "mathOutput";
  const aRaw = document.getElementById("numA").value;
  const bRaw = document.getElementById("numB").value;
  const a = parseFloat(aRaw);
  const b = parseFloat(bRaw);

  const needsA = ["power", "sqrt", "round", "ceil", "floor", "abs", "sin", "cos"];
  if (needsA.includes(action) && isNaN(a)) {
    showError(out, "Please enter a valid Number A.");
    return;
  }

  switch (action) {
    case "power":
      if (isNaN(b)) {
        showError(out, "Please enter a valid Number B (the exponent).");
        return;
      }
      showResult(out, "Math.pow(" + a + ", " + b + ")", Math.pow(a, b));
      break;

    case "sqrt":
      if (a < 0) {
        showError(out, "Square root of a negative number is not a real number (NaN).");
        return;
      }
      showResult(out, "Math.sqrt(" + a + ")", Math.sqrt(a));
      break;

    case "round":
      showResult(out, "Math.round(" + a + ")", Math.round(a));
      break;

    case "ceil":
      showResult(out, "Math.ceil(" + a + ")", Math.ceil(a));
      break;

    case "floor":
      showResult(out, "Math.floor(" + a + ")", Math.floor(a));
      break;

    case "abs":
      showResult(out, "Math.abs(" + a + ")", Math.abs(a));
      break;

    case "sin": {
      const rad = a * Math.PI / 180;
      showResult(out, "Math.sin(" + a + "°)", Number(Math.sin(rad).toFixed(6)));
      break;
    }

    case "cos": {
      const rad = a * Math.PI / 180;
      showResult(out, "Math.cos(" + a + "°)", Number(Math.cos(rad).toFixed(6)));
      break;
    }

    case "min":
    case "max": {
      const list = document.getElementById("numList").value
        .split(",")
        .map(function (s) { return s.trim(); })
        .filter(function (s) { return s !== ""; })
        .map(Number);

      if (list.length === 0 || list.some(isNaN)) {
        showError(out, "Please enter valid numbers separated by commas.");
        return;
      }
      const fn = action === "min" ? Math.min : Math.max;
      const name = action === "min" ? "Math.min" : "Math.max";
      showResult(out, name + "(" + list.join(", ") + ")", fn.apply(null, list));
      break;
    }

    case "random": {
      let lo = parseInt(document.getElementById("randMin").value, 10);
      let hi = parseInt(document.getElementById("randMax").value, 10);
      if (isNaN(lo) || isNaN(hi)) {
        showError(out, "Please enter valid random min and max values.");
        return;
      }
      if (lo > hi) {
        const t = lo; lo = hi; hi = t;
      }
      const r = Math.floor(Math.random() * (hi - lo + 1)) + lo;
      showResult(out, "Random integer between " + lo + " and " + hi, r);
      break;
    }
  }
}

/* ---------- Wire up buttons ---------- */

document.querySelectorAll("#string-section button").forEach(function (btn) {
  btn.addEventListener("click", function () {
    handleString(btn.dataset.action);
  });
});

document.querySelectorAll("#math-section button").forEach(function (btn) {
  btn.addEventListener("click", function () {
    handleMath(btn.dataset.action);
  });
});

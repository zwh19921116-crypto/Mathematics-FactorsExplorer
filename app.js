function factorsOf(n) {
  const factors = [];
  const limit = Math.floor(Math.sqrt(n));

  for (let i = 1; i <= limit; i += 1) {
    if (n % i === 0) {
      factors.push(i);
      if (i !== n / i) {
        factors.push(n / i);
      }
    }
  }

  return factors.sort((a, b) => a - b);
}

function gcd(a, b) {
  let x = Math.abs(a);
  let y = Math.abs(b);

  while (y !== 0) {
    const t = y;
    y = x % y;
    x = t;
  }

  return x;
}

function lcm(a, b) {
  return Math.abs(a * b) / gcd(a, b);
}

function primeFactorization(n) {
  const factors = [];
  let value = n;
  let divisor = 2;

  while (value > 1 && divisor * divisor <= value) {
    while (value % divisor === 0) {
      factors.push(divisor);
      value /= divisor;
    }
    divisor += 1;
  }

  if (value > 1) {
    factors.push(value);
  }

  return factors;
}

function setResult(el, html, state) {
  el.className = "result";
  if (state) {
    el.classList.add(state);
  }
  el.innerHTML = html;
}

function asInt(value) {
  if (value === "") {
    return null;
  }
  const num = Number(value);
  return Number.isInteger(num) ? num : null;
}

function setStatsRows(tbody, rows) {
  tbody.innerHTML = rows
    .map(([label, value]) => `<tr><td>${label}</td><td>${value}</td></tr>`)
    .join("");
}

function renderFactorChips(factors, commonSet, gcdValue) {
  return factors
    .map((n) => {
      const isCommon = commonSet.has(n);
      const isGcd = n === gcdValue;
      const classes = ["factor-chip"];

      if (isCommon) {
        classes.push("common-chip");
      }
      if (isGcd) {
        classes.push("gcd-chip");
      }

      return `<span class="${classes.join(" ")}">${n}</span>`;
    })
    .join("");
}

const modeSelect = document.getElementById("modeSelect");
const oneModeCard = document.getElementById("oneModeCard");
const twoModeCard = document.getElementById("twoModeCard");

const singleNumberInput = document.getElementById("singleNumberInput");
const singleExploreHint = document.getElementById("singleExploreHint");
const factorResult = document.getElementById("factorResult");
const primeResult = document.getElementById("primeResult");
const singleStatsWrap = document.getElementById("singleStatsWrap");
const singleStatsBody = document.getElementById("singleStatsBody");

const numA = document.getElementById("numA");
const numB = document.getElementById("numB");
const gcdLcmResult = document.getElementById("gcdLcmResult");
const twoStatsWrap = document.getElementById("twoStatsWrap");
const twoStatsBody = document.getElementById("twoStatsBody");

function runSingleExplorer() {
  const value = asInt(singleNumberInput.value);

  if (value === null) {
    setResult(singleExploreHint, "Waiting for a number...");
    setResult(factorResult, "Factors will appear here.");
    setResult(primeResult, "Prime factorisation will appear here.");
    singleStatsWrap.classList.add("hidden");
    return;
  }

  if (value < 1) {
    setResult(singleExploreHint, "Please enter a whole number greater than 0.", "error");
    setResult(factorResult, "Factors will appear here.");
    setResult(primeResult, "Prime factorisation will appear here.");
    singleStatsWrap.classList.add("hidden");
    return;
  }

  const factors = factorsOf(value);
  const sumOfFactors = factors.reduce((acc, n) => acc + n, 0);
  const pairCount = factors.filter((n) => n <= Math.sqrt(value) && value % n === 0).length;

  setResult(singleExploreHint, `Showing results for <strong>${value}</strong>.`, "success");
  setResult(
    factorResult,
    `<strong>Factors of ${value}:</strong> ${factors.join(", ")}`,
    "success"
  );

  if (value >= 2) {
    const p = primeFactorization(value);
    const grouped = p.reduce((acc, n) => {
      acc[n] = (acc[n] || 0) + 1;
      return acc;
    }, {});
    const compact = Object.entries(grouped)
      .map(([base, exp]) => (exp > 1 ? `${base}^${exp}` : base))
      .join(" × ");
    setResult(primeResult, `<strong>Prime factorisation:</strong> ${value} = ${p.join(" × ")}<br/><small>Compact: ${compact}</small>`, "success");
  } else {
    setResult(primeResult, "Prime factorisation starts at 2.");
  }

  setStatsRows(singleStatsBody, [
    ["Number", value],
    ["Total factors", factors.length],
    ["Factor pairs", pairCount],
    ["Smallest factor", factors[0]],
    ["Largest factor", factors[factors.length - 1]],
    ["Prime number?", factors.length === 2 ? "Yes" : "No"],
    ["Perfect square?", Number.isInteger(Math.sqrt(value)) ? "Yes" : "No"],
    ["Sum of factors", sumOfFactors]
  ]);
  singleStatsWrap.classList.remove("hidden");
}

function runTwoExplorer() {
  const a = asInt(numA.value);
  const b = asInt(numB.value);

  if (a === null || b === null) {
    setResult(gcdLcmResult, "Waiting for two numbers...");
    twoStatsWrap.classList.add("hidden");
    return;
  }

  if (a < 1 || b < 1) {
    setResult(gcdLcmResult, "Please enter two whole numbers greater than 0.", "error");
    twoStatsWrap.classList.add("hidden");
    return;
  }

  const gcdValue = gcd(a, b);
  const lcmValue = lcm(a, b);
  const factorsA = factorsOf(a);
  const factorsB = factorsOf(b);
  const common = factorsA.filter((n) => factorsB.includes(n));
  const commonSet = new Set(common);

  const factorView = `
    <div class="factor-view">
      <p class="factor-view-title">Why GCD is ${gcdValue}</p>
      <small>All factors are in ascending order. Circled factors are common to both numbers. The double circle is the GCD.</small>
      <div class="factor-line"><strong>Factors of ${a}:</strong> ${renderFactorChips(factorsA, commonSet, gcdValue)}</div>
      <div class="factor-line"><strong>Factors of ${b}:</strong> ${renderFactorChips(factorsB, commonSet, gcdValue)}</div>
    </div>
  `;

  setResult(
    gcdLcmResult,
    `<strong>GCD(${a}, ${b}) = ${gcdValue}</strong><br/><strong>LCM(${a}, ${b}) = ${lcmValue}</strong>${factorView}`,
    "success"
  );

  setStatsRows(twoStatsBody, [
    ["First number", a],
    ["Second number", b],
    ["Factor count of first", factorsA.length],
    ["Factor count of second", factorsB.length],
    ["Common factors", common.join(", ")],
    ["Number of common factors", common.length],
    ["GCD", gcdValue],
    ["LCM", lcmValue]
  ]);
  twoStatsWrap.classList.remove("hidden");
}

function setMode(mode) {
  const oneMode = mode === "one";
  oneModeCard.classList.toggle("hidden", !oneMode);
  twoModeCard.classList.toggle("hidden", oneMode);

  if (oneMode) {
    runSingleExplorer();
  } else {
    runTwoExplorer();
  }
}

modeSelect.addEventListener("change", () => setMode(modeSelect.value));
singleNumberInput.addEventListener("input", runSingleExplorer);
numA.addEventListener("input", runTwoExplorer);
numB.addEventListener("input", runTwoExplorer);

setMode(modeSelect.value);

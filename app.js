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

const factorInput = document.getElementById("factorInput");
const factorBtn = document.getElementById("factorBtn");
const factorExampleBtn = document.getElementById("factorExampleBtn");
const factorResult = document.getElementById("factorResult");

const primeInput = document.getElementById("primeInput");
const primeBtn = document.getElementById("primeBtn");
const primeExampleBtn = document.getElementById("primeExampleBtn");
const primeResult = document.getElementById("primeResult");

const numA = document.getElementById("numA");
const numB = document.getElementById("numB");
const gcdLcmBtn = document.getElementById("gcdLcmBtn");
const gcdLcmExampleBtn = document.getElementById("gcdLcmExampleBtn");
const gcdLcmResult = document.getElementById("gcdLcmResult");

const n1 = document.getElementById("n1");
const d1 = document.getElementById("d1");
const op = document.getElementById("op");
const n2 = document.getElementById("n2");
const d2 = document.getElementById("d2");
const fractionBtn = document.getElementById("fractionBtn");
const fractionExampleBtn = document.getElementById("fractionExampleBtn");
const fractionResult = document.getElementById("fractionResult");

const quickFactors = document.getElementById("quickFactors");
const quickPrime = document.getElementById("quickPrime");
const quickGcdLcm = document.getElementById("quickGcdLcm");
const quickFraction = document.getElementById("quickFraction");

function runFactors() {
  const value = asInt(factorInput.value);

  if (value === null || value < 1) {
    setResult(factorResult, "Please enter a whole number greater than 0.", "error");
    return;
  }

  const factors = factorsOf(value);
  setResult(
    factorResult,
    `<strong>Factors of ${value}:</strong> ${factors.join(", ")}<br/><small>Total factors: ${factors.length}</small>`,
    "success"
  );
}

function runPrimeFactorization() {
  const value = asInt(primeInput.value);

  if (value === null || value < 2) {
    setResult(primeResult, "Please enter a whole number greater than or equal to 2.", "error");
    return;
  }

  const factors = primeFactorization(value);
  const grouped = factors.reduce((acc, f) => {
    acc[f] = (acc[f] || 0) + 1;
    return acc;
  }, {});

  const compact = Object.entries(grouped)
    .map(([base, exp]) => (exp > 1 ? `${base}^${exp}` : base))
    .join(" × ");

  setResult(
    primeResult,
    `<strong>${value}</strong> = ${factors.join(" × ")}<br/><small>Compact form: ${compact}</small>`,
    "success"
  );
}

function runGcdLcm() {
  const a = asInt(numA.value);
  const b = asInt(numB.value);

  if (a === null || b === null || a < 1 || b < 1) {
    setResult(gcdLcmResult, "Please enter two whole numbers greater than 0.", "error");
    return;
  }

  const gcdValue = gcd(a, b);
  const lcmValue = lcm(a, b);

  setResult(
    gcdLcmResult,
    `<strong>GCD(${a}, ${b}) = ${gcdValue}</strong><br/><strong>LCM(${a}, ${b}) = ${lcmValue}</strong><br/><small>Check: GCD × LCM = ${gcdValue * lcmValue}, and ${a} × ${b} = ${a * b}</small>`,
    "success"
  );
}

function runFractions() {
  const aNum = asInt(n1.value);
  const aDen = asInt(d1.value);
  const bNum = asInt(n2.value);
  const bDen = asInt(d2.value);
  const operation = op.value;

  if (aNum === null || bNum === null || aDen === null || bDen === null) {
    setResult(fractionResult, "Please fill all fraction fields with whole numbers.", "error");
    return;
  }

  if (aDen === 0 || bDen === 0) {
    setResult(fractionResult, "Denominators cannot be 0.", "error");
    return;
  }

  if (aDen < 0 || bDen < 0) {
    setResult(fractionResult, "Please use positive denominators for beginner practice.", "error");
    return;
  }

  const lcd = lcm(aDen, bDen);
  const leftScale = lcd / aDen;
  const rightScale = lcd / bDen;

  const leftAdjusted = aNum * leftScale;
  const rightAdjusted = bNum * rightScale;

  const resultNum = operation === "+" ? leftAdjusted + rightAdjusted : leftAdjusted - rightAdjusted;
  const resultDen = lcd;

  const simplifyBy = gcd(resultNum, resultDen);
  const simpleNum = resultNum / simplifyBy;
  const simpleDen = resultDen / simplifyBy;

  const sign = operation === "+" ? " + " : " - ";

  const html = `
    <strong>Step 1:</strong> LCD = LCM(${aDen}, ${bDen}) = ${lcd}<br/>
    <strong>Step 2:</strong> Rewrite fractions:<br/>
    ${aNum}/${aDen} = ${leftAdjusted}/${lcd} and ${bNum}/${bDen} = ${rightAdjusted}/${lcd}<br/>
    <strong>Step 3:</strong> ${leftAdjusted}/${lcd}${sign}${rightAdjusted}/${lcd} = ${resultNum}/${resultDen}<br/>
    <strong>Step 4:</strong> Simplify by GCD(${Math.abs(resultNum)}, ${resultDen}) = ${simplifyBy}<br/>
    <strong>Final:</strong> ${resultNum}/${resultDen} = <strong>${simpleNum}/${simpleDen}</strong>
  `;

  setResult(fractionResult, html, "success");
}

function setupEnterToRun(inputElements, runFn) {
  inputElements.forEach((el) => {
    el.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        runFn();
      }
    });
  });
}

function loadFactorExample() {
  factorInput.value = 36;
  runFactors();
}

function loadPrimeExample() {
  primeInput.value = 60;
  runPrimeFactorization();
}

function loadGcdLcmExample() {
  numA.value = 18;
  numB.value = 24;
  runGcdLcm();
}

function loadFractionExample() {
  n1.value = 1;
  d1.value = 4;
  op.value = "+";
  n2.value = 3;
  d2.value = 10;
  runFractions();
}

factorBtn.addEventListener("click", runFactors);
primeBtn.addEventListener("click", runPrimeFactorization);
gcdLcmBtn.addEventListener("click", runGcdLcm);
fractionBtn.addEventListener("click", runFractions);

factorExampleBtn.addEventListener("click", loadFactorExample);
primeExampleBtn.addEventListener("click", loadPrimeExample);
gcdLcmExampleBtn.addEventListener("click", loadGcdLcmExample);
fractionExampleBtn.addEventListener("click", loadFractionExample);

quickFactors.addEventListener("click", loadFactorExample);
quickPrime.addEventListener("click", loadPrimeExample);
quickGcdLcm.addEventListener("click", loadGcdLcmExample);
quickFraction.addEventListener("click", loadFractionExample);

setupEnterToRun([factorInput], runFactors);
setupEnterToRun([primeInput], runPrimeFactorization);
setupEnterToRun([numA, numB], runGcdLcm);
setupEnterToRun([n1, d1, n2, d2], runFractions);

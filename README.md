# Factor Explorer

A student-friendly web app to learn:
- Factors of a number
- Prime factorization
- GCD (Greatest Common Divisor)
- LCM (Least Common Multiple)
- Fraction addition/subtraction using LCM (lowest common denominator)

## Why this project
This tool is designed to help students understand ideas step by step instead of only seeing final answers.

## Features
1. Find all factors of a whole number.
2. Show prime factorization in expanded and compact form.
3. Compute GCD and LCM for two numbers.
4. Solve fraction addition/subtraction with clear LCM-based steps.
5. Simplify final fraction using GCD.

## Run locally
1. Open `index.html` in a web browser.
2. Or use the VS Code Live Server extension for auto-refresh.

## Automated browser tests (Playwright)
1. Install dependencies:
	- `npm install`
2. Install Playwright browser:
	- `npx playwright install chromium`
3. Run tests:
	- `npm run test:e2e`
4. Open HTML report:
	- `npm run test:e2e:report`

Notes:
- Tests use a local static server at `http://127.0.0.1:4173`.
- GitHub Actions runs these tests automatically on pushes and pull requests to `main`.

## Suggested classroom use
1. Ask students to predict factors first.
2. Use the app to check answers.
3. Compare factor list, prime factors, GCD, and LCM.
4. Practice fraction operations and explain each transformation.

## Tech stack
- HTML
- CSS
- Vanilla JavaScript

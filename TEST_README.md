# Calculator Unit Tests

## Overview
This directory contains comprehensive unit tests for the calculator application.

## Test File
- **calculator.test.js** - Contains all unit tests for the calculator functions

## Test Coverage

### Test Suites

#### 1. **appendNumber Tests** (7 tests)
- Appending single digits
- Appending multiple digits
- Handling leading zeros
- Decimal point handling
- Prevention of multiple decimal points
- Display reset functionality
- Zero handling

#### 2. **appendOperator Tests** (4 tests)
- Setting addition operator
- Setting subtraction operator
- Setting multiplication operator
- Setting division operator

#### 3. **calculate Tests** (10 tests)
- Addition of two numbers
- Subtraction of two numbers
- Multiplication of two numbers
- Division of two numbers
- Division with decimal results
- Negative results
- Edge case: No operation set
- Edge case: shouldResetDisplay is true
- Operation reset after calculation
- Display update

#### 4. **clearDisplay Tests** (2 tests)
- Resetting all calculator values
- Display text reset

#### 5. **Integration Tests** (3 tests)
- Complete calculation sequence
- Consecutive operations
- Decimal calculations

## Total: 26 Unit Tests

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Tests
```bash
# Run all tests
npm test

# Run tests in watch mode (re-runs when files change)
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run a single test file
npx jest calculator.test.js
```

## Test Framework
- **Jest** - JavaScript testing framework

## Supported Expression Examples

- `1 + 2 * 3`
- `(1 + 2) * 3`
- `0.5 + 1.25`
- `-5 + 2`
- `-(2 + 3)`
- `1 / 3`
- `2.5 * -4`
- `((1 + 2) * (3 - 4)) / 5`

## Common Error Examples

- **Expression is empty**  
  The input was blank or only whitespace.

- **Malformed decimal number**  
  The input contains an invalid number format, e.g. `1..2`, `.`, or `..`.

- **Invalid operator sequence: "++"**  
  Two operators in a row, e.g. `1++2`, `2**2`, or `4//2`.

- **Mismatched parentheses: too many closing )**  
  There are more closing than opening parentheses, e.g. `1 + 2)`.

- **Mismatched parentheses: too many opening (**  
  There are more opening than closing parentheses, e.g. `((1 + 2)`.

- **Division by zero**  
  Attempted to divide by zero, e.g. `5 / 0`.

- **Expression exceeds maximum length of 4096 characters**  
  The input is too long.

## Functions Tested
1. **appendNumber(num)** - Adds numbers to the current input
2. **appendOperator(op)** - Sets the operation (+, -, *, /)
3. **calculate()** - Performs the mathematical operation
4. **clearDisplay()** - Resets the calculator to initial state
5. **updateDisplay()** - Updates the display with current input

## Edge Cases Covered
- Leading zeros
- Multiple decimal points
- Division by operators
- Negative results
- Consecutive operations
- Decimal number operations

## Notes
This is the space to add some notes, new project, new space, new workflow
The notes must containd the default standards of the company


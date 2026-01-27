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
```

## Test Framework
- **Jest** - JavaScript testing framework

## Expected Test Results
All 26 tests should pass with 100% coverage of calculator functions.

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


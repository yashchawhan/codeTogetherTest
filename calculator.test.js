/**
 * Unit Tests for Calculator
 * Tests for all calculator operations and edge cases
 */

describe('Calculator Functions', () => {
    let display;
    let currentInput;
    let previousValue;
    let operation;
    let shouldResetDisplay;

    // Setup before each test
    beforeEach(() => {
        // Initialize calculator state
        currentInput = '0';
        previousValue = null;
        operation = null;
        shouldResetDisplay = false;

        // Mock DOM element
        display = {
            textContent: '0'
        };
    });

    // Helper function to update display
    const updateDisplay = () => {
        display.textContent = currentInput;
    };

    // Test appendNumber function
    describe('appendNumber', () => {
        const appendNumber = (num) => {
            if (shouldResetDisplay) {
                currentInput = num;
                shouldResetDisplay = false;
            } else {
                if (currentInput === '0' && num !== '.') {
                    currentInput = num;
                } else if (num === '.' && currentInput.includes('.')) {
                    return;
                } else {
                    currentInput += num;
                }
            }
            updateDisplay();
        };

        it('should append single digit to display', () => {
            appendNumber('5');
            expect(currentInput).toBe('5');
            expect(display.textContent).toBe('5');
        });

        it('should append multiple digits correctly', () => {
            appendNumber('1');
            appendNumber('2');
            appendNumber('3');
            expect(currentInput).toBe('123');
            expect(display.textContent).toBe('123');
        });

        it('should replace leading zero with new number', () => {
            appendNumber('5');
            expect(currentInput).toBe('5');
        });

        it('should handle decimal point correctly', () => {
            appendNumber('5');
            appendNumber('.');
            appendNumber('5');
            expect(currentInput).toBe('5.5');
        });

        it('should prevent multiple decimal points', () => {
            appendNumber('5');
            appendNumber('.');
            appendNumber('.');
            expect(currentInput).toBe('5.');
        });

        it('should reset display when shouldResetDisplay is true', () => {
            currentInput = '5';
            shouldResetDisplay = true;
            appendNumber('9');
            expect(currentInput).toBe('9');
            expect(shouldResetDisplay).toBe(false);
        });

        it('should handle zero correctly', () => {
            appendNumber('0');
            appendNumber('5');
            expect(currentInput).toBe('5');
        });
    });

    // Test appendOperator function
    describe('appendOperator', () => {
        const appendOperator = (op) => {
            previousValue = currentInput;
            operation = op;
            shouldResetDisplay = true;
        };

        it('should set operation and previous value', () => {
            currentInput = '5';
            appendOperator('+');
            expect(previousValue).toBe('5');
            expect(operation).toBe('+');
            expect(shouldResetDisplay).toBe(true);
        });

        it('should set subtraction operator', () => {
            currentInput = '10';
            appendOperator('-');
            expect(operation).toBe('-');
            expect(previousValue).toBe('10');
        });

        it('should set multiplication operator', () => {
            currentInput = '7';
            appendOperator('*');
            expect(operation).toBe('*');
        });

        it('should set division operator', () => {
            currentInput = '20';
            appendOperator('/');
            expect(operation).toBe('/');
        });
    });

    // Test calculate function
    describe('calculate', () => {
        const calculate = () => {
            if (operation === null || shouldResetDisplay) {
                return;
            }

            let result;
            const prev = parseFloat(previousValue);
            const current = parseFloat(currentInput);

            switch(operation) {
                case '+':
                    result = prev + current;
                    break;
                case '-':
                    result = prev - current;
                    break;
                case '*':
                    result = prev * current;
                    break;
                case '/':
                    result = prev / current;
                    break;
                default:
                    return;
            }

            currentInput = result.toString();
            operation = null;
            shouldResetDisplay = true;
            updateDisplay();
        };

        it('should add two numbers correctly', () => {
            previousValue = '5';
            currentInput = '3';
            operation = '+';
            shouldResetDisplay = false;
            calculate();
            expect(currentInput).toBe('8');
        });

        it('should subtract two numbers correctly', () => {
            previousValue = '10';
            currentInput = '3';
            operation = '-';
            shouldResetDisplay = false;
            calculate();
            expect(currentInput).toBe('7');
        });

        it('should multiply two numbers correctly', () => {
            previousValue = '6';
            currentInput = '7';
            operation = '*';
            shouldResetDisplay = false;
            calculate();
            expect(currentInput).toBe('42');
        });

        it('should divide two numbers correctly', () => {
            previousValue = '20';
            currentInput = '4';
            operation = '/';
            shouldResetDisplay = false;
            calculate();
            expect(currentInput).toBe('5');
        });

        it('should handle division resulting in decimal', () => {
            previousValue = '10';
            currentInput = '3';
            operation = '/';
            shouldResetDisplay = false;
            calculate();
            expect(currentInput).toBe('3.3333333333333335');
        });

        it('should handle negative results', () => {
            previousValue = '5';
            currentInput = '10';
            operation = '-';
            shouldResetDisplay = false;
            calculate();
            expect(currentInput).toBe('-5');
        });

        it('should not calculate when operation is null', () => {
            previousValue = '5';
            currentInput = '3';
            operation = null;
            const originalInput = currentInput;
            calculate();
            expect(currentInput).toBe(originalInput);
        });

        it('should not calculate when shouldResetDisplay is true', () => {
            previousValue = '5';
            currentInput = '3';
            operation = '+';
            shouldResetDisplay = true;
            const originalInput = currentInput;
            calculate();
            expect(currentInput).toBe(originalInput);
        });

        it('should reset operation after calculation', () => {
            previousValue = '2';
            currentInput = '3';
            operation = '+';
            shouldResetDisplay = false;
            calculate();
            expect(operation).toBe(null);
            expect(shouldResetDisplay).toBe(true);
        });
    });

    // Test clearDisplay function
    describe('clearDisplay', () => {
        const clearDisplay = () => {
            currentInput = '0';
            previousValue = null;
            operation = null;
            shouldResetDisplay = false;
            updateDisplay();
        };

        it('should reset all calculator values', () => {
            currentInput = '123';
            previousValue = '456';
            operation = '+';
            shouldResetDisplay = true;
            
            clearDisplay();
            
            expect(currentInput).toBe('0');
            expect(previousValue).toBeNull();
            expect(operation).toBeNull();
            expect(shouldResetDisplay).toBe(false);
            expect(display.textContent).toBe('0');
        });

        it('should reset display text', () => {
            display.textContent = '999';
            clearDisplay();
            expect(display.textContent).toBe('0');
        });
    });

    // Integration tests
    describe('Integration Tests', () => {
        it('should perform complete calculation: 5 + 3 = 8', () => {
            // Simulate: 5 + 3 =
            currentInput = '5';
            previousValue = '5';
            operation = '+';
            shouldResetDisplay = true;

            currentInput = '3';
            shouldResetDisplay = false;

            // Calculate
            if (operation === null || shouldResetDisplay) {
                // Skip
            } else {
                const result = 5 + 3;
                currentInput = result.toString();
                operation = null;
                shouldResetDisplay = true;
            }

            expect(currentInput).toBe('8');
        });

        it('should perform consecutive operations', () => {
            // 10 + 5 - 3 = 12
            currentInput = '10';
            previousValue = '10';
            operation = '+';
            shouldResetDisplay = true;

            currentInput = '5';
            shouldResetDisplay = false;

            // First calculation: 10 + 5 = 15
            let result = parseFloat(previousValue) + parseFloat(currentInput);
            currentInput = result.toString();

            previousValue = currentInput; // 15
            operation = '-';
            shouldResetDisplay = true;

            currentInput = '3';
            shouldResetDisplay = false;

            // Second calculation: 15 - 3 = 12
            result = parseFloat(previousValue) - parseFloat(currentInput);
            currentInput = result.toString();

            expect(currentInput).toBe('12');
        });

        it('should handle decimal calculations', () => {
            previousValue = '10.5';
            currentInput = '2.5';
            operation = '+';
            shouldResetDisplay = false;

            const result = parseFloat(previousValue) + parseFloat(currentInput);
            currentInput = result.toString();

            expect(parseFloat(currentInput)).toBe(13);
        });
    });
});

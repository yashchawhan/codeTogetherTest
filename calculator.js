// Expression evaluator for calculator

const MAX_INPUT_LENGTH = 4096;

/**
 * Main entry: validates, tokenizes, parses, and evaluates the expression.
 */
export function evaluateExpression(expression) {
    validateInput(expression);
    const tokens = tokenize(expression);
    validateTokenSequence(tokens);
    const rpn = toRPN(tokens);
    return evalRPN(rpn);
}

/**
 * Validates the raw input string for type, emptiness, and length.
 */
function validateInput(expr) {
    if (typeof expr !== 'string') throw new Error('Expression must be a string');
    if (expr.length === 0 || expr.trim().length === 0) {
        throw new Error('Expression is empty');
    }
    if (expr.length > MAX_INPUT_LENGTH) {
        throw new Error(`Expression exceeds maximum length of ${MAX_INPUT_LENGTH} characters`);
    }
}

/**
 * Converts the input string into an array of tokens (numbers, operators, parentheses).
 * Handles tricky cases like malformed decimals and unary minus.
 */
export function tokenize(expr) {
    const tokens = [];
    let i = 0;
    while (i < expr.length) {
        const c = expr[i];
        if (/\s/.test(c)) {
            i++;
        } else if (/[0-9.]/.test(c)) {
            let num = '';
            let dotCount = 0;
            while (i < expr.length && /[0-9.]/.test(expr[i])) {
                if (expr[i] === '.') dotCount++;
                num += expr[i++];
            }
            if (num === '.' || num === '..' || dotCount > 1) throw new Error('Malformed decimal number');
            if (!/^(\d+(\.\d*)?|\.\d+)$/.test(num)) throw new Error('Malformed decimal number');
            tokens.push({ type: 'number', value: parseFloat(num) });
        } else if ('+-*/()'.includes(c)) {
            // Handle unary minus: if '-' is at the start or after an operator or '('
            if (c === '-' && (tokens.length === 0 || (tokens[tokens.length - 1].type !== 'number' && tokens[tokens.length - 1].value !== ')'))) {
                let num = '-';
                i++;
                let dotCount = 0;
                let hasDigit = false;
                while (i < expr.length && /[0-9.]/.test(expr[i])) {
                    if (expr[i] === '.') dotCount++;
                    else hasDigit = true;
                    num += expr[i++];
                }
                if (num === '-' || num === '-.' || num === '-..' || dotCount > 1 || !hasDigit) throw new Error('Malformed unary minus or decimal');
                if (!/^-?(\d+(\.\d*)?|\.\d+)$/.test(num)) throw new Error('Malformed unary minus or decimal');
                tokens.push({ type: 'number', value: parseFloat(num) });
            } else {
                tokens.push({ type: 'operator', value: c });
                i++;
            }
        } else {
            throw new Error('Invalid character: ' + c);
        }
    }
    return tokens;
}

/**
 * Checks for invalid operator sequences and mismatched parentheses.
 */
function validateTokenSequence(tokens) {
    let last = null;
    let parenBalance = 0;
    for (let i = 0; i < tokens.length; i++) {
        const t = tokens[i];
        if (t.type === 'operator') {
            // Disallow sequences like ++, **, //, etc.
            if ('+-*/'.includes(t.value) && last && last.type === 'operator' && '+-*/'.includes(last.value)) {
                throw new Error(`Invalid operator sequence: "${last.value}${t.value}"`);
            }
            if (t.value === '(') parenBalance++;
            if (t.value === ')') parenBalance--;
            if (parenBalance < 0) throw new Error('Mismatched parentheses: too many closing )');
        }
        last = t;
    }
    if (parenBalance > 0) throw new Error('Mismatched parentheses: too many opening (');
}

/**
 * Converts tokens to Reverse Polish Notation (RPN) using the Shunting Yard algorithm.
 * Handles operator precedence and parentheses.
 */
export function toRPN(tokens) {
    const output = [];
    const ops = [];
    const precedence = { '+': 1, '-': 1, '*': 2, '/': 2 };
    const associativity = { '+': 'L', '-': 'L', '*': 'L', '/': 'L' };

    for (const token of tokens) {
        if (token.type === 'number') {
            output.push(token);
        } else if (token.type === 'operator') {
            if (token.value === '(') {
                ops.push(token);
            } else if (token.value === ')') {
                // Pop operators until matching '('
                while (ops.length && ops[ops.length - 1].value !== '(') {
                    output.push(ops.pop());
                }
                if (!ops.length) throw new Error('Mismatched parentheses: missing opening (');
                ops.pop(); // Remove '('
            } else {
                // Pop higher/equal precedence operators (left-associative)
                while (
                    ops.length &&
                    ops[ops.length - 1].type === 'operator' &&
                    ops[ops.length - 1].value !== '(' &&
                    (
                        precedence[ops[ops.length - 1].value] > precedence[token.value] ||
                        (precedence[ops[ops.length - 1].value] === precedence[token.value] && associativity[token.value] === 'L')
                    )
                ) {
                    output.push(ops.pop());
                }
                ops.push(token);
            }
        }
    }
    // Pop any remaining operators
    while (ops.length) {
        if (ops[ops.length - 1].value === '(' || ops[ops.length - 1].value === ')')
            throw new Error('Mismatched parentheses: missing closing )');
        output.push(ops.pop());
    }
    return output;
}

// Evaluate the RPN expression
function evalRPN(rpn) {
    const stack = [];
    for (const token of rpn) {
        if (token.type === 'number') {
            stack.push(token.value);
        } else if (token.type === 'operator') {
            if (stack.length < 2) throw new Error('Invalid expression');
            const b = stack.pop();
            const a = stack.pop();
            let result;
            switch (token.value) {
                case '+': result = a + b; break;
                case '-': result = a - b; break;
                case '*': result = a * b; break;
                case '/':
                    if (b === 0) throw new Error('Division by zero');
                    result = a / b;
                    break;
                default: throw new Error('Unknown operator: ' + token.value);
            }
            stack.push(result);
        }
    }
    if (stack.length !== 1) throw new Error('Invalid expression');
    return stack[0];
}

/**
 * Formats a numeric result:
 * - Rounds to maxDecimals (default 6)
 * - Trims trailing zeros
 * - Returns integers without decimal
 * - Avoids scientific notation for typical values
 */
export function formatResult(value, options = {}) {
    const maxDecimals = options.maxDecimals ?? 6;
    if (typeof value !== 'number' || !isFinite(value)) return String(value);

    // Avoid scientific notation for typical values
    let rounded = Number(Math.round(value * Math.pow(10, maxDecimals)) / Math.pow(10, maxDecimals));
    let str = rounded.toFixed(maxDecimals);

    // Trim trailing zeros and possible trailing decimal point
    str = str.replace(/\.?0+$/, '');

    // If the result is -0, return "0"
    if (str === '-0') str = '0';

    return str;
}
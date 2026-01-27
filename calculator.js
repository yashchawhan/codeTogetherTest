// Expression evaluator for calculator using AST

const MAX_INPUT_LENGTH = 4096;

/**
 * Main entry: validates, tokenizes, parses to AST, and evaluates the expression.
 */
export function evaluateExpression(expression) {
    validateInput(expression);
    const tokens = tokenize(expression);
    validateTokenSequence(tokens);
    const ast = parseAST(tokens);
    return evalAST(ast);
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
 * Unary minus is detected if '-' is at the start or after an operator or '('.
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
 * Parentheses are counted to ensure balance.
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
 * AST node types:
 * - { type: 'number', value: number }
 * - { type: 'unary', op: '-', arg: AST }
 * - { type: 'binary', op: '+', left: AST, right: AST }
 */
function parseAST(tokens) {
    let pos = 0;

    function peek() {
        return tokens[pos];
    }
    function consume() {
        return tokens[pos++];
    }

    // Parse with precedence: lowest (add/sub) to highest (unary, parens)
    function parseExpression() {
        return parseAddSub();
    }

    function parseAddSub() {
        let node = parseMulDiv();
        while (peek() && peek().type === 'operator' && (peek().value === '+' || peek().value === '-')) {
            const op = consume().value;
            const right = parseMulDiv();
            node = { type: 'binary', op, left: node, right };
        }
        return node;
    }

    function parseMulDiv() {
        let node = parseUnary();
        while (peek() && peek().type === 'operator' && (peek().value === '*' || peek().value === '/')) {
            const op = consume().value;
            const right = parseUnary();
            node = { type: 'binary', op, left: node, right };
        }
        return node;
    }

    function parseUnary() {
        if (peek() && peek().type === 'operator' && peek().value === '-') {
            consume();
            const arg = parseUnary();
            return { type: 'unary', op: '-', arg };
        }
        return parsePrimary();
    }

    function parsePrimary() {
        const token = peek();
        if (!token) throw new Error('Invalid expression');
        if (token.type === 'number') {
            consume();
            return { type: 'number', value: token.value };
        }
        if (token.type === 'operator' && token.value === '(') {
            consume();
            const expr = parseExpression();
            if (!peek() || peek().type !== 'operator' || peek().value !== ')') {
                throw new Error('Mismatched parentheses: missing closing )');
            }
            consume();
            return expr;
        }
        throw new Error('Invalid expression');
    }

    const ast = parseExpression();
    if (pos !== tokens.length) throw new Error('Invalid expression');
    return ast;
}

/**
 * Recursively evaluates the AST.
 * Throws on division by zero and malformed expressions.
 */
export function evalAST(node) {
    switch (node.type) {
        case 'number':
            return node.value;
        case 'unary':
            if (node.op === '-') return -evalAST(node.arg);
            throw new Error('Unknown unary operator: ' + node.op);
        case 'binary': {
            const left = evalAST(node.left);
            const right = evalAST(node.right);
            switch (node.op) {
                case '+': return left + right;
                case '-': return left - right;
                case '*': return left * right;
                case '/':
                    if (right === 0) throw new Error('Division by zero');
                    return left / right;
                default: throw new Error('Unknown operator: ' + node.op);
            }
        }
        default:
            throw new Error('Invalid expression');
    }
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
// Expression evaluator for calculator using AST

/**
 * Evaluates a mathematical expression string.
 * Supports +, -, *, /, parentheses, whitespace, decimals, unary minus.
 * Throws on invalid expressions or division by zero.
 */
export function evaluateExpression(expression) {
    const tokens = tokenize(expression);
    const ast = parseAST(tokens);
    return evalAST(ast);
}

// Tokenize input into numbers, operators, and parentheses
function tokenize(expr) {
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
            tokens.push({ type: 'operator', value: c });
            i++;
        } else {
            throw new Error('Invalid character: ' + c);
        }
    }
    return tokens;
}

// Parse tokens into AST (handles precedence, parentheses, unary minus)
function parseAST(tokens) {
    let pos = 0;
    function peek() { return tokens[pos]; }
    function consume() { return tokens[pos++]; }

    function parseExpression() { return parseAddSub(); }
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
                throw new Error('Mismatched parentheses');
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

// Evaluate the AST
function evalAST(node) {
    switch (node.type) {
        case 'number': return node.value;
        case 'unary': return -evalAST(node.arg);
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
        default: throw new Error('Invalid expression');
    }
}

import { evaluateExpression } from './calculator.js';

describe('evaluateExpression', () => {
    // Precedence and parentheses
    it('respects operator precedence', () => {
        expect(evaluateExpression('1 + 2 * 3')).toBe(7);
        expect(evaluateExpression('2 * 3 + 1')).toBe(7);
    });
    it('handles parentheses', () => {
        expect(evaluateExpression('(1 + 2) * 3')).toBe(9);
        expect(evaluateExpression('2 * (3 + 1)')).toBe(8);
        expect(evaluateExpression('((2+3)*4)')).toBe(20);
    });

    // Decimals
    it('handles decimals', () => {
        expect(evaluateExpression('0.5 + 1.25')).toBe(1.75);
        expect(evaluateExpression('2.5 * 2')).toBe(5);
        expect(evaluateExpression('1.2 + 3.4')).toBe(4.6);
    });

    // Unary minus
    it('handles unary minus at start', () => {
        expect(evaluateExpression('-5 + 2')).toBe(-3);
    });
    it('handles unary minus with parentheses', () => {
        expect(evaluateExpression('-(2 + 3)')).toBe(-5);
    });
    it('handles unary minus after operator', () => {
        expect(evaluateExpression('1*-2')).toBe(-2);
        expect(evaluateExpression('4 + -2')).toBe(2);
    });
    it('handles double unary minus', () => {
        expect(evaluateExpression('--5')).toBe(5);
    });

    // Division by zero throws
    it('throws on division by zero', () => {
        expect(() => evaluateExpression('5 / 0')).toThrow('Division by zero');
        expect(() => evaluateExpression('1/(2-2)')).toThrow('Division by zero');
    });

    // Invalid expressions throw
    it('throws on invalid expression (mismatched parentheses)', () => {
        expect(() => evaluateExpression('(1 + 2')).toThrow('Mismatched parentheses');
        expect(() => evaluateExpression('1 + 2)')).toThrow('Mismatched parentheses');
    });
    it('throws on invalid characters', () => {
        expect(() => evaluateExpression('2 + a')).toThrow('Invalid character');
    });
    it('throws on invalid number format', () => {
        expect(() => evaluateExpression('1..2 + 3')).toThrow('Malformed decimal number');
        expect(() => evaluateExpression('.')).toThrow('Malformed decimal number');
    });
    it('throws on empty input', () => {
        expect(() => evaluateExpression('')).toThrow('Invalid expression');
    });
});
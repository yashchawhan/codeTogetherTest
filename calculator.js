// Expression evaluator for calculator

export function evaluateExpression(expression) {
    const tokens = tokenize(expression);
    const rpn = toRPN(tokens);
    return evalRPN(rpn);
}

// Tokenize the input string into numbers, operators, and parentheses
function tokenize(expr) {
    const tokens = [];
    let i = 0;
    while (i < expr.length) {
        const c = expr[i];
        if (/\s/.test(c)) {
            i++;
        } else if (/[0-9.]/.test(c)) {
            let num = '';
            while (i < expr.length && /[0-9.]/.test(expr[i])) {
                num += expr[i++];
            }
            if ((num.match(/\./g) || []).length > 1) throw new Error('Invalid number');
            tokens.push({ type: 'number', value: parseFloat(num) });
        } else if ('+-*/()'.includes(c)) {
            // Handle unary minus
            if (c === '-' && (tokens.length === 0 || (tokens[tokens.length - 1].type !== 'number' && tokens[tokens.length - 1].value !== ')'))) {
                // It's a unary minus
                let num = '-';
                i++;
                while (i < expr.length && /[0-9.]/.test(expr[i])) {
                    num += expr[i++];
                }
                if (num === '-') throw new Error('Invalid unary minus');
                if ((num.match(/\./g) || []).length > 1) throw new Error('Invalid number');
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

// Convert tokens to Reverse Polish Notation (Shunting Yard algorithm)
function toRPN(tokens) {
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
                while (ops.length && ops[ops.length - 1].value !== '(') {
                    output.push(ops.pop());
                }
                if (!ops.length) throw new Error('Mismatched parentheses');
                ops.pop(); // Remove '('
            } else {
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
    while (ops.length) {
        if (ops[ops.length - 1].value === '(' || ops[ops.length - 1].value === ')') throw new Error('Mismatched parentheses');
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

export { evaluateExpression };
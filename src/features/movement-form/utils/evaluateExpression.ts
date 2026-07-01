type Token =
  | { type: 'number'; value: number }
  | { type: 'operator'; value: '+' | '-' | '*' | '/' };

function tokenize(expression: string): Token[] {
  const cleaned = expression.replace(/\s+/g, '');
  const regex = /(\d+\.?\d*)|([+\-*/])/g;
  const tokens: Token[] = [];
  let match: RegExpExecArray | null;

  while ((match = regex.exec(cleaned)) !== null) {
    if (match[1] !== undefined) {
      tokens.push({ type: 'number', value: parseFloat(match[1]) });
    } else {
      tokens.push({
        type: 'operator',
        value: match[2] as '+' | '-' | '*' | '/',
      });
    }
  }

  return tokens;
}

function applyOperator(a: number, op: string, b: number): number {
  switch (op) {
    case '+':
      return a + b;
    case '-':
      return a - b;
    case '*':
      return a * b;
    case '/':
      return b === 0 ? NaN : a / b;
    default:
      return NaN;
  }
}

export function evaluateExpression(expression: string): number | null {
  if (!expression.trim()) return null;

  const tokens = tokenize(expression);
  if (tokens.length === 0) return null;
  if (tokens[0].type !== 'number') return null;

  // Primera pasada: resolvemos * y / (precedencia)
  const pass1: Token[] = [tokens[0]];

  for (let i = 1; i < tokens.length; i += 2) {
    const operatorToken = tokens[i];
    const numberToken = tokens[i + 1];

    if (operatorToken?.type !== 'operator' || numberToken?.type !== 'number') {
      return null; // expresión mal formada, ej: "100+"
    }

    if (operatorToken.value === '*' || operatorToken.value === '/') {
      const prev = pass1.pop();
      if (prev?.type !== 'number') return null;
      const result = applyOperator(
        prev.value,
        operatorToken.value,
        numberToken.value,
      );
      if (Number.isNaN(result)) return null;
      pass1.push({ type: 'number', value: result });
    } else {
      pass1.push(operatorToken, numberToken);
    }
  }

  // Segunda pasada: resolvemos + y - de izquierda a derecha
  if (pass1[0].type !== 'number') return null;
  let result = pass1[0].value;

  for (let i = 1; i < pass1.length; i += 2) {
    const operatorToken = pass1[i];
    const numberToken = pass1[i + 1];
    if (operatorToken?.type !== 'operator' || numberToken?.type !== 'number')
      return null;
    result = applyOperator(result, operatorToken.value, numberToken.value);
  }

  return Number.isFinite(result) ? result : null;
}

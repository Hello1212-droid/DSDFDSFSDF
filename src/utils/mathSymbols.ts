/** Symbol palette data + formula templates for the equation editor. */

export interface MathSymbol {
  latex: string;
  display: string;
}

export interface SymbolCategory {
  id: string;
  label: string;
  symbols: MathSymbol[];
}

export const SYMBOL_CATEGORIES: SymbolCategory[] = [
  {
    id: "basic",
    label: "Basic",
    symbols: [
      { latex: "+", display: "+" },
      { latex: "-", display: "−" },
      { latex: "\\times", display: "×" },
      { latex: "\\div", display: "÷" },
      { latex: "=", display: "=" },
      { latex: "\\neq", display: "≠" },
      { latex: "\\approx", display: "≈" },
      { latex: "<", display: "<" },
      { latex: ">", display: ">" },
      { latex: "\\leq", display: "≤" },
      { latex: "\\geq", display: "≥" },
      { latex: "\\pm", display: "±" },
      { latex: "\\mp", display: "∓" },
      { latex: "\\cdot", display: "·" },
      { latex: "\\sqrt{}", display: "√" },
      { latex: "\\%", display: "%" },
      { latex: "\\infty", display: "∞" },
      { latex: "\\ldots", display: "…" },
    ],
  },
  {
    id: "greek",
    label: "Greek",
    symbols: [
      { latex: "\\alpha", display: "α" },
      { latex: "\\beta", display: "β" },
      { latex: "\\gamma", display: "γ" },
      { latex: "\\delta", display: "δ" },
      { latex: "\\epsilon", display: "ϵ" },
      { latex: "\\zeta", display: "ζ" },
      { latex: "\\eta", display: "η" },
      { latex: "\\theta", display: "θ" },
      { latex: "\\lambda", display: "λ" },
      { latex: "\\mu", display: "μ" },
      { latex: "\\pi", display: "π" },
      { latex: "\\rho", display: "ρ" },
      { latex: "\\sigma", display: "σ" },
      { latex: "\\tau", display: "τ" },
      { latex: "\\phi", display: "ϕ" },
      { latex: "\\omega", display: "ω" },
      { latex: "\\Gamma", display: "Γ" },
      { latex: "\\Delta", display: "Δ" },
      { latex: "\\Theta", display: "Θ" },
      { latex: "\\Sigma", display: "Σ" },
      { latex: "\\Omega", display: "Ω" },
    ],
  },
  {
    id: "operators",
    label: "Operators",
    symbols: [
      { latex: "\\sum_{}^{}", display: "∑" },
      { latex: "\\prod_{}^{}", display: "∏" },
      { latex: "\\int_{}^{}", display: "∫" },
      { latex: "\\iint", display: "∬" },
      { latex: "\\oint", display: "∮" },
      { latex: "\\lim_{}", display: "lim" },
      { latex: "\\log", display: "log" },
      { latex: "\\ln", display: "ln" },
      { latex: "\\sin", display: "sin" },
      { latex: "\\cos", display: "cos" },
      { latex: "\\tan", display: "tan" },
      { latex: "\\exp", display: "exp" },
      { latex: "\\max", display: "max" },
      { latex: "\\min", display: "min" },
      { latex: "\\mod", display: "mod" },
      { latex: "\\arg", display: "arg" },
    ],
  },
  {
    id: "relations",
    label: "Relations & arrows",
    symbols: [
      { latex: "\\to", display: "→" },
      { latex: "\\leftarrow", display: "←" },
      { latex: "\\Leftrightarrow", display: "⇔" },
      { latex: "\\Rightarrow", display: "⇒" },
      { latex: "\\in", display: "∈" },
      { latex: "\\notin", display: "∉" },
      { latex: "\\subset", display: "⊂" },
      { latex: "\\supset", display: "⊃" },
      { latex: "\\subseteq", display: "⊆" },
      { latex: "\\cup", display: "∪" },
      { latex: "\\cap", display: "∩" },
      { latex: "\\emptyset", display: "∅" },
      { latex: "\\mathbb{R}", display: "ℝ" },
      { latex: "\\mathbb{N}", display: "ℕ" },
      { latex: "\\propto", display: "∝" },
      { latex: "\\mid", display: "|" },
    ],
  },
  {
    id: "brackets",
    label: "Brackets",
    symbols: [
      { latex: "(", display: "(" },
      { latex: ")", display: ")" },
      { latex: "[", display: "[" },
      { latex: "]", display: "]" },
      { latex: "\\{", display: "{" },
      { latex: "\\}", display: "}" },
      { latex: "\\left(\\right)", display: "( )" },
      { latex: "\\left[\\right]", display: "[ ]" },
      { latex: "\\left|\\right|", display: "| |" },
      { latex: "\\langle\\rangle", display: "⟨⟩" },
      { latex: "\\lfloor\\rfloor", display: "⌊⌋" },
      { latex: "\\lceil\\rceil", display: "⌈⌉" },
    ],
  },
  {
    id: "structure",
    label: "Structure",
    symbols: [
      { latex: "\\frac{a}{b}", display: "a/b" },
      { latex: "\\sqrt{x}", display: "√x" },
      { latex: "x^{n}", display: "xⁿ" },
      { latex: "x_{n}", display: "xₙ" },
      { latex: "\\overline{x}", display: "x̄" },
      { latex: "\\hat{x}", display: "x̂" },
      { latex: "\\vec{x}", display: "x⃗" },
      { latex: "\\dot{x}", display: "ẋ" },
      { latex: "\\bar{x}", display: "x̄" },
      { latex: "\\partial", display: "∂" },
      { latex: "\\nabla", display: "∇" },
      { latex: "\\deg", display: "°" },
    ],
  },
];

/** Insert a symbol into a LaTeX string at the cursor position. */
export function insertLatex(existing: string, cursor: number, token: string): { latex: string; cursor: number } {
  const latex = existing.slice(0, cursor) + token + existing.slice(cursor);
  return { latex, cursor: cursor + token.length };
}

export interface FormulaTemplate {
  id: string;
  label: string;
  latex: string;
}

export const FORMULA_TEMPLATES: FormulaTemplate[] = [
  { id: "quadratic", label: "Quadratic formula", latex: "x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}" },
  { id: "pythagoras", label: "Pythagoras", latex: "a^2 + b^2 = c^2" },
  { id: "area-circle", label: "Area of circle", latex: "A = \\pi r^2" },
  { id: "euler", label: "Euler's identity", latex: "e^{i\\pi} + 1 = 0" },
  { id: "integration", label: "Definite integral", latex: "\\int_{a}^{b} f(x)\\,dx" },
  { id: "summation", label: "Summation", latex: "\\sum_{i=1}^{n} x_i" },
  { id: "derivative", label: "Derivative", latex: "\\frac{d}{dx} f(x) = \\lim_{h\\to 0}\\frac{f(x+h)-f(x)}{h}" },
  { id: "slope", label: "Slope", latex: "m = \\frac{y_2 - y_1}{x_2 - x_1}" },
  { id: "distance", label: "Distance formula", latex: "d = \\sqrt{(x_2-x_1)^2 + (y_2-y_1)^2}" },
  { id: "compound", label: "Compound interest", latex: "A = P\\left(1+\\frac{r}{n}\\right)^{nt}" },
  { id: "statistics", label: "Mean", latex: "\\bar{x} = \\frac{1}{n}\\sum_{i=1}^{n} x_i" },
  { id: "physics", label: "Newton's 2nd law", latex: "F = m\\cdot a" },
];

export const toolsCatalog = [
  {
    slug: "etf-premium",
    name: "ETF Premium / Discount Scanner",
    description: "Compare ETF market price with NAV and see premium or discount as a percentage.",
    category: "Markets",
    route: "/tools/etf-premium",
    status: "in-development",
    featured: true,
  },
  {
    slug: "etf-comparison",
    name: "ETF Comparison",
    description: "Place two or more ETFs side by side on cost, structure, and stated objective.",
    category: "Markets",
    route: "/tools/etf-comparison",
    status: "in-development",
    featured: true,
  },
  {
    slug: "mf-comparison",
    name: "Mutual Fund Comparison",
    description: "A structured comparison view for mutual funds — not a recommendation engine.",
    category: "Markets",
    route: "/tools/mf-comparison",
    status: "in-development",
    featured: true,
  },
  {
    slug: "xirr",
    name: "XIRR Calculator",
    description: "Calculate extended internal rate of return from irregular cash flows.",
    category: "Finance",
    route: "/tools/xirr",
    status: "in-development",
    featured: true,
  },
  {
    slug: "sip",
    name: "SIP Calculator",
    description: "Project systematic investment results from amount, tenure, and assumed return.",
    category: "Finance",
    route: "/tools/sip",
    status: "planned",
    featured: false,
  },
  {
    slug: "cagr",
    name: "CAGR Calculator",
    description: "Compound annual growth rate from a start value, end value, and period.",
    category: "Finance",
    route: "/tools/cagr",
    status: "planned",
    featured: false,
  },
  {
    slug: "expense-ratio",
    name: "Expense Ratio Impact",
    description: "See how annual costs compound against an assumed return over time.",
    category: "Finance",
    route: "/tools/expense-ratio",
    status: "planned",
    featured: false,
  },
];

export const featuredTools = toolsCatalog.filter((tool) => tool.featured);

export function getToolBySlug(slug) {
  return toolsCatalog.find((tool) => tool.slug === slug);
}

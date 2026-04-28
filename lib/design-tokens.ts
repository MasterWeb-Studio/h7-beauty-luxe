// Bu dosya scaffolder tarafından üretilir — elle düzenleme.
export const designTokens = {
  "colors": {
    "primary": "#6B1F2E",
    "secondary": "#2A1518",
    "accent": "#C9A87C",
    "background": "#FAF3F0",
    "foreground": "#1F1416",
    "muted": "#8A6F73",
    "border": "#E8D5D0"
  },
  "typography": {
    "headingFont": "Fraunces",
    "bodyFont": "Inter",
    "headingWeight": 400,
    "bodyWeight": 400,
    "scale": "spacious"
  },
  "layout": {
    "style": "editorial",
    "radius": "sm",
    "density": "airy",
    "containerWidth": "normal"
  },
  "mood": [
    "refined",
    "luxurious",
    "feminine",
    "editorial",
    "warm"
  ]
} as const;

export type DesignTokensShape = typeof designTokens;

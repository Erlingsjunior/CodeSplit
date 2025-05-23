{
  "extends": [
    "next/core-web-vitals"
  ],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "warn",
    "react-hooks/exhaustive-deps": "warn",
    "prefer-const": "error",
    "no-var": "error"
  },
  "overrides": [
    {
      "files": ["**/*.stories.*"],
      "rules": {
        "import/no-anonymous-default-export": "off"
      }
    }
  ]
}
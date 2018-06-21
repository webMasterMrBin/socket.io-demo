module.exports = {
  "extends": ["eslint:recommended", "plugin:react/recommended", "prettier"],
  "parser": "babel-eslint",
  "plugins": ["prettier"],
  "env": {
    "node": true,
    "browser": true,
    "es6": true
  },
  "globals": {
    "React": true,
    "ReactDOM": true,
    "_": true,
    "IcoPath": true,
    "i18n": true,
    "moment": true
  },
  "settings": {
    "import/resolver": {
      "node": {
        "moduleDirectory": ["node_modules", "public_v2/src/js"]
      }
    },
    "import/core-modules": ["redux-form", "react", "react-router", "i18n"]
  },
  "rules": {
    "react/prop-types": "warn",
    "prettier/prettier": "error"
  },
  "parserOptions": {
    "ecmaVersion": 6,
    "sourceType": "module"
  }
}

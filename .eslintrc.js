module.exports = {
  extends: [
    "@cybozu",
    "@cybozu/eslint-config/globals/kintone",
  ],
  globals: {
    "kintoneUIComponent": false,
    "KintoneConfigHelper": false,
  },
  rules: {
    "indent": [
      "warn", 2, { SwitchCase: 1 }],
    "no-console": 1,
  },
  env: {
    "jquery": true,
  },
};

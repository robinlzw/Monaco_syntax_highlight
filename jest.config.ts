module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
    '^.+\\.jsx?$': 'babel-jest',  // 添加这一行
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  // globals: {
  //   "ts-jest": {
  //     isolatedModules: true,
  //   },
  // },
  // transformIgnorePatterns: [
  //   "node_modules\/(?!(monaco-editor|monaco-editor-core)\/)"
  // ]
  transformIgnorePatterns: [ 
    "/node_modules/(?!monaco-editor).+\\.js$"
  ]
  
};

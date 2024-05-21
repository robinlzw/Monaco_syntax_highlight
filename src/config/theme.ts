

const theme = {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'keyword', foreground: '569CD6' }, // 蓝色
      { token: 'keyword.type', foreground: '4EC9B0' }, // 青色
      { token: 'identifier', foreground: 'D4D4D4' }, // 灰色
      { token: 'type.identifier', foreground: '4EC9B0' }, // 浅青色
      { token: 'operator', foreground: 'D4D4D4' }, // 灰色
      { token: 'number', foreground: 'B5CEA8' }, // 绿色
      { token: 'string', foreground: 'CE9178' }, // 棕色
      { token: 'comment', foreground: '6A9955', fontStyle: 'italic' }, // 绿色斜体
      { token: 'delimiter', foreground: 'D4D4D4' }, // 灰色
      { token: 'delimiter.curly', foreground: '569CD6' }, // 蓝色
      { token: 'delimiter.square', foreground: '569CD6' }, // 蓝色
      { token: 'delimiter.parenthesis', foreground: '569CD6' }, // 蓝色
      { token: 'delimiter.angle', foreground: '569CD6' }, // 蓝色
  ],
  colors: {
      'editor.foreground': '#D4D4D4',
      'editor.background': '#1E1E1E',
      'editorCursor.foreground': '#AEAFAD',
      'editor.lineHighlightBackground': '#2B2B2B',
      'editorLineNumber.foreground': '#858585',
      'editor.selectionBackground': '#264F78',
      'editor.inactiveSelectionBackground': '#3A3D41',
  }
}
export default theme
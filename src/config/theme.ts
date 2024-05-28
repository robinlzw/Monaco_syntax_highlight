

const theme = {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'annotation', foreground: 'C586C0' },
      // { token: 'keyword', foreground: '569CD6' }, // 蓝色
      // { token: 'keyword.type', foreground: '4EC9B0' }, // 青色
      // { token: 'identifier', foreground: 'D4D4D4' }, // 灰色
      // { token: 'type.identifier', foreground: '4EC9B0' }, // 浅青色
      { token: 'operator', foreground: 'D4D4D4' }, // 灰色
      { token: 'number', foreground: 'B5CEA8' }, // 绿色
      { token: 'string', foreground: 'CE9178' }, // 棕色
      { token: 'comment', foreground: '6A9955', fontStyle: 'italic' }, // 绿色斜体
      // { token: 'delimiter', foreground: 'D4D4D4' }, // 灰色
      // { token: 'delimiter.curly', foreground: '569CD6' }, // 蓝色
      // { token: 'delimiter.square', foreground: '569CD6' }, // 蓝色
      // { token: 'delimiter.parenthesis', foreground: '569CD6' }, // 蓝色
      // { token: 'delimiter.angle', foreground: '569CD6' }, // 蓝色
      { token: 'namespace.lending', foreground: 'B5CEA8' },
      { token: 'namespace.lastModName', foreground: '569CD6', fontStyle: 'italic' },

      // { token: 'string.*.invalid', foreground: 'ff0000', fontStyle: 'italic' }, // red
      { token: 'keyword.module', foreground: '569CD6' }, // 蓝色
      { token: 'keyword.use', foreground: '569CD6' }, // 蓝色
      { token: 'keyword.const', foreground: '569CD6' }, // 蓝色
      { token: 'keyword.struct', foreground: '569CD6' }, // 蓝色
      { token: 'keyword.fun', foreground: '569CD6' }, // 蓝色
      { token: 'type.struct.identifier', foreground: '569CD6' }, // 蓝色

      // { token: 'type.identifier', foreground: 'ff0000' }, // red
      { token: 'type.identifier.struct_field_ty', foreground: '4EC9B0' }, // 浅青色

      // { token: 'type.use_brace.item.identifier', foreground: 'ff0000' }, // red
      { token: 'visibility', foreground: '569CD6' }, // 蓝色
      { token: 'property', foreground: 'EF479A' }, // 玫红色
      { token: 'abilities', foreground: 'c44dff' },
      { token: 'fun-name', foreground: '00ff99', fontStyle: 'italic' },
      // { token: 'para-name', foreground: 'ff0000' }, // red
      { token: 'para-type', foreground: '4EC9B0' }, // 浅青色
      { token: 'type.generic', foreground: '4EC9B0' }, // 浅青色
      { token: 'type.primitive', foreground: '4EC9B0' },// 青色
      { token: 'fun-ret-type', foreground: '4EC9B0' },// 青色

      // { token: 'constant', foreground: 'ff0000' }, // red
      // { token: 'identifier', foreground: 'ff0000' }, // red
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
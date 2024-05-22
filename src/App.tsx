import { memo, useEffect, useRef } from 'react';
import Editor, { Monaco } from '@monaco-editor/react';
import Rules from './config/rules'
import theme from './config/theme'
import testCode from './config/test-code'
const MonacoEditor = memo(() => {
  const monaco = useRef<any>()
  const options: any = {
    selectOnLineNumbers: true,
    cursorStyle: 'line',
    fontFamily: 'Fira Code',
    automaticLayout: true,
    scrollBeyondLastLine: true,
    lineNumbersMinChars: 5,
    letterSpacing:0.3 , //字间距
    // language == 'mylang' ? 'mylang-theme' : 
   theme: 'move-theme' ,
    hideCursorInOverviewRuler: true,
    cursorBlinking:'expand', // 光标����动画
    mouseWheelZoom: true, // ��标滚轮放大缩小
    // readOnly: true,
    wordWrap: 'on',
    fontSize:14,
    lineHeight: 25,
    scrollbar: {
      useShadows: false,
      vertical: 'visible',
      horizontal: 'visible',
      horizontalSliderSize: 5,
      verticalSliderSize: 5,
      horizontalScrollbarSize: 5,
      verticalScrollbarSize: 5
    },
    minimap: { // 小地图
      enabled: true,
    },
    tabCompletion:true,
    lightbulb: true, 
    renderLineHighlight: true,
    hover: {
      /**
     * 启用悬停 Defaults to true.
     */
    enabled: true,
    /**
     * 悬停显示延迟时间 Defaults to 300.
     */
    delay: 200,
    /**
     * 悬停是否具有便签，以便可以单击它并选择其内容 Defaults to true.
     */
    sticky: true,
  },
    autoIndent: true, // 自动布局
    colorDecorators:true,
    formatOnType: true,
    formatOnPaste: true,
    formatOnSave: true,
  }

  const handleEditorDidMount = (editor: any,monacos:Monaco) => {
    // editorRef.current = editor;
    monaco.current = monacos;
    monaco.current.languages.register({ id: 'move' });
    monaco.current.languages.setMonarchTokensProvider('move', Rules)
    monaco.current.editor.defineTheme('move-theme', theme);
    monaco.current.editor.setTheme('move-theme');
  }
  useEffect(()=>{

  },[])
  return (
<Editor
      width="100vw"
      height="100vh"
      language={'move'}
      value={testCode}
      theme="vs-dark"
      options={options}
      onMount={handleEditorDidMount}
    />
  )
})

export default MonacoEditor;


import { memo, useEffect, useRef } from 'react';
import Editor, { Monaco } from '@monaco-editor/react';
import {rules as Rules,semanticTokensLegend} from './config/rules'
import theme from './config/theme'
import testCode from './config/test-code'
import {testRule} from  './test/move/move_test'
import { testTokenization } from './test/testRunner'
const MonacoEditor = memo(() => {
  const monaco = useRef<Monaco>()
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
    monaco.current.languages.setMonarchTokensProvider('move', Rules as any) 
    monaco.current.languages.setLanguageConfiguration('move', {
      comments: {
        lineComment: '//',
        blockComment: ['/*', '*/'],
      },
      brackets: [
        ['{', '}'],
        ['[', ']'],
        ['(', ')'],
      ],
      autoClosingPairs: [
        { open: '[', close: ']' },
        { open: '{', close: '}' },
        { open: '(', close: ')' },
        { open: '"', close: '"', notIn: ['string'] },
      ],
      surroundingPairs: [
        { open: '{', close: '}' },
        { open: '[', close: ']' },
        { open: '(', close: ')' },
        { open: '"', close: '"' },
        { open: '\'', close: '\'' },
      ],
      folding: {
        markers: {
          start: new RegExp('^\\s*#pragma\\s+region\\b'),
          end: new RegExp('^\\s*#pragma\\s+endregion\\b'),
        },
      },
    })
    monaco.current.editor.defineTheme('move-theme', theme as any);
    monaco.current.languages.registerDocumentSemanticTokensProvider('move', {
      getLegend: ()=>semanticTokensLegend,
      provideDocumentSemanticTokens: (model) => {
        const lines = model.getLinesContent();
        const tokens:any = [];
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
          const match = line.match(/common/g);
          if (match) {
            match.forEach((m) => {
              const startIndex = line.indexOf(m);
              tokens.push({
                line: i,
                startChar: startIndex,
                length: m.length,
                tokenType: 2, // 'keyword'
                tokenModifiers: 0,
              });
            });
          }
        }

        const data = new Uint32Array(tokens.length * 5);
        for (let i = 0; i < tokens.length; i++) {
          const token = tokens[i];
          data[i * 5] = token.line;
          data[i * 5 + 1] = token.startChar;
          data[i * 5 + 2] = token.length;
          data[i * 5 + 3] = token.tokenType;
          data[i * 5 + 4] = token.tokenModifiers;
        }

        return {
          data,
        };
      },
      releaseDocumentSemanticTokens: (resultId) => {
        // 这是一个空方法，你可以不实现具体逻辑
    }
    });
    monaco.current.editor.setTheme('move-theme');
  }
  useEffect(()=>{

  },[])
  const hanldTest = ()=>{
    testTokenization('move',testRule)
  }
  return (
<>
<div style={{display:'flex',justifyContent:'center',alignItems:'center',height:'100vh',flexDirection:'column'}}>
  <button style={{flex:1}} onClick={hanldTest}>测试</button>
<Editor
      width="100vw"
      height="90vh"
      language={'move'}
      value={testCode}
      theme="vs-dark"
      options={options}
      onMount={handleEditorDidMount}
    />
</div>
</>
  )
})

export default MonacoEditor;


 const rules = {
    keywords: [
        'module', 'struct', 'resource', 'fun', 'public', 'move', 'copy', 'let',
        'if', 'else', 'return', 'true', 'false', 'script', 'use', 'has', 'acquires'
    ],
    typeKeywords: [
        'u8', 'u16', 'u32', 'u64', 'u128', 'u256', 'address', 'bool', 'signer'
    ],
    operators: [
        '=', '==', '!=', '<', '<=', '>', '>=', '+', '-', '*', '/', '%', '!', '&&', '||'
    ],
    symbols: /[=><!~?:&|+\-*\/\^%]+/,
    brackets: [
        { open: '{', close: '}', token: 'delimiter.curly' },
        { open: '[', close: ']', token: 'delimiter.square' },
        { open: '(', close: ')', token: 'delimiter.parenthesis' },
        { open: '<', close: '>', token: 'delimiter.angle' }
    ],
    tokenizer: {
        root: [
            [/[a-z_$][\w$]*/, {
                cases: {
                    '@keywords': 'keyword',
                    '@typeKeywords': 'keyword.type',
                    '@default': 'identifier'
                }
            }],
            [/[A-Z][\w\$]*/, 'type.identifier'],
            { include: '@whitespace' },
            [/[{}()\[\]]/, '@brackets'],
            [/<[<>]?/, '@brackets'],
            [/@symbols/, {
                cases: {
                    '@operators': 'operator',
                    '@default': ''
                }
            }],
            [/\d*\.\d+([eE][\-+]?\d+)?/, 'number.float'],
            [/0[xX][0-9a-fA-F]+/, 'number.hex'],
            [/\d+/, 'number'],
            [/[;,.]/, 'delimiter'],
            [/"([^"\\]|\\.)*$/, 'string.invalid'],
            [/"/, 'string', '@string'],
            [/'[^\\']'/, 'string'],
            [/'/, 'string.invalid'],
        ],
        comment: [
            [/[^/*]+/, 'comment'],
            [/\*\//, 'comment', '@pop'],
            [/[\/*]/, 'comment']
        ],
        string: [
            [/[^\\"]+/, 'string'],
            [/"/, 'string', '@pop'],
            [/\\./, 'string.escape']
        ],
        whitespace: [
            [/[ \t\r\n]+/, ''],
            [/\/\*\*(?!\/)/, 'comment.doc', '@comment'],
            [/\/\*/, 'comment', '@comment'],
            [/\/\/.*$/, 'comment']
        ],}
      
    }
    export default rules
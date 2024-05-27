import { languages } from 'monaco-editor';

export const rules = {
	tokenPostfix: '.move',
	defaultToken: 'invalid',
	keywords: [
		'address', 'module', 'struct', 'resource', 'fun', 'public', 'move', 'const',
		'if', 'else', 'return', 'script', 'use', 'match', 'while', 'loop', 'mut', 'assert',
		'spec', 'enum', 'for', 'friend', 'native', 'invariant', 'copy', 'drop', 'continue',
		'break', 'abort',
	],

	property: ['has', 'let', 'as', 'acquires'],

	type_primitive: [
		'u8', 'u16', 'u32', 'u64', 'u128', 'u256', 'address', 'bool', 'signer'
	],

	constants: ['true', 'false', 'Some', 'None', 'Left', 'Right', 'Ok', 'Err'],

	operators: [
		'!', '!=', '%', '%=', '&', '&=', '&&', '*', '*=', '+', '+=', '-', '-=',
		'->', '.', '..', '...', '/', '/=', ':', ';', '<<', '<<=', '<', '<=', '=',
		'==', '=>', '>', '>=', '>>', '>>=', '@', '^', '^=', '|', '|=', '||', '_', '?', '#'
	],

	// we include these common regular expressions
	// symbols: /[=><!~?,:&|+\-*\/\^%]+/,
	symbols: /[=><!~?,:&|+\-*\/\^%._#;@]+/,

	escapes: /\\([nrt0\"''\\]|x\h{2}|u\{\h{1,6}\})/,
	intSuffixes: /[iu](8|16|32|64|128|size)/,
	floatSuffixes: /f(32|64)/,

	brackets: [
		{ open: '{', close: '}', token: 'delimiter.curly' },
		{ open: '[', close: ']', token: 'delimiter.square' },
		{ open: '(', close: ')', token: 'delimiter.parenthesis' },
		{ open: '<', close: '>', token: 'delimiter.angle' }
	],

	tokenizer: {
		root: [
			// Annotations
			[/#\[.*\]/, 'annotation'],
			// Whitespace + comments
			{ include: '@whitespace' },
			// Module declaration
			[/module /, { token: 'keyword.module', next: '@module' }],
			[/\}/, { token: 'delimiter.curly.module', log: 'module $0 in state {$S0; $S1; $S2}'}],
		],

		whitespace: [
			// [/[ \t\r\n]+/, 'white'],
			[/[ \t\r\n]+/, ''],
			[/\/\*/, 'comment', '@comment'],
			[/\/\/.*$/, 'comment']
		],

		comment: [
			[/[^\/*]+/, 'comment'],
			[/\/\*/, 'comment', '@push'],
			['\\*/', 'comment', '@pop'],
			[/[\/*]/, 'comment']
		],

		string: [
			[/[^\\"]+/, 'string'],
			[/@escapes/, 'string.escape'],
			[/\\./, 'string.escape.invalid'],
			[/"/, { token: 'string.quote', bracket: '@close', next: '@pop' }]
		],

		stringraw: [
			[/[^"#]+/, { token: 'string' }],
			[/"(#*)/, {
				cases: {
					'$1==$S2': { token: 'string.quote', bracket: '@close', next: '@pop' },
					'@default': { token: 'string' }
				}
			}],
			[/["#]/, { token: 'string' }]
		],

		numbers: [
			// Octal
			[/(0o[0-7_]+)(@intSuffixes)?/, { token: 'number' }],
			// Binary
			[/(0b[0-1_]+)(@intSuffixes)?/, { token: 'number' }],
			// Exponent
			[/[\d][\d_]*(\.[\d][\d_]*)?[eE][+-][\d_]+(@floatSuffixes)?/, { token: 'number' }],
			// Float
			[/\b(\d\.?[\d_]*)(@floatSuffixes)?\b/, { token: 'number' }],
			// Hexadecimal
			[/(0x[\da-fA-F]+)_?(@intSuffixes)?/, { token: 'number' }],
			// Integer
			[/[\d][\d_]*(@intSuffixes?)?/, { token: 'number' }]
		],

		// process module >>
		module: [
			// Module name with namespace
			[/([a-zA-Z_$][\w$]*::)+/, { token: 'namespace.lending', next: '@lastModName' }],
			// Whitespace + comments
			{ include: '@whitespace' },
			[/\}/, { token: 'rematch', next: '@pop' }],
		],
		lastModName: [
			[/[a-zA-Z_$][\w$]*/, { token: 'namespace.lastModName', log: 'lastModName = $0'}],
			[/\s+{/, { token: 'delimiter.curly', next: '@moduleBody' }],
			[/\}/, { token: 'rematch', next: '@pop' }],
		],
		moduleBody: [
			// use_statement
			[/use /, { token: 'keyword.use', next: '@use_statement' }],
			// 匹配 const 关键字
			[/const /, { token: 'keyword.const', next: '@const_statement' }],
			// 匹配 struct
			[/\bstruct\b/, { token: 'keyword.struct', next: '@struct_def' }],
			// 匹配 fun
			[/\bfun\b/, { token: 'keyword.fun', next: '@fun_declaration' }],

			// Annotations
			[/#\[.*\]/, 'annotation'],
			// Whitespace + comments
			{ include: '@whitespace' },

			[/[a-zA-Z_$][\w$]*/, {
				cases: {
					'@keywords': 'keyword',
					'@default': 'normal_code'
				}
			}],
			[/\}/, { token: 'delimiter.curly.in.modulebody', log: 'moduleBody mmet RBrace, change to checkForNewModule', next: '@checkForNewModule' }],
		],
		checkForNewModule: [
			// 忽略空白字符
			[/\s+/, { token: 'white' }],
			// 如果遇到 module 关键字，返回 module 状态并继续解析
			[/module /, { token: 'keyword.module', next: '@module' }],

			[/\}/, { token: '@rematch', next: '@root' }],

			// 其他情况返回 moduleBody 继续处理
			[/.*/, { token: '@rematch', next: '@moduleBody' }]
		],
		// process module <<

		// process use_statement >>
		use_statement: [
			/* 3cases
			use sui::coin::Coin;
			use sui::sui::SUI;
			use a::shapes::{Rectangle, Square};
			 */
			[/([a-zA-Z_$][\w$]*::)+/, { token: 'namespace.lending', next: '@use_items' }],
			// Whitespace + comments
			{ include: '@whitespace' },
			[/;/, { token: 'symbol.semicolon', next: '@pop' }],
			// Strings
			[/"/, { token: 'string.quote', bracket: '@open', next: '@string' }],
			{ include: '@numbers' },

			// 2024move >>
			// eg: use fun into_box as Rectangle.into_box;
			[/([A-Z_$][\w$]*)(\.)([a-zA-Z_$][\w$]*)/, 
				['type.struct.identifier', 'call.dot', 'fun_name']
			],
			[/[a-zA-Z_$][\w$]*/, {
				cases: {
					'@keywords': 'keyword',
					'@property': 'property',
					'@default': 'normal_code'
				}
			}],
			// 2024move <<
		],
		use_items: [
			// Match a single identifier (case 1 and 2)
			[/[a-zA-Z_$][\w$]*/, { token: 'type.identifier', next: '@pop' }],

			// Match multiple identifiers within curly braces (case 3)
			[/\{/, { token: 'delimiter.curly', next: '@use_item_list' }],

			// End of the identifier list
			[/\}/, { token: 'delimiter.curly', next: '@pop' }],

			// Whitespace + comments
			{ include: '@whitespace' },
		],
		use_item_list: [
			// Match individual identifiers within the list
			[/[a-zA-Z_$][\w$]*/, { token: 'type.use_brace.item.identifier' }],

			// Match commas separating identifiers
			[/,/, { token: 'delimiter.comma' }],

			// End of the identifier list
			[/\}/, { token: '@rematch', next: '@pop' }],

			// Whitespace + comments
			{ include: '@whitespace' },
		],
		// process use_statement <<

		// process const_statement >>
		const_statement: [
			// 匹配标识符
			[/[A-Z][\w\$]*/, 'identifier'],  // to show class names nicely
			// 匹配基本类型关键字
			[/[a-zA-Z_$][\w$]*/, {
				cases: {
					'@type_primitive': 'type.primitive',
					'@default': 'const component'
				}
			}],
			[/;/, { token: 'symbol', next: '@pop' }],
			// Whitespace + comments
			{ include: '@whitespace' },
			[/[:=]/, 'symbol'],
			{ include: '@numbers' },
			// Strings
			[/"([^"\\]|\\.)*$/, 'string.invalid'],
			[/"/, { token: 'string.quote', bracket: '@open', next: '@string' }],
		],
		// process const_statement <<

		// process struct >>
		struct_def: [
			[/[A-Z][\w\$]*/, 'type.identifier.struct_name'],
			[/[a-zA-Z_$][\w$]*/, {
				cases: {
					'@property': 'property',
					'@default': 'abilities'
				}
			}],
			// Match commas separating identifiers
			[/,/, { token: 'delimiter.comma' }],
			[/\s+{/, { token: 'delimiter.curly', next: '@struct_body' }],
			[/\}/, { token: '@rematch', log: 'end struct_def $0 in state {$S0; $S1; $S2}', next: '@pop' }],

			// Whitespace + comments
			{ include: '@whitespace' },
		],
		struct_body: [
			// Match end of struct
			[/\}/, { token: '@rematch', next: '@pop' }],

			// 匹配结构体字段
			[/([a-zA-Z_]\w*)(:)/, [
				'field_name',
				'delimiter.colon'
			]],
			[/[a-zA-Z_]\w*/, { token: 'type.identifier.struct_field_ty', log: 'found field_type $0 in state {$S0; $S1; $S2}' },],
			[/[<>](?!@symbols)/, '@brackets'],
			[/[<>]/, 'delimiter.angle'],
			[/[:,]/, 'delimiter.comma'],
			// Whitespace + comments
			{ include: '@whitespace' },
		],
		fieldType: [
			[/[a-zA-Z_$][\w$]*(<[\w$, ]+>)?/, {
				cases: {
					'@type_primitive': 'type.primitive',
					'@default': 'type.identifier.struct_field_ty'
				}
			}],
		],
		visibility: [
			// Match visibility keyword
			[/\b(public)\b/, { token: 'visibility' }],
			// If not present, return to root
			['', '', '@pop']
		],
		abilities: [
			// Match abilities keyword
			[/\b(has)\b\s+([a-zA-Z_$][\w$, ]*)\s*/, [
				{ token: 'keyword.ability' },
				{ token: 'ability.identifier' },
			]],
			// If not present, return to root
			['', '', '@pop']
		],
		// process struct <<

		// process fun >>
		fun_declaration: [
			// 匹配函数名 without generic ty
			[/([a-zA-Z_]\w*)(?!<\s*[a-zA-Z_$][\w$]*\s*>\s*)(\()/, [
				'fun_name',
				{ token: 'delimiter.paren', next: '@fun_parameter_list' }
			]],
			// 匹配函数名 with generic ty
			[/([a-zA-Z_]\w*)(<\s*[a-zA-Z_$][\w$]*\s*>\s*)(\()/, [
				'fun_name',
				'type.generic',
				{ token: 'delimiter.paren', next: '@fun_parameter_list' }
			]],

			[/[a-zA-Z_$][\w$]*/, {
				cases: {
					'@keywords': 'keyword',
					'@default': 'normal_code'
				}
			}],

			// 当匹配到}时，返回到上一个状态或者 `module_body` 状态
			[/\}/, { token: '@rematch', log: 'found $0 in state {$S0; $S1; $S2}', next: '@pop' }],

			[/[<>](?!@symbols)/, '@brackets'],
			// Whitespace + comments
			{ include: '@whitespace' },
		],
		fun_parameter_list: [
			[/\)/, { token: 'delimiter.paren', next: '@fun_ret_ty' }],
			[/([a-zA-Z_]\w*)(:)/, [
				// 'para_name',
				{ token: 'para_name', log: 'found para_name $1 in state $S0' },
				'delimiter.colon'
			]],

			// [/[a-zA-Z_]\w*/, { token: 'para_type', log: 'found para_type<$0> in state $S0' }],
			[/[a-zA-Z_]\w*/, {
				cases: {
					'@keywords': 'keyword',
					'@default': { token: 'para_type', log: 'found para_type<$0> in state $S0' },
					// '@default': 'para_type',
				}
			}],

			[/(@symbols)/, 'fun_parameter_list.symbols'],

			// 当匹配到}时，返回到上一个状态或者 `module_body` 状态
			[/\}/, { token: '@rematch', log: 'found $0 in state {$S0; $S1; $S2}', next: '@pop' }],

			[/[<>](?!@symbols)/, '@brackets'],
			// [/[:,]/, 'delimiter.comma'],
			// Whitespace + comments
			{ include: '@whitespace' },
		],
		fun_ret_ty: [
			[/\{/, { token: 'delimiter.curly', next: '@fun_body' }],
			[/[a-zA-Z_]\w*/, {
				cases: {
					'@keywords': 'keyword',
					'@default': { token: 'fun_ret_type', log: 'found fun_ret_type<$0> in state $S0' },
				}
			}],
			[/(@symbols)/, 'fun_ret_ty.symbols'],

			[/[<>](?!@symbols)/, '@brackets'],

			// 当匹配到}时，返回到上一个状态或者 `module_body` 状态
			[/\}/, { token: '@rematch', log: 'found $0 in state {$S0; $S1; $S2}', next: '@pop' }],

			// Whitespace + comments
			{ include: '@whitespace' },

		],
		fun_body: [
			// token: 'fun_body-$0' 的意思是增加一层tag，用于处理嵌套代码块
			[/\{/, { token: 'fun_body-$0', log: 'found $0 in state {$S0; $S1; $S2}', bracket: '@open', next: '@fun_body.$0' }],
			// 当匹配到}时，返回到上一个状态或者 `module_body` 状态
			[/\}/, {
				cases: {
					'$S2=={': { token: 'delimiter.brace}', log: 'nested found $0 in state {$S0; $S1; $S2}', next: '@pop' },
					'@default': { token: '@rematch', log: 'found $0 in state {$S0; $S1; $S2}', next: '@pop' }
				}
			}],

			// Identifier
			[/\b[A-Z_$][\w$]*\b/, 'type.struct.identifier'],
			[/[a-zA-Z_$][\w$]*/, {
				cases: {
					'@keywords': { token: 'keyword' },
					'@type_primitive': 'type.primitive',
					'@constants': 'constant',
					'@property': 'property',
					'@default': { token: 'identifier' },
				}
			}],

			// call
			[/(\.)([a-zA-Z_$][\w$]*)(\()/, 
				['call.dot', 'fun_name', 'delimiter.paren']
			],
			[/(\::)([a-zA-Z_$][\w$]*)(\()/, 
				['call.double_colon', 'fun_name', 'delimiter.paren']
			],

			// Whitespace + comments
			{ include: '@whitespace' },
			// Symbols and operators
			[/@symbols/, {
				cases: {
					'@operators': 'operator',
					'@default': ''
				}
			}],
			// Brackets
			[/[{}()\[\]]/, '@brackets'],
			// Numbers
			{ include: '@numbers' },
			// Strings
			[/"([^"\\]|\\.)*$/, 'string.invalid'],
			[/"/, { token: 'string.quote', bracket: '@open', next: '@string' }],
		],
		// process fun <<
	}
}

export const semanticTokensLegend: languages.SemanticTokensLegend = {
	tokenTypes: [
		'comment',
		'string',
		'keyword',
		'number',
		'regexp',
		'operator',
		'namespace',
		'type',
		'struct',
		'class',
		'interface',
		'enum',
		'typeParameter',
		'function',
		'member',
		'macro',
		'variable',
		'parameter',
		'property',
		'label',
		'unsupported',
	],
	tokenModifiers: [
		'documentation',
		'declaration',
		'definition',
		'static',
		'abstract',
		'deprecated',
		'readonly',
		'default_library',
		'async',
		'attribute',
		'callable',
		'constant',
		'consuming',
		'controlFlow',
		'crateRoot',
		'injected',
		'intraDocLink',
		'library',
		'mutable',
		'public',
		'reference',
		'trait',
		'unsafe',
	],
};

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type { languages } from '../monaco-editor-core';

// export const rules = {
// 	tokenPostfix: '.move',
// 	defaultToken: 'invalid',
// 	keywords: [
// 		'module', 'struct', 'resource', 'fun', 'public', 'move', 'const', 'let',
// 		'if', 'else', 'return', 'true', 'false', 'script', 'use', 'has', 'acquires', 'match', 'while', 'loop'
// 	],

// 	typeKeywords: [
// 		'u8', 'u16', 'u32', 'u64', 'u128', 'u256', 'address', 'bool', 'signer'
// 	],

// 	constants: ['true', 'false', 'Some', 'None', 'Left', 'Right', 'Ok', 'Err'],

// 	operators: [
// 		'!', '!=', '%', '%=', '&', '&=', '&&', '*', '*=', '+', '+=', '-', '-=',
// 		'->', '.', '..', '...', '/', '/=', ':', ';', '<<', '<<=', '<', '<=', '=',
// 		'==', '=>', '>', '>=', '>>', '>>=', '@', '^', '^=', '|', '|=', '||', '_', '?', '#'
// 	],

// 	escapes: /\\([nrt0\"''\\]|x\h{2}|u\{\h{1,6}\})/,
// 	delimiters: /[,]/,
// 	symbols: /[\#\!\%\&\*\+\-\.\/\:\;\<\=\>\@\^\|_\?]+/,
// 	intSuffixes: /[iu](8|16|32|64|128|size)/,
// 	floatSuffixes: /f(32|64)/,

// 	brackets: [
// 		{ open: '{', close: '}', token: 'delimiter.curly' },
// 		{ open: '[', close: ']', token: 'delimiter.square' },
// 		{ open: '(', close: ')', token: 'delimiter.parenthesis' },
// 		{ open: '<', close: '>', token: 'delimiter.angle' }
// 	],

// 	tokenizer: {
// 		root: [
// 			// Annotations
// 			[/#\[.*\]/, 'annotation'],
// 			// Whitespace + comments
// 			{ include: '@whitespace' },
// 			// Module declaration
// 			[/module/, { token: 'keyword', next: '@module' }],
// 		],

// 		module: [
// 			// Module name with namespace
// 			[/([a-zA-Z_$][\w$]*::)+/, { token: 'namespace.lending', next: '@lastModName' }],
// 			// Whitespace + comments
// 			{ include: '@whitespace' },
// 			// Fallback in case of syntax error
// 			// [/[^\{]+/, { token: 'invalid', next: '@pop' }],
// 		],
// 		lastModName: [
// 			// Module name with namespace
// 			[/[a-zA-Z_$][\w$]/, 'namespace.lastModName'],
// 			// Fallback in case of syntax error
// 			// [/[^\{]+/, { token: 'invalid', next: '@moduleBody' }],
// 			[/\{/, '@push', '@moduleBody'],
// 			// [/\}/, '@popall', '@root'],
// 		],

// 		moduleBody: [
// 			// [/\{/, 'delimiter.curly', '@push'],
// 			// [/\}/, 'delimiter.curly', '@pop'],
// 			// Identifiers and keywords inside module body
// 			[/[a-zA-Z_$][\w$]*/, {
// 				cases: {
// 					'@typeKeywords': 'keyword.type',
// 					'@keywords': 'keyword',
// 					'@constants': 'constant',
// 					'@default': 'identifier'
// 				}
// 			}],
// 			// Designator
// 			[/\$/, 'identifier'],
// 			// Byte literal
// 			[/'(\S|@escapes)'/, 'string.byteliteral'],
// 			// Strings
// 			[/"/, { token: 'string.quote', bracket: '@open', next: '@string' }],
// 			{ include: '@numbers' },
// 			// Annotations
// 			[/#\[.*\]/, 'annotation'],
// 			// Whitespace + comments
// 			{ include: '@whitespace' },
// 			[/[{}()\[\]]/, '@brackets'],
// 			[/[<>](?!@symbols)/, '@brackets'],
// 			[/@symbols/, {
// 				cases: {
// 					'@operators': 'operator',
// 					'@default': ''
// 				}
// 			}]
// 		],

// 		whitespace: [
// 			[/[ \t\r\n]+/, 'white'],
// 			[/\/\*/, 'comment', '@comment'],
// 			[/\/\/.*$/, 'comment']
// 		],

// 		comment: [
// 			[/[^\/*]+/, 'comment'],
// 			[/\/\*/, 'comment', '@push'],
// 			['\\*/', 'comment', '@pop'],
// 			[/[\/*]/, 'comment']
// 		],

// 		string: [
// 			[/[^\\"]+/, 'string'],
// 			[/@escapes/, 'string.escape'],
// 			[/\\./, 'string.escape.invalid'],
// 			[/"/, { token: 'string.quote', bracket: '@close', next: '@pop' }]
// 		],

// 		stringraw: [
// 			[/[^"#]+/, { token: 'string' }],
// 			[/"(#*)/, {
// 				cases: {
// 					'$1==$S2': { token: 'string.quote', bracket: '@close', next: '@pop' },
// 					'@default': { token: 'string' }
// 				}
// 			}],
// 			[/["#]/, { token: 'string' }]
// 		],

// 		numbers: [
// 			// Octal
// 			[/(0o[0-7_]+)(@intSuffixes)?/, { token: 'number' }],
// 			// Binary
// 			[/(0b[0-1_]+)(@intSuffixes)?/, { token: 'number' }],
// 			// Exponent
// 			[/[\d][\d_]*(\.[\d][\d_]*)?[eE][+-][\d_]+(@floatSuffixes)?/, { token: 'number' }],
// 			// Float
// 			[/\b(\d\.?[\d_]*)(@floatSuffixes)?\b/, { token: 'number' }],
// 			// Hexadecimal
// 			[/(0x[\da-fA-F]+)_?(@intSuffixes)?/, { token: 'number' }],
// 			// Integer
// 			[/[\d][\d_]*(@intSuffixes?)?/, { token: 'number' }]
// 		]
// 	}

// }

// export const semanticTokensLegend: languages.SemanticTokensLegend = {
// 	tokenTypes: [
// 		'comment',
// 		'string',
// 		'keyword',
// 		'number',
// 		'regexp',
// 		'operator',
// 		'namespace',
// 		'type',
// 		'struct',
// 		'class',
// 		'interface',
// 		'enum',
// 		'typeParameter',
// 		'function',
// 		'member',
// 		'macro',
// 		'variable',
// 		'parameter',
// 		'property',
// 		'label',
// 		'unsupported',
// 	],
// 	tokenModifiers: [
// 		'documentation',
// 		'declaration',
// 		'definition',
// 		'static',
// 		'abstract',
// 		'deprecated',
// 		'readonly',
// 		'default_library',
// 		'async',
// 		'attribute',
// 		'callable',
// 		'constant',
// 		'consuming',
// 		'controlFlow',
// 		'crateRoot',
// 		'injected',
// 		'intraDocLink',
// 		'library',
// 		'mutable',
// 		'public',
// 		'reference',
// 		'trait',
// 		'unsafe',
// 	],
// };

export const conf: languages.LanguageConfiguration = {
	comments: {
		lineComment: '//',
		blockComment: ['/*', '*/']
	},
	brackets: [
		['{', '}'],
		['[', ']'],
		['(', ')']
	],
	autoClosingPairs: [
		{ open: '[', close: ']' },
		{ open: '{', close: '}' },
		{ open: '(', close: ')' },
		{ open: '"', close: '"', notIn: ['string'] }
	],
	surroundingPairs: [
		{ open: '{', close: '}' },
		{ open: '[', close: ']' },
		{ open: '(', close: ')' },
		{ open: '"', close: '"' },
		{ open: "'", close: "'" }
	],
	folding: {
		markers: {
			start: new RegExp('^\\s*#pragma\\s+region\\b'),
			end: new RegExp('^\\s*#pragma\\s+endregion\\b')
		}
	}
};

export const language = <languages.IMonarchLanguage>{
	tokenPostfix: '.move',
	defaultToken: 'invalid',
	keywords: [
		'module', 'struct', 'resource', 'fun', 'public', 'move', 'const', 'let',
		'if', 'else', 'return', 'true', 'false', 'script', 'use', 'has', 'acquires', 'match', 'while', 'loop'
	],

	typeKeywords: [
		'u8', 'u16', 'u32', 'u64', 'u128', 'u256', 'address', 'bool', 'signer'
	],

	constants: ['true', 'false', 'Some', 'None', 'Left', 'Right', 'Ok', 'Err'],

	operators: [
		'!', '!=', '%', '%=', '&', '&=', '&&', '*', '*=', '+', '+=', '-', '-=',
		'->', '.', '..', '...', '/', '/=', ':', ';', '<<', '<<=', '<', '<=', '=',
		'==', '=>', '>', '>=', '>>', '>>=', '@', '^', '^=', '|', '|=', '||', '_', '?', '#'
	],

	escapes: /\\([nrt0\"''\\]|x\h{2}|u\{\h{1,6}\})/,
	delimiters: /[,]/,
	symbols: /[\#\!\%\&\*\+\-\.\/\:\;\<\=\>\@\^\|_\?]+/,
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
			[/module/, { token: 'keyword', next: '@module' }],
		],

		module: [
			// Module name with namespace
			[/([a-zA-Z_$][\w$]*::)+/, { token: 'namespace.lending', next: '@lastModName' }],
			// Whitespace + comments
			{ include: '@whitespace' },
			// Fallback in case of syntax error
			// [/[^\{]+/, { token: 'invalid', next: '@pop' }],
		],
		lastModName: [
			// Module name with namespace
			[/[a-zA-Z_$][\w$]/, 'namespace.lastModName'],
			// Fallback in case of syntax error
			// [/[^\{]+/, { token: 'invalid', next: '@moduleBody' }],
			[/\{/, '@push', '@moduleBody'],
			// [/\}/, '@popall', '@root'],
		],

		moduleBody: [
			// [/\{/, 'delimiter.curly', '@push'],
			// [/\}/, 'delimiter.curly', '@pop'],
			// Identifiers and keywords inside module body
			[/[a-zA-Z_$][\w$]*/, {
				cases: {
					'@typeKeywords': 'keyword.type',
					'@keywords': 'keyword',
					'@constants': 'constant',
					'@default': 'identifier'
				}
			}],
			// Designator
			[/\$/, 'identifier'],
			// Byte literal
			[/'(\S|@escapes)'/, 'string.byteliteral'],
			// Strings
			[/"/, { token: 'string.quote', bracket: '@open', next: '@string' }],
			{ include: '@numbers' },
			// Annotations
			[/#\[.*\]/, 'annotation'],
			// Whitespace + comments
			{ include: '@whitespace' },
			[/[{}()\[\]]/, '@brackets'],
			[/[<>](?!@symbols)/, '@brackets'],
			[/@symbols/, {
				cases: {
					'@operators': 'operator',
					'@default': ''
				}
			}]
		],

		whitespace: [
			[/[ \t\r\n]+/, 'white'],
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
		]
	}

};
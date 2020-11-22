module.exports = {
	'env': {
		'browser': true,
		'es2021': true
	},
	// 'extends': 'eslint:recommended',
	"extends": [
		"prettier",
		"airbnb-base",
		"eslint"
	  ],
	  "plugins": [
		"prettier"
	  ],
	'parserOptions': {
		'ecmaVersion': 12,
		'sourceType': 'module'
	},
	'rules': {
		'indent': [
			'error',
			'tab'
		],
		'linebreak-style': [
			'error',
			'windows'
		],
		'quotes': [
			'error',
			'single'
		],
		'semi': [
			'error',
			'always'
		],
		"prettier/prettier": "error"
	}
};

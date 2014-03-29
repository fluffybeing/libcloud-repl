
var term, parser;
var output;
var helpPage=[
	'%CS%+r Terminal Help %-r%n',
	'  This is just a sample to demonstrate command line libcloud.',
	' ',
	'  Use one of the following commands:',
	'     clear [-a] .......... clear the terminal',
	'                           option "a" also removes the status line',
	'     number -n<value> .... return value of option "n" (test for options)',
	'     repeat -n<value> .... repeats the first argument n times (another test)',
	'     dump ................ lists all arguments and alphabetic options',
	'     login <username> .... sample login (test for raw mode)',
	'     exit ................ close the terminal (same as <ESC>)',
	'     help ................ show this help page',
	' ',
	'  other input will be echoed to the terminal as a list of parsed arguments',
	'  in the format <argument index> <quoting level> "<parsed value>".',
	' '
];

function termOpen() {
	if (!term || term.losed) {
		term=new Terminal(
			{
				x: 20,
				y: 50,
				cols: 190,
				row: 100,
				termDiv: 'termDiv',
				ps: '>>>',
				initHandler: termInitHandler,
				handler: commandHandler,
				exitHandler: termExitHandler
			}
		);
		if (term) term.open();
		parser=new Parser();


		var mainPane = (document.getElementById)?
			document.getElementById('mainPane') : document.all.mainPane;
		if (mainPane) mainPane.className = 'lh15 dimmed';
	}
	else {
		term.focus();
	}
}

function termExitHandler() {

	var mainPane = (document.getElementById)?
		document.getElementById('mainPane') : document.all.mainPane;
	if (mainPane) mainPane.className = 'lh15';
}

function termInitHandler() {

	this.write(
		[
			this.globals.center('############################################################', 180),
			this.globals.center('#                                                          #', 180),
			this.globals.center('#                 Sample libcloud cli v 1.0                #', 180),
			this.globals.center('#      Input is echoed as a list of parsed arguments.      #', 180),
			this.globals.center('#                                                          #', 180),
			this.globals.center('#      Type "help" for commands.                           #', 180),
			this.globals.center('#                                                          #', 180),
			this.globals.center('#  (c) Python Libcloud 2014; https://libcloud.apache.org/  #', 180),
			this.globals.center('#                                                          #', 180),
			this.globals.center('############################################################', 180),
			'%n'
		]
	);

	this.statusLine('', 8,2);
	this.statusLine(' +++ This is just a dummy cli libcloud. Type "help" for help. +++');
	this.maxLines -= 2;

	this.prompt();
}

function commandHandler() {
	this.newLine();
	// check for raw mode first (should not be parsed)
	if (this.rawMode) {
		if (this.env.getPassword) {
			// sample password handler (lineBuffer == stored username ?)
			if (this.lineBuffer == this.env.username) {
				this.user = this.env.username;
				this.ps = '['+this.user+']>';
				this.type('Welcome '+this.user+', you are now logged on to the system.');
			}
			else {
				this.type('Sorry.');
			}
			this.env.username = '';
			this.env.getPassword = false;
		}
		// leave in normal mode
		this.rawMode = false;
		this.prompt();
		return;
	}

	parser.parseLine(this);
	if (this.argv.length == 0) {
		// no commmand line input
	}
	else if (this.argQL[0]) {
	    // first argument quoted -> error
		this.write("Syntax error: first argument quoted.");
	}
	else {
		var cmd = this.argv[this.argc++];
		/*
		  process commands now
		  1st argument: this.argv[this.argc]
		*/
		switch (cmd) {
			case 'help':
				this.write(helpPage);
				break;
			case 'clear':
				// get options
				var opts = parser.getopt(this, 'aA');
				if (opts.a) {
					// discard status line on opt "a" or "A"
					this.maxLines = this.conf.rows;
				}
				this.clear();
				break;
			case 'number':
				// test for value options
				var opts = parser.getopt(this, 'n');
				if (opts.illegals.length) {
					this.type('illegal option. usage: number -n<value>');
				}
				else if ((opts.n) && (opts.n.value != -1)) {
					this.type('option value: '+opts.n.value);
				}
				else {
					this.type('usage: number -n<value>');
				}
				break;
			case 'repeat':
				// another test for value options
				var opts = parser.getopt(this, 'n');
				if (opts.illegals.length) {
					this.type('illegal option. usage: repeat -n<value> <string>');
				}
				else if ((opts.n) && (opts.n.value != -1)) {
					// first normal argument is again this.argv[this.argc]
					var s = this.argv[this.argc];
					if (typeof s != 'undefined') {
						// repeat this string n times
						var a = [];
						for (var i=0; i<opts.n.value; i++) a[a.length] = s;
						this.type(a.join(' '));
					}
				}
				else {
					this.type('usage: repeat -n<value> <string>');
				}
				break;
			case 'login':
				// sample login (test for raw mode)
				if ((this.argc == this.argv.length) || (this.argv[this.argc] == '')) {
					this.type('usage: login <username>');
				}
				else {
					this.env.getPassword = true;
					this.env.username = this.argv[this.argc];
					this.write('%+iSample login: repeat username as password.%-i%n');
					this.type('password: ');
					// exit in raw mode (blind input)
					this.rawMode = true;
					this.lock = false;
					return;
				}
				break;
			case 'dump':
				var opts = parser.getopt(this, 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
				for (var p in opts) {
					if (p == 'illegals') {
						if (opts.illegals.length) {
							this.type('  illegal options: "'+opts.illegals.join('", "')+'"');
							this.newLine();
						}
					}
					else {
						this.type('  option "'+p+'" value '+opts[p].value);
						this.newLine();
					}
				}
				while (this.argc<this.argv.length) {
					var ql = this.argQL[this.argc] || '-';
					this.type('  argument [QL: '+ql+'] "'+this.argv[this.argc++]+'"');
					this.newLine();
				}
				break;
			case 'exit':
				this.close();
				return;
			default:
				// for test purpose just output argv as list
				// assemble a string of style-escaped lines and output it in more-mode
				var command = this.argv.join(' ');
				/* s=' INDEX  QL  ARGUMENT%n';
				for (var i=0; i<this.argv.length; i++) {
					s += this.globals.stringReplace('%', '%%',
							this.globals.fillLeft(i, 6) +
							this.globals.fillLeft((this.argQL[i])? this.argQL[i]:'-', 4) +
							'  "' + this.argv[i] + '"'
						) + '%n';
				}
				this.write(s, 1); */
				var to_execute = command;
				getOutput(to_execute, callback)
        /*$.getJSON(document.URL + 'repl/',{code: to_execute},
                 function(data) {
										output = data.output;
										//output = output.replace(new RegExp("\\n","g"), '<br/>');
										//alert(output+data.error);
                 });

        			this.write(output, 1);
        		*/



				return;
		}
	}
	this.prompt();
}

function getOutput ( to_execute, callback ) {
		$.ajax({
			type: "GET",
			url : "/repl/",
			data: {"code":to_execute},
			contentType: "application/json; charset=utf-8",
			success: function(result){

				callback(result);

			}
		});
}

function callback(output) {

    if (output) {
       // status 200 OK
       term.write(output.output+"\nError: "+output.error);
    }  else {
       // connection succeeded, but server returned other status than 2xx
       term.write("Server returned: " +  "nothing returned");
    }
    term.prompt();
    return;
}

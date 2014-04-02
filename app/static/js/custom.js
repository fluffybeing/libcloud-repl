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
var to_execute = '';
var send = 0;
var cmd_type = 'terminal';
var EXECUTE = 2;
var MULTIPLE_LINES = 1;
var SINGLE_LINE = 0;
function termOpen() {
	if (!term || term.losed) {
		term=new Terminal(
			{
				x: 20,
				y: 50,
				cols: 100,
				row: 100,
				greeting: "*** Welcome, Type login <your name> to get started ***",
				termDiv: 'termDiv',
				ps: 'libcloud~$',
				initHandler: termInitHandler,
				handler: commandHandler,
				exitHandler: termExitHandler,
				ctrlHandler: myCtrlHandler,
				crsrBlinkMode: true,
				crsrBlockMode: false,
				printTab: true,
				frameWidth: 5,
				bgColor: '#000000',
        frameColor:'#0066ff'
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

function myCtrlHandler() {
    if (this.inputChar == termKey.ETX) {
      // exit on ^C (^C == ASCII 0x03 == <ETX>)
      this.close();
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
			this.globals.center('############################################################', 95),
			this.globals.center('#                                                          #', 95),
			this.globals.center('#                Sample libcloud REPL v 1.0                #', 95),
			this.globals.center('#         Python Shell in Secure sandbox Environment.      #', 95),
			this.globals.center('#                                                          #', 95),
			this.globals.center('#                 Type "help" for commands.                #', 95),
			this.globals.center('#                                                          #', 95),
			this.globals.center('#  (c) Python Libcloud 2014; https://libcloud.apache.org/  #', 95),
			this.globals.center('############################################################', 95),
			'%n'
		]
	);

	this.statusLine('', 8,2);
	this.statusLine(' +++ This is just a dummy libcloud interface. Type "help" for help. +++');
	this.maxLines -= 2;

	this.prompt();
}

function commandHandler() {

	this.newLine();
	var argv = [''];     // arguments vector
	var argQL = ['', '"'];    // quoting level
	var argc = 0;        // arguments cursor
	var escape = true ; // escape flag
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

	if (cmd_type == 'terminal') {
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
				case 'login':
					// sample login (test for raw mode)
					if ((this.argc == this.argv.length) || (this.argv[this.argc] == '')) {
						this.type('usage: login <email>');
					}
					else {
						this.env.getPassword = false;
						this.env.username = this.argv[this.argc];
						this.type('Email: ');
						//if ( valid(this.env.getPassword) ) {
								this.ps = this.env.username + '@libcloud~$';
						//}
						// exit in raw mode (blind input)
						this.rawMode = false;
						this.lock = false;
						return;
					}
					break;
				case 'exit':
					this.close();
				case 'python':
					this.write(['Python 2.7.5 (default, Feb 19 2014, 13:47:28)',
					 					'[GCC 4.8.2 20131212 (Red Hat 4.8.2-7)] on linux2'
										]);
					this.ps = '>>>';
					cmd_type = 'python';
					break;
				default:
					this.write('Not a command');
					this.prompt();
					return;
			}
		}
		this.prompt();
	} else if (cmd_type == 'python'){
		var keywords = ['for', 'class', 'while', 'if', 'else', 'elif'];

		var command = '';
		for (var i=0; i<this.lineBuffer.length; i++) {
			var ch= this.lineBuffer.charAt(i);
			command += ch;
		}

		if (command.length > 0) {
			for (var i = 0; i < keywords.length; i++) {
				if (command.indexOf(keywords[i]) == 0 && command.indexOf(':') == command.length - 1) {
					send = MULTIPLE_LINES;
					this.ps = '...';

					break;
				}
			}
			to_execute += '\n' + command;

			if (send == MULTIPLE_LINES) {
				command = '';
				this.prompt();
			} else {
				send = EXECUTE;
			}

		} else if (command.length == 0 && send == MULTIPLE_LINES) {
			send = EXECUTE;

		}
		if (to_execute.length == 0)
				this.prompt();
		if (send == EXECUTE) {
			getOutput(to_execute, callback);
			to_execute = '';
			this.ps = '>>>';
		}

	}

}

function getOutput ( to_execute, callback ) {
		$.ajax({
			type: "GET",
			url : "/repl/",
			data: {"code":to_execute},
			contentType: "application/x-www-form-urlencoded;charset=UTF-8",
			success: function(result){

				callback(result);

			}
		});
}

function callback(output) {

    if (output) {
       // status 200 OK
       term.write(output.output+output.error);
    }  else {
       // connection succeeded, but server returned other status than 2xx
       term.write("Server returned: " +  "nothing returned");
    }
    term.prompt();
    return;
}
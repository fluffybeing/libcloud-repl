from app import app
from flask import render_template, request, jsonify, session, Markup
#from pypysandbox import exec_sandbox # use pypy sanbox for execution
from pyscriptrunner import runprocess
from Queue import Empty


@app.route('/')
def index():
    return render_template("index.html")


@app.route('/docs/')
@app.route('/docs')
def docs():
    return render_template("base.html")


@app.route('/shell/')
@app.route('/shell')
def shell():
    return render_template("shell.html")


@app.route('/repl/', methods=['GET'])
@app.route('/repl', methods=['GET'])
def execute():
    code = request.args.get("code")

    out = err = result = ''
    # process stdout for beautiful print
    statement = code.replace('\r\n', '\n')

    if (statement):
        #print len(statement)
        result = runprocess(statement)

    try:
        while True:
            try:
                std = result.get(True, 1)
                if std[0] == 'STDOUT':
                    out += std[1]
                else:
                    err += std[1]
            except Empty:
                break
        #print out
    except:
        print "Empty Statement"

    return jsonify(success=1, output=out, error=err)


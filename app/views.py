from app import app
from flask import render_template, request, jsonify, session, Markup
#from pypysandbox import exec_sandbox # use pypy sanbox for execution
from pyscriptrunner import runprocess

@app.route('/')
@app.route('/index')
def index():
    return render_template("index.html")


@app.route('/repl', methods=['GET'])
@app.route('/repl/', methods=['GET'])
def execute():
    code = request.args.get("code")
    # process stdout for beautiful print
    err = "rahul"
    out = runprocess(str(code))
    print out
    return jsonify(success=1, output=out, error=err)

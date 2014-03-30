from app import app
from flask import render_template, request, jsonify, session, Markup
#from script import exec_sandbox
from pyscriptrunner import runprocess

@app.route('/')
@app.route('/index')
def index():
    return render_template("index.html")


@app.route('/repl', methods=['GET'])
@app.route('/repl/', methods=['GET'])
def execute():
    code = request.args.get("code")
    print str(code)
    err = "rahul"
    out = runprocess(str(code))
    print out
    return jsonify(success=1, output=out, error=err)

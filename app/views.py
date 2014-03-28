from app import app
from flask import render_template, request, jsonify, session, Markup
from script import exec_sandbox

@app.route('/')
@app.route('/index')
def index():
    return render_template("index.html")


@app.route('/repl', methods=['GET'])
@app.route('/repl/', methods=['GET'])
def execute():
    code = request.args.get("code")
    print "\n\n\n"
    print "rahul"
    print str(code)
    print "rahul"
    out, err = exec_sandbox(str(code))
    print out, err
    return jsonify(success=1, output=out, error=err)

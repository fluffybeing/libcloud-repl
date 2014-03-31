Apache Libcloud REPL
====================

Libcloud REPL is a project to provide an entirely web based environment for the
instruction, or lightweight use of Apache Libcloud API on Python shell environment with
zero-configuration of the user's machine.

Currently in early development status


Flask APP
=========
libcloud cli is built on python-flask. To setup development environment
follow the instruction.

Use a virtualenv::

    $ pip install virtualenv
    $ mkvirtualenv datagrepper      # set path in your ~/.bashrc
    $ workon datagrepper

Install dependencies::

    $ pip install -r requirements.txt

As your normal old user self, run the development server::

    $ workon libcloudcli
    $ python runserver.py

In a browser, visit http://localhost:5000 to see the docs.

You can quick test that your shell is running by typing some simple commands::
     >>> print "Hi I am Libcloud user"


Features
=========
* ```term.js``` helps in customizing look and feel of shell as the way you want
* Fast code execution using Parallel processing
* Scalable
* Secure

Sandbox
=======

Two way implementation:
* Docker
* PyPy Sandbox

Docker
------
The threat of having a web application hijacked and used for taking over the entire host is a vast and scary one. It has long been a challenge to keep things isolated from one another for enhanced security, especially if the applications belong to different clients.

In order to achieve security against all the problem, we'll use docker container to host our Python web application, finally bootstrapping our build processes with a Dockerfile to fully automate it.

PyPy Sandbox
------------
PyPy offers sandboxing at a level similar to OS-level sandboxing (e.g. SECCOMP on Linux), but implemented in a fully portable way. To use it, a (regular, trusted) program launches a subprocess that is a special sandboxed version of PyPy. This subprocess can run arbitrary untrusted Python code, but all its input/output is serialized to a stdin/stdout pipe instead of being directly performed.

Future
======
* Add text editor
* Robust method tp handle concurrent request
* Security issues

tornado + flask
---------------
It is because Flask is blocking and Tornado is non-blocking. Hence there proper combination will
bring better responsive app.

Also, If one uses Tornado as a WSGI server and Flask for url routing + templates there shouldn't be any overhead.
With this approach you aren't using Flask's web server, so there isn't really an extra layer of abstraction
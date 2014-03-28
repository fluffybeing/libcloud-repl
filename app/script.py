#! /usr/bin/env python

# From http://readevalprint.github.com/blog/python-sandbox-with-pypy-part2.html

import sys, shutil, os, tempfile
from cStringIO import StringIO

TIMEOUT = 5

# I made a ramdisk because it's all temporary and faster then accessing the harddrive itself
# $ sudo mount -t tmpfs -o size=16M tmpfs /tmp/ramdisk/
# $ mkdir /tmp/ramdisk/virtualtmp
#tempfile.tempdir = '/mnt/virtualtmp/'
DIR = '/home/rranjan/virtualtmp/'
# or use this, lame.
# tempfile.tempdir = '/tmp/'


# This is the symlinked dir if you're following the post
# http://readevalprint.github.com/blog/python-sandbox-with-pypy.html
SANDBOX_BIN = '/opt/pypy-sandbox/pypy-c'

sys.path += ['/opt/pypy-sandbox']

# import pypy now that it's added to the path
from pypy.sandbox import pypy_interact
#import libcloud

def exec_sandbox(code):
    try:
        #tmpdir = tempfile.mkdtemp()
        tmpscript = open(os.path.join(DIR, 'sample.py'),'w') # script.py is the name of the code passed in
        tmpscript.write(code)
        tmpscript.close()
        sandproc = pypy_interact.PyPySandboxedProc(
            SANDBOX_BIN,
            #['-c', code], # un comment this and comment the next line if you want to run code directly
            ['/tmp/sample.py', '--timeout', str(TIMEOUT),],
            DIR # this is dir we just made that will become /tmp in the sandbox
        )
        try:
            code_output = StringIO()
            code_log = StringIO()
            sandproc.interact(stdout=code_output, stderr=code_log)
            return code_output.getvalue(), code_log.getvalue()
        except Exception, e:
            sandproc.kill()
        finally:
            sandproc.kill()

        shutil.rmtree(tmpdir)
    except Exception, e:
        pass
    return 'Error, could not evaluate', e

code = '''
print 'Hi there!'
from libcloud.storage.drivers.dummy import DummyStorageDriver
driver = DummyStorageDriver('key', 'secret')
container = driver.create_container(container_name='test container')
container
'''
#out, err = exec_sandbox(code)
#print '=' *10
#print 'OUTPUT\n%s' % out
#print '=' *10
#print 'ERRORS\n%s' % err

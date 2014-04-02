from subprocess import Popen, PIPE
from threading import Thread
from Queue import Queue, Empty
from multiprocessing.pool import ThreadPool
import os
import tempfile
import sys
import atexit

# Queue to keep track of stdout
io_q = Queue()
result = Queue()


def stream_watcher(identifier, stream):

    for line in stream:
        io_q.put((identifier, line))
        result.put((identifier, line))

    if not stream.closed:
        stream.close()


def runprocess(code):
    # declare global Popen object
    global proc
    global stdout_list

    stdout_list = list()
    # make a tmp file
    f = tempfile.NamedTemporaryFile(suffix='.py', prefix='sample', delete=False)
    # script.py is the name of the code passed in
    f.write(code)

    proc = Popen(['python', f.name], stdout=PIPE, stderr=PIPE)

    Thread(target=stream_watcher, name='stdout-watcher',
           args=('STDOUT', proc.stdout)).start()
    Thread(target=stream_watcher, name='stderr-watcher',
       	   args=('STDERR', proc.stderr)).start()

    #Thread(target=printer, name='printer').start()
    # for killing the process but not necessary for now
    #atexit.register(proc.kill)
    f.close()
    '''
    while True:
	try:
	    stdout_list.append(result.get(True, 1))
	except Empty:
	    break
    return stdout_list
    '''
    return result


def printer():

    # save stdout & stdin in list

    while True:
        try:
            # Block for 1 second.
            item = io_q.get(True, 1)
	    #print item[0] + ':' + item[1].strip('\n')
	    #print item
        except Empty:
            # No output in either streams for a second. Are we done? yes
            if proc.poll() is not None:
                break
        else:
            identifier, line = item
	    #print identifier + ':', line

    #print stdout_list

'''
if __name__ == '__main__':
    code =
print "hello"
print 1+2
M

    print runprocess(code)
'''

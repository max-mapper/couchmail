# -*- coding: utf-8 -*-

import sys
import mailbox
import email
import quopri
from BeautifulSoup import BeautifulSoup
import dateutil.parser as parser # pip install python-dateutil==1.5 for python2.6

try:
    import jsonlib2 as json  # much faster then Python 2.6.x's stdlib
except ImportError:
    import json

MBOX = sys.argv[1]

def cleanContent(msg):

    # Decode message from "quoted printable" format

    msg = quopri.decodestring(msg)

    # Strip out HTML tags, if any are present

    soup = BeautifulSoup(msg)
    return ''.join(soup.findAll(text=True))


def jsonifyMessage(msg):
    headers = {}
    for (k, v) in msg.items():
      	k = k.lower()
        v = v.decode('utf-8', 'ignore')
        headers[k] = [v]
        if k == "date":
      	    date = parser.parse(v)
            headers['date'] = [date.isoformat()]
    
    json_msg = {'parts': [], 'headers': headers}
    
    try:
        for part in msg.walk():
            if part.get_content_maintype() == 'multipart':
                continue
            json_part = {"headers": {"content-type": []}}
            # TODO store attachments in _attachments key for couchdb upload
            json_part['headers']['content-type'].append(part.get_content_type())
            content = part.get_payload(decode=False).decode('utf-8', 'ignore')
            json_part['bodytext'] = cleanContent(content)
            json_msg['parts'].append(json_part)
    except Exception, e:
        sys.stderr.write('Skipping message - error encountered (%s)' % (str(e), ))
    finally:
        return json_msg

# Note: opening in binary mode is recommended
mbox = mailbox.UnixMailbox(open(MBOX, 'rb'), email.message_from_file)  
json_msgs = []
while 1:
    msg = mbox.next()
    if msg is None:
        break
    json_msgs.append(jsonifyMessage(msg))

print json.dumps(json_msgs, indent=4)
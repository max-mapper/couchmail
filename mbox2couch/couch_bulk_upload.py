# -*- coding: utf-8 -*-

import sys
import os
import couchdb
try:
    import jsonlib2 as json
except ImportError:
    import json

JSON_MBOX = sys.argv[1]  # i.e. enron.mbox.json

server = couchdb.Server('http://localhost:5984')
db = server["couchdb-user-mail"]
docs = json.loads(open(JSON_MBOX).read())
db.update(docs, all_or_nothing=True)
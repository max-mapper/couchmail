# CouchMail CouchApp

Disclaimer: This is currently very experimental. I'm using it as a mailing list archive search engine. Some background:

Once upon a time there was a wonderful group of folks at Mozilla who designed a product called Raindrop. Sadly Raindrop never caught on, but their [design](http://www.flickr.com/photos/43332657@N06/) and [code](https://wiki.mozilla.org/Raindrop/Hacking) are available under the Mozilla Public License. 

In general the idea behind this project is to make a web based messaging client that is really easy to hack on. To seed that idea I have started to revive the design vision behind Raindrop and implement it using Node.js, CouchDB and lots of client side javascript :) I also hope to implement a somewhat generic UI for [ActivityStreams JSON v1.0](http://activitystrea.ms/head/json-activity.html).

Additionally, this is a [small data](http://smalldata.org) project, which means it's priorities are open data, open source and giving users ownership of the content that they create.

## Hacking on it/beta testing

CouchMail is a couchapp! You will first need some JSON formatted emails in your couch for this app to make any sense. You can find some example data [here](http://max.ic.ht/couch-user-mail). 

To install CouchMail in your Couch:

    # clone this repo
    git clone git://github.com/maxogden/couchmail.git
    cd couchmail
    npm install -g couchapp
    couchapp push app.js http://localhost:5984/somedatabase
    
Now you can open CouchMail by visiting `http://localhost:5984/somedatabase/_design/couchmail/index.html`

License
-------
This software is licensed under the [Mozilla Tri-License][MPL]:

    ***** BEGIN LICENSE BLOCK *****
    Version: MPL 1.1/GPL 2.0/LGPL 2.1

    The contents of this file are subject to the Mozilla Public License Version
    1.1 (the "License"); you may not use this file except in compliance with
    the License. You may obtain a copy of the License at
    http://www.mozilla.org/MPL/

    Software distributed under the License is distributed on an "AS IS" basis,
    WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
    for the specific language governing rights and limitations under the
    License.

    The Original Code is Raindrop.
    
    The Initial Developer of the Original Code is Mozilla.
    Portions created by the Initial Developer are Copyright (C) 2011
    the Initial Developer. All Rights Reserved.

    Contributor(s):
      Max Ogden <max@maxogden.com>
      Mozilla Raindrop Contributors

    Alternatively, the contents of this file may be used under the terms of
    either the GNU General Public License Version 2 or later (the "GPL"), or
    the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
    in which case the provisions of the GPL or the LGPL are applicable instead
    of those above. If you wish to allow use of your version of this file only
    under the terms of either the GPL or the LGPL, and not to allow others to
    use your version of this file under the terms of the MPL, indicate your
    decision by deleting the provisions above and replace them with the notice
    and other provisions required by the GPL or the LGPL. If you do not delete
    the provisions above, a recipient may use your version of this file under
    the terms of any one of the MPL, the GPL or the LGPL.

    ***** END LICENSE BLOCK *****

[MPL]: http://www.mozilla.org/MPL/
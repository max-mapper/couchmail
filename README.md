# CouchMail CouchApp

Once upon a time there was a wonderful group of folks at Mozilla who designed a product called Raindrop. Sadly Raindrop never caught on, but their [design](http://www.flickr.com/photos/43332657@N06/) and [code](https://wiki.mozilla.org/Raindrop/Hacking) are available under the Mozilla Public License. 

This project is an effort to revive the design vision behind Raindrop and implement it using Node.js, CouchDB and lots of client side javascript :) I also hope to implement a somewhat generic UI for [ActivityStreams JSON v1.0](http://activitystrea.ms/head/json-activity.html).

## Hacking on it/beta testing

CouchMail works and you can test it out today! The only thing you will need is a public server running [haraka-couchdb](https://github.com/maxogden/haraka-couchdb). Once you get it installed it will dump all incoming mail into CouchDB.

To install CouchMail in your Couch:

    # clone this repo
    git clone git://github.com/maxogden/couchmail.git
    cd couchmail
    npm install couchapp
    couchapp push app.js http://localhost:5984/mail_myusername
    
The database name in the last line will be the username of the person you are sending mail to on your `haraka-couchdb` server, e.g. if you send mail to `bob@awesome.com` then you will want to install CouchMail in the database called `http://localhost:5984/mail_bob` in order to see his messages. Once you get `haraka-couchdb` running on your server and you start sending emails to it then databases will be automatically created for each new user. You can check the database names by viewing Futon, the CouchDB web administration tool which is available by default at `http://127.0.0.1:5984/_utils`.
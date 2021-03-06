import os

from PlacePulse import app
from datetime import datetime
from flask import render_template,request,session,url_for
from bson.objectid import ObjectId

import json
import re
from unicodedata import normalize

class Buckets:
    Unknown, Queue, Archive = range(3)
    QueueSize = 100

# Calls render_template with default template variables included
def auto_template(template_name, **kwargs):
    extraObj = {
        'userObj': session['userObj'] if session.get('userObj') else dict(),
        'logoutUrl': url_for('login.logout',next=request.path),
    }
    kwargs.update(extraObj)
    return render_template(template_name, **kwargs)

def getFBLoginLink():
    FB_APP_ID = '112177295578109'
    FB_LOGIN_LINK = "https://www.facebook.com/dialog/oauth?scope=email,user_education_history,offline_access,user_likes&client_id=%s&redirect_uri=%s/login/fromfb/" % (FB_APP_ID, os.environ['PLACEPULSE_BASEURL'])
    return FB_LOGIN_LINK

def getLoggedInUser():
    # Every user gets a cookie when they vote, but only logged in users have an email.
    if session.get('userObj') and session['userObj'].get('email'):
        return session.get('userObj')

def jsonifyResponse(obj):
    def default_handler(_obj):
        if isinstance(_obj,ObjectId):
            return str(_obj)
        if isinstance(_obj, datetime):
            return int(_obj.strftime('%s'))
        raise TypeError,"Unknown obj in JSON, %s, %s" % (type(_obj),_obj)
    resp = app.make_response(json.dumps(obj, default=default_handler))
    resp.mimetype = 'application/json'
    return resp

def objifyPlace(place):
    return {
        'id' : str(place['_id']),
        'loc' : place['loc']
    }
    
def strFromObjectID(obj):
    if isinstance(obj,ObjectId):
        return str(obj)
    elif obj.get('_id'):
        obj['_id'] = str(obj['_id'])
        return obj

# Public domain snippet from http://flask.pocoo.org/snippets/5/
_punct_re = re.compile(r'[\t !"#$%&\'()*\-/<=>?@\[\\\]^_`{|},.]+')
def slugify(text, delim=u'-'):
    """Generates an slightly worse ASCII-only slug."""
    if type(text) not in (str,unicode): return ""
    result = []
    for word in _punct_re.split(text.lower()):
        word = normalize('NFKD', unicode(word)).encode('ascii', 'ignore')
        if word:
            result.append(word)
    return unicode(delim.join(result))
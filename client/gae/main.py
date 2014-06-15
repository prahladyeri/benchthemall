import webapp2
import jinja2
import os
from google.appengine.api import users,mail
from google.appengine.ext import ndb
from google.appengine.api import urlfetch
from webapp2_extras import sessions
from time import sleep
import json
import logging
import model
import time
import collections

DEBUG = False
if os.environ.get('SERVER_SOFTWARE','').startswith('Development'):
    DEBUG = True

config = {}
config['webapp2_extras.sessions'] = {
    'secret_key': 'prahji',
}
JINJA_ENVIRONMENT = jinja2.Environment(loader=jinja2.FileSystemLoader(os.path.dirname(__file__)),extensions=['jinja2.ext.autoescape'])

#Lets create a universal session handler
class BaseHandler(webapp2.RequestHandler):
    def get_current_user(self):
        if self.session.has_key('user'):
            return self.session['user']
        else:
            return ''

    def dispatch(self):
        # Get a session store for this request.
        self.session_store = sessions.get_store(request=self.request)

        try:
            # Dispatch the request.
            webapp2.RequestHandler.dispatch(self)
        finally:
            # Save all sessions.
            self.session_store.save_sessions(self.response)

    @webapp2.cached_property
    def session(self):
        # Returns a session using the default cookie key.
        sess = self.session_store.get_session()
        #add some default values:
        if not sess.get('theme'):
            sess['theme']='bootstrap'#'slate'
        return sess
        
class Home(BaseHandler):
    def get(self):
        template = JINJA_ENVIRONMENT.get_template('index.html')
        self.response.write(template.render())
        #self.response.write('hello world')
        
class JsonRefresh(BaseHandler):
    def get(self):
        #fetch top 50 from ndb store
        #self.response.write('working')
        #logging.debug('received request')
        #return
        results = model.Result.query().order(-model.Result.timestamp).fetch(40)
        #logging.debug('I have: '+str(len(results)))
        #logging.debug('proxy object')
        obj = [collections.OrderedDict(p.to_dict()) for p in results]
        #logging.debug(obj)
        #logging.debug(type(obj))
        logging.debug('now calling encoder.')
        #sleep(2)
        robj= json.dumps(obj, cls=model.MyJsonEncoder)
        #logging.debug(robj)
        self.response.write(robj)
        #return in json

class JsonShowDetails(BaseHandler):
    def get(self):
        stime = self.request.get('timestamp')
        #fetch time from datastore
        sleep(3) #time in seconds
        #return details
        li = ['here is the key']
        self.response.write(json.dumps(li));
        
class JsonDoTest(BaseHandler):
    def get(self):
        #host = self.request.get('provider')
        #lang = self.request.get('language')
        #for k,v in self.request.GET.iteritems():
        #for k,v in self.request.params.iteritems():
        #Presently, there will be only one result.
        #I might consider multiple in future.
        results={}
        for k,v in self.request.params.iteritems():
            #s+= k + ":" + v
            #logging.debug('The key is:'+k)
            #logging.debug('The val is:'+v)
            #s = v.split('->')
            #host = s[0]
            #lang = s[1]
            #cat = s[2]
            host= v
            logging.debug('host:'+host)
            #part=''
            #if (lang=='php'):
            #    part='/benchmark.php?type=' + cat
            #elif (lang=='python'):
            #    part='/python/benchmark.py'
            #url = model.hosturls[host] + part
            url = model.hosturls[host]
            logging.debug('the url:'+url)
            logging.debug('now calling urlfetch')

            #start the test
            micros = time.time()
            result = urlfetch.fetch(url, deadline=60)
            micros = time.time() - micros
            millis = int(round(micros * 1000))
            #secs = millis*1000
            #req_per_sec = 1/millis

            logging.debug('result received: ' + str(len(result.content)))
            #logging.debug('before: ' + result.content)
            if result.status_code == 200 and len(result.content)>108000:
                #pass
                #try:
                obj = json.loads(result.content,  object_pairs_hook=collections.OrderedDict)
                #logging.debug(obj)
                cnt = len(obj['payload'])
                results[host] = collections.OrderedDict({})
                #results[host] = {}
                results[host]['host'] = host
                results[host]['time_taken_millis'] = millis
                results[host].update( obj)
                results[host]['payload'] = str(cnt) + ' bytes' #convert payload to its length
                #model.Result.save(results[host])
                r = model.Result.save(results[host])
                js=json.dumps( r.to_dict(), cls=model.MyJsonEncoder)
                #js=json.dumps(results[host], cls=model.MyJsonEncoder)
                
                #except:
                #    logging.debug('error occured')
                #    results[host] = 0
            else:
                logging.debug('Request failed')
                results[host] = 'Request Failed'
                js=json.dumps( results)
                
        #logging.debug(js)
        self.response.write(js)

        
class MailHandler(BaseHandler):
    def get(self, address):
        self.response.write('Handler is working fine')
        
    def post(self, address):
        logging.debug('START_EMAIL_ARRIVED for ' + address)
        #for k,v in self.request.params.iteritems():
        #    logging.debug(k + '::' + V)
        logging.debug('END_EMAIL_ARRIVED')


application = webapp2.WSGIApplication([
    ('/', Home),
    (r'/_ah/mail/(\w+)@hostmetric.appspotmail.com', MailHandler), #(\d+)
    ('/json_show_details', JsonShowDetails),
    ('/json_do_test', JsonDoTest),
    ('/json_refresh', JsonRefresh),
], debug=True,config=config)

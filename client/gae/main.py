import webapp2
import jinja2
import os
from google.appengine.api import users,mail
from google.appengine.ext import ndb
from webapp2_extras import sessions
from time import sleep
import json

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

class JsonGetDetails(BaseHandler):
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
        s="";
        #for k,v in self.request.GET.iteritems():
        #for k,v in self.request.params.iteritems():
        for k,v in self.request.params.iteritems():
            s+= k + ":" + v;
        sleep(5)
        self.response.write( json.dumps([s] ) )
        

application = webapp2.WSGIApplication([
    ('/', Home),
    ('/json_get_details', JsonGetDetails),
    ('/json_do_test', JsonDoTest),
], debug=True,config=config)

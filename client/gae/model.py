from google.appengine.ext import ndb
import json
import time
import datetime
import collections
import logging

hosturls = {
    'Google_appengine->php->disk':'https://bdaypunch.appspot.com/benchmark.php?type=disk',
    'Google_appengine->php->sqlite3':'https://bdaypunch.appspot.com/benchmark.php?type=sqlite3',

    'Openshift->php->disk':'https://eyeon-inn.rhcloud.com/benchmark.php?type=disk',
    'Openshift->php->mysql':'https://eyeon-inn.rhcloud.com/benchmark.php?type=mysql',
    'Openshift->php->sqlite3':'https://eyeon-inn.rhcloud.com/benchmark.php?type=sqlite3',

    'Awardspace->php->disk':'http://ashoka.myartsonline.com/benchmark.php?type=disk',
    'Awardspace->php->mysql':'http://ashoka.myartsonline.com/benchmark.php?type=mysql',
    'Awardspace->php->sqlite2':'http://ashoka.myartsonline.com/benchmark.php?type=sqlite2',
    
    'Byethost->php->disk':'http://chanakya.byethost17.com/benchmark.php?type=disk',
    'Byethost->php->mysql':'http://chanakya.byethost17.com/benchmark.php?type=mysql',
    'Byethost->php->sqlite3':'http://chanakya.byethost17.com/benchmark.php?type=sqlite3',
    
    '000webhost->php->disk':'http://chandragupta.comze.com/benchmark.php?type=disk',
    '000webhost->php->mysql':'http://chandragupta.comze.com/benchmark.php?type=mysql',
    '000webhost->php->sqlite2':'http://chandragupta.comze.com/benchmark.php?type=sqlite2',
        }
        
class MyJsonEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, datetime.datetime):
            #return int(time.mktime(obj.timetuple()))
            return datetime.datetime.strftime(obj,'%y%m%d%H%M%S')
        return json.JSONEncoder.default(self, obj)

#model definitions
class Result(ndb.Expando):
    timestamp = ndb.DateTimeProperty(indexed = True, auto_now_add=True)
    #~ host = ndb.StringProperty()
    #~ time_taken_millis= ndb.IntegerProperty()
    #~ iterations= ndb.IntegerProperty()
    #~ write_time = ndb.IntegerProperty()
    #~ read_time = ndb.IntegerProperty()
    #~ generate_time = ndb.IntegerProperty()
    #~ server_software = ndb.StringProperty()
    #~ php_version= ndb.StringProperty()
    #~ script_version= ndb.StringProperty()
    #~ payload= ndb.StringProperty()

    @staticmethod
    def save(dc):
        #dic.update({'host':host})
        #for item in dc:
        #    logging.debug(item)
        #r=Result(**collections.OrderedDict(dc))
        r=Result(**dc)
        #r.jsonText = jsonText
        #for k in obj:
        #    r[k] = obj[k]
            #pass
        #r.populate()
        r.put()
        return r

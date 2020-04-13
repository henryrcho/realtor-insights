import pandas as pd
import tweepy
from datetime import datetime
import pickle

class NycNtaLoader:
    def __init__(self, fp='./data/ny-nta.csv'):
        self.fp = fp
    
    def load(self, get_keywords=False):
        df = pd.read_csv(self.fp, header=None).rename(columns={0: 'NTA'})
        df['NTA'] = df['NTA'].apply(lambda x: ' '.join(x.split(' ')[1:]))
        if get_keywords:
            ntas, keywords = df['NTA'].to_numpy(), []
            for nta in ntas:
                nta = nta.replace('(Pennsylvania Ave)', '')
                nta = nta.replace('park-cemetery-etc-', '')
                keywords.append(nta.split('-')[0])
            return keywords
        return df
        
class TwitterIngestor:
    def __init__(self, ckey, csecret, akey, asecret, keywords=None):
        self.auth = self._authenticate(ckey, csecret, akey, asecret)
        self.api = tweepy.API(self.auth)
        self.keywords = keywords
    
    def _authenticate(self, ckey, csecret, akey, asecret):
        auth = tweepy.OAuthHandler(ckey, csecret)
        auth.set_access_token(akey, asecret)
        return auth

    def listen(self):
        listener = TwitterStreamListener()
        listener.open_file()
        myStream = tweepy.Stream(auth=self.api.auth, listener=listener)
        myStream.filter(languages=["en"], track=self.keywords)

    def search(self, keyword):
        res = self.api.search(q=keyword, count=100)
        with open(f'./cache/{keyword}.pkl', 'wb') as f:
            pickle.dump(res, f)


class TwitterStreamListener(tweepy.StreamListener):
    def open_file(self):
        fp = f'./data/{datetime.now()}'
        self.file = open(fp, 'w')

    def on_status(self, status):
        self.file.write(status.text)
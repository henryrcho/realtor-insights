from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
from pycorenlp import StanfordCoreNLP
import numpy as np
import pandas as pd
import pickle

class Preprocessor:
    def __init__(self):
        with open('./stopwords.txt', 'r') as f:
            stopwords = f.read()
        self.stopwords = stopwords.split('\n')

    def process(self, sentence):
        sentence = self._to_lowercase(sentence)
        sentence = self._remove_stop_words(sentence)
        sentence = self._remove_extraneous(sentence)
        return sentence

    def _to_lowercase(self, sentence):
        return sentence.lower()

    def _remove_stop_words(self, sentence):
        new = ''
        for word in sentence.split(' '):
            if word not in self.stopwords:
                new += f' {word} '
        return new
    
    def _remove_extraneous(self, sentence):
        new = ''
        for word in sentence.split(' '):
            if not ('http' in word or '@' in word or 'rt' in word or '…' in word):
                new += f' {word} '
        return new

class VaderSentimentAttacher:
    def __init__(self):
        self.preprocessor = Preprocessor()

    def get_vader_analyzer(self):
        return SentimentIntensityAnalyzer()

    def get_vader_sentiment(self, analyzer, sentence, compound=True):
        if compound:
            return analyzer.polarity_scores(sentence)['compound']
        return analyzer.polarity_scores(sentence)

    def attach_sentiment(self, df):
        vader_analyzer = self.get_vader_analyzer()
        df['processed_text'] = df['text'].apply(lambda x: self.preprocessor.process(x))
        df['vader_sent'] = df['processed_text'].apply(lambda x: self.get_vader_sentiment(vader_analyzer, x))
        return df

class NTA:
    def __init__(self, nta):
        self.nta = nta
        self.vader = VaderSentimentAttacher()

    def get_nta_sentiment_df(self, vader=True, stanford=False):
        with open(f'./cache/{self.nta}.pkl', 'rb') as f:
            tweets = pickle.load(f)
        dates, tweet_ids, texts = [], [], []
        for tweet in tweets:
            dates.append(tweet._json['created_at'])
            tweet_ids.append(tweet._json['id'])
            texts.append(tweet._json['text'])
        df = pd.DataFrame({'date': dates, 'tweet_id': tweet_ids, 'text': texts})
        df['nta'] = self.nta
        if vader:
            df = self.vader.attach_sentiment(df)
        return df
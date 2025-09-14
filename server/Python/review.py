import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.cluster import KMeans
from textblob import TextBlob
import matplotlib.pyplot as plt
import seaborn as sns
import json
import random
from datetime import datetime, timedelta

class ReviewSentimentEngine:
    def __init__(self):
        self.vectorizer = TfidfVectorizer(max_features=500, stop_words='english')
        self.cluster_model = KMeans(n_clusters=3, random_state=42)
        self.review_dataset = None
        self.sentiment_thresholds = {
            'positive': 0.3,
            'neutral': -0.3,
            'negative': -1.0
        }

    def generate_review_samples(self, business_id, sample_size=50):
        consumer_names = [f'Customer_{i}' for i in range(1000, 1000+sample_size)]
        comments = [
            "Excellent service, highly recommend!",
            "Good experience overall",
            "Average quality, expected better",
            "Poor customer service",
            "Will definitely return",
            "Not worth the price",
            "Best in town!",
            "Needs improvement",
            "Worst experience ever",
            "Exceeded expectations"
        ]
        
        review_samples = []
        base_date = datetime.now()
        
        for i in range(sample_size):
            rating = random.choices([1, 2, 3, 4, 5], weights=[0.1, 0.15, 0.25, 0.3, 0.2])[0]
            review_date = base_date - timedelta(days=random.randint(0, 365))
            
            review = {
                'consumer': {
                    'name': consumer_names[i],
                    'profilePic': f'https://storage.profilepics/user_{random.randint(1000,9999)}.jpg'
                },
                'business': business_id,
                'rating': rating,
                'comment': random.choice(comments),
                'createdAt': review_date.isoformat()
            }
            review_samples.append(review)
            
        self.review_dataset = pd.DataFrame(review_samples)
        return self.review_dataset

    def process_text_features(self):
        tfidf_matrix = self.vectorizer.fit_transform(self.review_dataset['comment'])
        return tfidf_matrix

    def perform_sentiment_analysis(self):
        self.review_dataset['polarity'] = self.review_dataset['comment'].apply(
            lambda x: TextBlob(x).sentiment.polarity
        )
        self.review_dataset['sentiment'] = self.review_dataset['polarity'].apply(
            lambda x: 'positive' if x > self.sentiment_thresholds['positive'] 
            else 'neutral' if x > self.sentiment_thresholds['neutral'] 
            else 'negative'
        )
        return self.review_dataset

    def cluster_similar_reviews(self):
        tfidf_matrix = self.process_text_features()
        clusters = self.cluster_model.fit_predict(tfidf_matrix)
        self.review_dataset['topic_cluster'] = clusters
        return self.review_dataset

    def generate_insights(self):
        insights = {
            'average_rating': round(self.review_dataset['rating'].mean(), 2),
            'sentiment_distribution': self.review_dataset['sentiment'].value_counts().to_dict(),
            'top_keywords': self.extract_keywords(),
            'rating_trends': self.calculate_trends()
        }
        return insights

    def extract_keywords(self, n_keywords=5):
        feature_names = self.vectorizer.get_feature_names_out()
        cluster_keywords = {}
        
        for cluster_id in range(self.cluster_model.n_clusters):
            cluster_indices = np.where(self.review_dataset['topic_cluster'] == cluster_id)[0]
            tfidf_scores = np.asarray(self.process_text_features()[cluster_indices].mean(axis=0)).ravel()
            top_indices = tfidf_scores.argsort()[-n_keywords:][::-1]
            cluster_keywords[f'cluster_{cluster_id}'] = [feature_names[i] for i in top_indices]
            
        return cluster_keywords

    def calculate_trends(self):
        self.review_dataset['date'] = pd.to_datetime(self.review_dataset['createdAt'])
        monthly_trends = self.review_dataset.resample('M', on='date')['rating'].mean()
        return monthly_trends.to_dict()

    def visualize_analysis(self):
        plt.figure(figsize=(15, 10))
        
        plt.subplot(2, 2, 1)
        sns.countplot(x='rating', data=self.review_dataset)
        plt.title('Rating Distribution')
        
        plt.subplot(2, 2, 2)
        sns.countplot(x='sentiment', data=self.review_dataset)
        plt.title('Sentiment Analysis')
        
        plt.subplot(2, 2, 3)
        sns.boxplot(x='topic_cluster', y='rating', data=self.review_dataset)
        plt.title('Rating by Topic Cluster')
        
        plt.subplot(2, 2, 4)
        self.review_dataset.resample('M', on='date')['rating'].mean().plot()
        plt.title('Monthly Rating Trend')
        
        plt.tight_layout()
        return plt

if __name__ == "__main__":
    analyzer = ReviewSentimentEngine()
    business_reviews = analyzer.generate_review_samples('bus_12345')
    processed_reviews = analyzer.perform_sentiment_analysis()
    clustered_reviews = analyzer.cluster_similar_reviews()
    insights = analyzer.generate_insights()
    
    print("Analysis Insights:")
    print(json.dumps(insights, indent=2))
    
    visualization = analyzer.visualize_analysis()
    visualization.show()
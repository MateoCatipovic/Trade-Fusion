import os
from dotenv import load_dotenv
from pathlib import Path
from quart import Quart, jsonify, request
from quart_cors import cors
from twikit import Client
import asyncio
from concurrent.futures import ThreadPoolExecutor
#import asyncpraw
import praw
from datetime import datetime, timezone

# Specify the path to the .env file
env_path = Path('../.env')

# Load environment variables from the .env file
load_dotenv(dotenv_path=env_path)

reddit = praw.Reddit(
    client_id=os.getenv('REDDIT_CLIENT_ID'),
    client_secret=os.getenv('REDDIT_CLIENT_SECRET'),
    user_agent=os.getenv('REDDIT_APP_NAME')
)

app = Quart(__name__)
app = cors(app, allow_origin=["http://localhost:3000","http://localhost:5000" ])  # Allow requests from your frontend's origin


# Initialize client
client = Client('en-US')

# Function to fetch Reddit posts (Synchronous)
def fetch_reddit_posts_sync(subreddit_name):
    return list(reddit.subreddit(subreddit_name).top(time_filter='week',limit=20))

# Async function to run the synchronous function in a separate thread
async def fetch_reddit_posts(subreddit_name):
    loop = asyncio.get_event_loop()
    with ThreadPoolExecutor() as pool:
        posts = await loop.run_in_executor(pool, fetch_reddit_posts_sync, subreddit_name)
    return posts


@app.route('/fetch-reddit-posts', methods=['GET'])
async def fetch_reddit_posts_route():
    subreddit_name = 'python'  # Can be dynamically set via request args
    try:
        posts = await fetch_reddit_posts(subreddit_name)
        posts_data = [
            {
                'title': post.title,
                'score': post.score,
                'text': post.selftext,
                'url': post.url,
                'created_at': datetime.fromtimestamp(post.created_utc, timezone.utc).strftime('%Y-%m-%d %H:%M:%S %Z'),
                'author': post.author.name if post.author else '[deleted]',
                'author_profile_image': post.author.icon_img if post.author else None
            }
            for post in posts
        ]
        print(posts)
        return jsonify(posts_data)
    except Exception as e:
        return jsonify({'error': str(e)})

@app.route('/login', methods=['POST'])
async def login():
    data = await request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    
    try:
        await client.login(
            auth_info_1=username,
            auth_info_2=email,
            password=password
        )
        client.save_cookies('cookies.json')
        return jsonify({'success': True})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

@app.route('/fetch-tweets', methods=['GET'])
async def fetch_tweets():
    try:
        client.load_cookies('cookies.json')
        tweets = await client.get_latest_timeline()
        tweets_data = [
            {
                'name': tweet.user.name,
                'text': tweet.text,
                'profile_image': tweet.user.profile_image_url,
                'created_at': tweet.created_at,
                'retweet_count': tweet.retweet_count,
                'favorite_count': tweet.favorite_count
            }
            for tweet in tweets
        ]
        return jsonify(tweets_data)
    except Exception as e:
        return jsonify({'error': str(e)})

@app.route('/check-session', methods=['GET'])
async def check_session():
    try:
        client.load_cookies('cookies.json')
        await client.get_latest_timeline(count=1)
        return jsonify({'session_valid': True})
    except Exception as e:
        return jsonify({'session_valid': False, 'error': str(e)})

@app.route('/logout', methods=['POST'])
async def logout():
    try:
        await client.logout()
        return jsonify({'success': True}), 200  # Return success with 200 status
    except Exception as e:
        # Log the error for debugging purposes
        app.logger.error(f"Logout failed: {str(e)}")
        return jsonify({'success': False, 'error': str(e)}), 500  # Return failure with 500 status


if __name__ == '__main__':
    app.run(host='localhost', port=4000)
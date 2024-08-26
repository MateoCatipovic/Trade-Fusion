from quart import Quart, jsonify, request
from quart_cors import cors
from twikit import Client
import praw
import asyncio
from concurrent.futures import ThreadPoolExecutor

# Initialize the app
app = Quart(__name__)
app = cors(app, allow_origin="http://localhost:3000")

# Initialize Twitter client
client = Client('en-US')

# Initialize Reddit client
reddit = praw.Reddit(
    client_id='YOUR_CLIENT_ID',
    client_secret='YOUR_CLIENT_SECRET',
    user_agent='YOUR_APP_NAME'
)

# Asynchronous function to fetch Reddit posts in a thread
async def fetch_reddit_posts(subreddit_name):
    loop = asyncio.get_event_loop()
    with ThreadPoolExecutor() as pool:
        posts = await loop.run_in_executor(pool, lambda: list(reddit.subreddit(subreddit_name).top(limit=10)))
    return posts

@app.route('/fetch-reddit-posts', methods=['GET'])
async def fetch_reddit_posts_route():
    subreddit_name = request.args.get('subreddit', 'python')  # default to 'python' if not provided
    try:
        posts = await fetch_reddit_posts(subreddit_name)
        posts_data = [{'title': post.title, 'score': post.score} for post in posts]
        return jsonify(posts_data)
    except Exception as e:
        return jsonify({'error': str(e)})

# Your existing routes...
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

# More existing routes...

if __name__ == '__main__':
    app.run(host='localhost', port=4000)

import os
from dotenv import load_dotenv
from pathlib import Path
from quart import Quart, jsonify, request
from quart_cors import cors
from twikit import Client
import asyncio
from concurrent.futures import ThreadPoolExecutor
import praw
from datetime import datetime, timezone
import json
import tempfile

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
app = cors(app, allow_origin=["http://localhost:5000"])  # Allow requests from your frontend's origin


# Initialize client
client = Client('en-US')

# Function to fetch Reddit posts (Synchronous)
def fetch_reddit_posts_sync(subreddit_name, sort_by, time_filter):
    if(sort_by == "top"):
        return list(reddit.subreddit(subreddit_name).top(time_filter=time_filter, limit=20))
    else:
      return list(getattr(reddit.subreddit(subreddit_name), sort_by)(limit=20))

# Async function to run the synchronous function in a separate thread
async def fetch_reddit_posts(subreddit_name, sort_by, time_filter):
    loop = asyncio.get_event_loop()
    with ThreadPoolExecutor() as pool:
        posts = await loop.run_in_executor(pool, fetch_reddit_posts_sync, subreddit_name, sort_by, time_filter)
    return posts

@app.route('/fetch-reddit-posts', methods=['POST'])
async def fetch_reddit_posts_route():
    data = await request.get_json()
    subreddit_names = data.get('subreddits', [])  # Get the 'subreddits' key from the JSON body, default to an empty list
    sort_by = data.get('sort_by', "new")
    time_filter = data.get('time_filter', "week")
    
    if not subreddit_names or not isinstance(subreddit_names, list):
        return jsonify({'error': 'No subreddits provided or invalid format. Expected a list of subreddit names.'}), 400

    all_posts_data = []  # List to store all posts data for each subreddit

    try:
        for subreddit_name in subreddit_names:
            posts = await fetch_reddit_posts(subreddit_name, sort_by, time_filter)
            # print(posts)
            posts_data = [
                {
                    'subreddit': subreddit_name,
                    'title': post.title,
                    'score': post.score,
                    'text': post.selftext,
                    'url': post.url,
                    'created_at': datetime.fromtimestamp(post.created_utc, timezone.utc).strftime('%Y-%m-%d %H:%M:%S %Z'),
                    'author': post.author.name if post.author else '[deleted]',
                    'author_profile_image': post.author.icon_img if hasattr(post.author, 'icon_img') else None
                }
                for post in posts
            ]
            all_posts_data.extend(posts_data)  # Append the posts from each subreddit to the list

        print(all_posts_data)  # Print all fetched posts for debugging
        return jsonify(all_posts_data)  # Return all posts in a single JSON response
    except Exception as e:
        return jsonify({'error': str(e)})
    
    # Function to load cookies from a file
async def load_cookies_from_file(file_path):
    global cookie_storage
    try:
        with open(file_path, 'r') as file:
            cookies = json.load(file)  # Load JSON data from file
            print(cookies)
            print("Cookies loaded successfully from file.")
            return cookies
    except FileNotFoundError:
        print(f"File not found: {file_path}")
    except json.JSONDecodeError:
        print(f"Error decoding JSON from file: {file_path}")


@app.route('/login-twitter', methods=['POST'])
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
        cookie = await load_cookies_from_file('cookies.json')
        print(cookie)
        return jsonify({'success': True, 'cookie': cookie})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

@app.route('/fetch-tweets', methods=['POST'])
async def fetch_tweets():
    try:
        data = await request.get_json()
        cookie = data.get('cookie')
        print(cookie)

         # Create a temporary file to store the cookie JSON
        with tempfile.NamedTemporaryFile(delete=False) as temp_cookie_file:
            temp_cookie_file.write(json.dumps(cookie).encode('utf-8'))  # Write cookie JSON to the file
            temp_cookie_file_path = temp_cookie_file.name  # Get the path of the temp file

        client.load_cookies(temp_cookie_file_path)
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

# @app.route('/check-session', methods=['GET'])
# async def check_session():  
#     try:
#         client.load_cookies('cookies.json')
#         await client.get_latest_timeline(count=1)
#         return jsonify({'session_valid': True})
#     except Exception as e:
#         return jsonify({'session_valid': False, 'error': str(e)})

@app.route('/logout-twitter', methods=['POST'])
async def logout():
    try:
        response = await client.logout()
        print('logout response')
        print(response)
        return jsonify({'success': True}), 200  # Return success with 200 status
    except Exception as e:
        # Log the error for debugging purposes
        app.logger.error(f"Logout failed: {str(e)}")
        return jsonify({'success': False, 'error': str(e)}), 500  # Return failure with 500 status


if __name__ == '__main__':
    app.run(host='localhost', port=4000)
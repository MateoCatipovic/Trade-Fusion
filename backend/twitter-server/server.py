from quart import Quart, jsonify, request
from quart_cors import cors
from twikit import Client

app = Quart(__name__)
app = cors(app, allow_origin="http://localhost:3000")  # Allow requests from your frontend's origin

# Initialize client
client = Client('en-US')

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
import praw

reddit = praw.Reddit(
    client_id='YOUR_CLIENT_ID',
    client_secret='YOUR_CLIENT_SECRET',
    user_agent='YOUR_APP_NAME'
)

subreddit = reddit.subreddit('python')
for post in subreddit.top(limit=10):
    print(post.title)

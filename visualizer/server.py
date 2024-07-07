from flask import Flask, jsonify, request
import git
from visualizer import get_repo_commits, filter_commits_by_author, filter_commits_by_date_range

app = Flask(__name__)

@app.route('/api/commits')
def get_commits():
    repo_path = app.config['REPO_PATH']
    commits = get_repo_commits(repo_path)
    
    # Apply filters if provided
    author = request.args.get('author')
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')

    if author:
        commits = filter_commits_by_author(commits, author)
    if start_date and end_date:
        commits = filter_commits_by_date_range(commits, start_date, end_date)
    
    return jsonify(commits)

def start(repo_path):
    app.config['REPO_PATH'] = repo_path
    app.run(debug=True)

if __name__ == "__main__":
    start('/Users/kirkbowe/Projects/Python/git-commit-visualizer')


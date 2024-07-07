import argparse
import sys
from flask import Flask, render_template, jsonify, request
from .visualizer import get_repo_commits, filter_commits_by_author, filter_commits_by_date_range

app = Flask(__name__, template_folder='static/templates')

@app.route('/')
def index():
    return render_template('index.html')

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
    app.config['EXPLAIN_TEMPLATE_LOADING'] = True
    app.run(debug=True)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Git Commit Visualizer')
    parser.add_argument('repo_path', type=str, help='Path to the Git repository')
    args = parser.parse_args()
    
    if not args.repo_path:
        print("Error: Please provide the path to the Git repository.")
        sys.exit(1)
        
    start(args.repo_path)



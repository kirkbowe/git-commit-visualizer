import git
import datetime

def get_default_branch(repo):
    """
    Retrieve the default branch of the repository.
    
    :param repo: The Git repository object.
    :return: Name of the default branch.
    """
    return repo.head.ref.name

def get_repo_commits(repo_path):
    """
    Retrieve and format commit data from the specified Git repository.
    
    :param repo_path: Path to the Git repository.
    :return: List of commit data dictionaries.
    """
    repo = git.Repo(repo_path)
    default_branch = get_default_branch(repo)
    commits = []

    for commit in repo.iter_commits(default_branch):
        commits.append({
            'sha': commit.hexsha,
            'author': commit.author.name,
            'date': commit.committed_datetime.isoformat(),
            'message': commit.message.strip(),
            'parents': [p.hexsha for p in commit.parents]
        })

    return commits

def filter_commits_by_author(commits, author):
    """
    Filter commits by author name.
    
    :param commits: List of commit data dictionaries.
    :param author: Author name to filter by.
    :return: Filtered list of commit data dictionaries.
    """
    return [commit for commit in commits if commit['author'] == author]

def filter_commits_by_date_range(commits, start_date, end_date):
    """
    Filter commits by date range.
    
    :param commits: List of commit data dictionaries.
    :param start_date: Start date as a string in ISO format.
    :param end_date: End date as a string in ISO format.
    :return: Filtered list of commit data dictionaries.
    """
    start_date = datetime.datetime.fromisoformat(start_date)
    end_date = datetime.datetime.fromisoformat(end_date)
    
    def parse_commit_date(date_str):
        # Ensure the commit date is parsed correctly and converted to a naive datetime object
        commit_date = datetime.datetime.fromisoformat(date_str)
        if commit_date.tzinfo is not None:
            commit_date = commit_date.replace(tzinfo=None)
        return commit_date

    return [commit for commit in commits if start_date <= parse_commit_date(commit['date']) <= end_date]

# Example usage within the Flask server
if __name__ == "__main__":
    repo_path = '/Users/kirkbowe/Projects/Python/git-commit-visualizer'
    commits = get_repo_commits(repo_path)
    print(commits)

    # Example filtering
    author_filtered_commits = filter_commits_by_author(commits, 'Author Name')
    date_filtered_commits = filter_commits_by_date_range(commits, '2023-01-01T00:00:00', '2023-12-31T23:59:59')
    print(author_filtered_commits)
    print(date_filtered_commits)


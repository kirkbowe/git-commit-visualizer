# Git Commit Visualizer

Git Commit Visualizer is a web application built with Flask and D3.js that visualizes commit history from a Git repository.

![](https://www.kirkbowe.com/visualizer.gif)

## Features

- Visualization of Commit History: Display commit messages and details in an interactive graph.
- Filtering: Filter commits by author.
- Dynamic Update: Automatically updates visualization when filters are applied.


## Prerequisites

- Python 3.x
- Git

## Installation

1. Clone the repository:

```bash
git clone https://github.com/kirkbowe/git-commit-visualizer.git
cd git-commit-visualizer
```

2. Create a virtual environment (optional but recommended):

```bash
python -m venv venv
source venv/bin/activate   # On Windows use `venv\Scripts\activate`
```

3. Install dependencies:

```bash
pip install -r requirements.txt
```

## Usage

1. Start the Flask server:

```bash
python -m visualizer.server /path/to/your/git/repo
```

Replace /path/to/your/git/repo with the path to your Git repository.

2. Open a web browser and go to http://127.0.0.1:5000.

3. Use the interface to filter and visualize commit history.

## Configuration

Adjust visualizer/server.py to customize Flask settings or default repository path.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- Flask
- D3.js


## Author

Kirk Bowe - @kirkbowe

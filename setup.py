from setuptools import setup, find_packages

setup(
    name='git-commit-visualizer',
    version='0.1.0',
    packages=find_packages(),
    include_package_data=True,
    install_requires=[
        'Flask',
        'GitPython',
    ],
    entry_points={
        'console_scripts': [
            'git-commit-visualizer=visualizer.cli:main',
        ],
    },
)

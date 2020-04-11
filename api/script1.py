import sys

with open('./dummy.json', 'r') as f:
    for entry in f:
        print(entry)

sys.stdout.flush()

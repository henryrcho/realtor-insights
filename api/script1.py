import sys

with open('../dashboard/src/components/Table/dummy.json', 'r') as f:
    for entry in f:
        print(entry)

sys.stdout.flush()

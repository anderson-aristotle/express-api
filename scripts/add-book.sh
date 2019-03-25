curl localhost:4741/books --include --request 'POST' --header 'Content-Type: application/json' \
    --data '
    {
      "book": {
        "title": "Cloud Atlas",
        "author": "David Mitchell"
      }
    }'

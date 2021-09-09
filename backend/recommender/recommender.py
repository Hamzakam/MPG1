import pymongo
import pprint
import datetime
conn_str = "mongodb+srv://peerhubworks:peerhub@cluster0.hydha.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"

client = pymongo.MongoClient(conn_str, serverSelectionTimeoutMS=5000)

try:
    # print(client.server_info())
    db = client.myFirstDatabase
    print(db)
    posts = db.posts
    postCursor = posts.find({})
    for post in postCursor:
        pprint.pprint(post["tags"])
except Exception:
    print("Unable to connect to the server.")


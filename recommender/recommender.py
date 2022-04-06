# Importing required Libraries
import pandas as pd
import pymongo
import numpy as np
from connStr import conn_str
from pymongo import MongoClient
from sklearn.metrics.pairwise import cosine_similarity

# Connecting to the Database via pymongo client
pymongo.database
client = pymongo.MongoClient(conn_str, serverSelectionTimeoutMS=5000)
db = client.dev
postsDb = db.posts
communitiesDb = db.communities
viewsDb = db.views
usersDb = db.users

# Creating Cursors for various databases to use in Dataframe
postCursor = pd.DataFrame(data=postsDb.find({}))
userCursor = pd.DataFrame(data=usersDb.find({})) 
viewsCursor = pd.DataFrame(data=viewsDb.find({}))
communityCursor = pd.DataFrame(data=communitiesDb.find({}))

# Creating the Post Dataframe by selecting the required features
userFeatures = ['_id', 'username']
postFeatures = ['_id', 'title','tags', 'community']
userDf = userCursor.drop([i for i in userCursor if i not in userFeatures], axis=1)
postDf = postCursor.drop([i for i in postCursor if i not in postFeatures], axis=1)
viewsDf = viewsCursor.drop(['_id','__v'], axis=1)
userDf.rename(columns={'_id':'user_id'}, inplace=True)
viewsDf.rename(columns={'post':'post_id', 'user':'user_id'}, inplace=True)

comm_tagDict = {}
for i in range(len(postDf)):
    for comm in postDf.community:
        comm_tagDict.update({comm:[]})
    for taglst in postDf.tags:
        for tag in taglst:
            comm_tagDict[comm].append(tag)

updated_data = []
for i in comm_tagDict:
    tempDf = postDf[postDf['community']==i]
    id = tempDf['_id'].values[0]
    title = tempDf['title'].values[0]
    community = tempDf['community'].values[0]
    for tag in comm_tagDict[i]:
        tagDict = {}
        tagDict.update({'post_id':id})
        tagDict.update({'title':title})
        tagDict.update({'tag':tag})
        tagDict.update({'community':community})
        updated_data.append(tagDict)

postDataframe = pd.DataFrame(updated_data)
main = pd.merge(viewsDf,postDataframe)

# Implementing the Recommender

posts = list(main['post_id'].unique())
tags = list(main['tag'].unique())
users = list(main['user_id'].unique())

post_profile = {}
for tag in tags:
    post_profile.update({tag:[]})
    for post in posts:
        post_profile[tag].append(1) if tag in list(main[main['post_id']==post]['tag'].unique()) else post_profile[tag].append(0)

for i in post_profile:
    post_profile[i] = np.array(post_profile[i])

# Calculating the weight of tags and 
user_profile = {}
for i in users:
    user_profile.update({i:[]})
    curr_user  = main[main['user_id']==i]
    curr_user_tag = list(curr_user['tag'].unique())
    curr_user_post = list(curr_user['post_id'].unique())
    tag_weight =  {}
    res_vec = np.array([0 for i in range(len(posts))])
    for j in curr_user_tag:
        tag_weight.update({j:0})
        for k in list(curr_user['tag']):
            if j==k:
                tag_weight[j]+=1
        tag_weight[j] = tag_weight[j]/len(curr_user_post)
        res_vec += int(tag_weight[j]*post_profile[j])
        user_profile[i] = res_vec/len(curr_user_post)

# Implementation of the recommender function
def recommender(user_id, user_profile = user_profile, post_profile = post_profile):
    similarity = {}
    for i in post_profile:
        similarity.update({i:cosine_similarity(user_profile[user_id].reshape(-1,1), post_profile[i].reshape(-1,1))})
        sorted_similarity = sorted(similarity.items(), key=lambda x: x[1], reverse=True)
        user_posts = list(main[main['user_id']==user_id]['post_id'].unique())
        print("posts user has viewed:{}".format(user_posts))
        print("Tags viewed by users:{}".format(list(main[main['user_id']==user_id]['tag'].unique())))

        recommendations = []
        for i in sorted_similarity:
            tag_post = list(main[main['tag']==i[0]]['post_id'].unique())
            for j in tag_post:
                if j not in user_posts:
                    recommendations.append([i[0], j])
            if len(recommendations) == 1:
                break
        if recommendations:
            return recommendations
        else:
            return "Explore more posts and communities to get recommendations."

            
# recommender(users[0])
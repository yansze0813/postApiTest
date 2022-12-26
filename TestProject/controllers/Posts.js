const { json } = require('express')
const {get} = require('axios')

const getTopPosts = async(req, res, next) => {
    try {
        // - post_id 
        // - post_title
        // - post_body 
        // - total_number_of_comments
        let postsResponse = await get('https://jsonplaceholder.typicode.com/posts', { 
            headers: { "Accept-Encoding": "gzip,deflate,compress" } 
        })
        let commentsResponse = await get('https://jsonplaceholder.typicode.com/comments', { 
            headers: { "Accept-Encoding": "gzip,deflate,compress" } 
        })
        if (postsResponse == null || postsResponse.data == null || postsResponse.data.length == 0 
            || commentsResponse == null || commentsResponse.data == null || commentsResponse.data.length == 0) return res.json(`no data response`)

        let postsData = postsResponse.data
        let commentsData = commentsResponse.data
        const accumCountResult = [...commentsData.reduce( (accumulatedArray, currentObject) => {
            if (!accumulatedArray.find(element => element.postId == currentObject.postId)) accumulatedArray.push({ postId: currentObject.postId, count: 0 });
            accumulatedArray.find(element => element.postId == currentObject.postId).count++;
            return accumulatedArray;
        },[])];

        let postsWithCounts = postsData.map(post => {
            let newPostData = {
                post_id: post.id,
                post_title: post.title,
                post_body: post.body,
                total_number_of_comments: 0
            }
            let targetCountResult = accumCountResult.find(accumCount => accumCount.postId == post.id)
            if (targetCountResult) {
                newPostData.total_number_of_comments = targetCountResult.count
            }
            return newPostData
        })
        postsWithCounts.sort((a,b) => {
            if (a.total_number_of_comments == b.total_number_of_comments) return a.post_id - b.post_id
            return a.total_number_of_comments - b.total_number_of_comments
        })
        res.json(postsWithCounts)
    } catch (error) {
        return res.json(error)
    }
}

const getfilteredPosts = async(req, res, next) => {
    try {
        let commentsResponse = await get('https://jsonplaceholder.typicode.com/comments', { 
            headers: { "Accept-Encoding": "gzip,deflate,compress" } 
        })
        if (commentsResponse == null || commentsResponse.data == null || commentsResponse.data.length == 0) return res.json(`no data response`)

        let commentsData = commentsResponse.data
        let {
            name,
            email,
            content,
        } = req.query
        let filteredComments = commentsData
        if (name != null && name != "") {
            filteredComments = filteredComments.filter((comment) => {
                return comment.name.includes(name)
            })
        }

        if (email != null && email != "") {
            filteredComments = filteredComments.filter((comment) => {
                return comment.email.includes(email)
            })
        }

        if (content != null && content != "") {
            filteredComments = filteredComments.filter((comment) => {
                return comment.body.includes(content)
            })
        }

        res.json(filteredComments)
    } catch (error) {
        return res.json(error)
    }
}

module.exports = {
    getTopPosts,
    getfilteredPosts
}
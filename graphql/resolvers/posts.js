//Packagess

//Modelss
const Post = require('../../mongoose/dbs/posts').models.post;

module.exports =  {
    //Create
   
    //Read
    getPublishedContent: async ({pageInput}, req) =>{
        const totalPost = await Post.find().countDocuments() || 0;
        const posts = await Post.find()
            .sort({createdAt: 'desc'})
            .skip((pageInput.page -1)*pageInput.perPage)
            .limit(pageInput.perPage);
        
        return { 
            posts: posts.map(p => {
                return {
                    ...p._doc,
                    _id: p._id.toString(),
                    createdAt: p.createdAt.toISOString()
                };
            }) || [],
            totalPosts: totalPost
        };
    },
    getSinglePost: async ({postId}, req) => {
        const post = await Post.findById(postId);
        if(!post){ 
            const error = new Error('Post not found');
            error.code = 404;
            throw error;
        }

        return {
            ...post._doc,
            _id: post._id.toString(),
            createdAt: post.createdAt.toISOString()
        };
    },
    //Update

    //Delete
    
};
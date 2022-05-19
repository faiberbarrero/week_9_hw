const axios = require('axios')
const { GraphQLID } = require('graphql')

const userData = async (req, res, next) => {
    if (!req.verifiedUser) {
        next()
        return
    }

    const query = `
        query user($id: ID!) { 
            user( id: $id ) {
                id,
                posts {
                    id,
                    slug,
                    title,
                    description,
                    questions {
                        title,
                        order,
                        correctAnswer
                    },
                    submissions {
                        score,
                        userId
                    },
                    avgScore
                },
                submissions {
                    id,
                    userId,
                    postId,
                    post {
                        title,
                        description
                    },
                    score
                }
            } 
        }`
    console.log(req.verifiedUser.user._id)
    let data = {}
    try {
        data = await axios.post(process.env.GRAPHQL_ENDPOINT, 
        { 
            query,
            variables: {
                id: req.verifiedUser.user._id
            }
        },
        {
            headers: {
                'Content-Type': 'application/json',
            }
        }); 
    } catch(e) {
        console.log(e.response.data)
    }

    req.verifiedUser.user.posts = data.data.data.user?.posts ?? []
    req.verifiedUser.user.submissions = data.data.data.user?.submissions ?? []

    next()
}

module.exports = { userData }
// Import built in GraphQL data types
const { GraphQLObjectType, GraphQLInputObjectType, 
	GraphQLID, GraphQLString, GraphQLList, GraphQLInt, 
	GraphQLBoolean, GraphQLFloat } = require('graphql')

// Import our models so that we can interact with the DB
const { User, Post, Question, Submission } = require('../models')

const UserType = new GraphQLObjectType({
    name: 'User',
    description: 'User Type',
    fields: () => ({
    id: { type: GraphQLID },
    username: { type: GraphQLString },
    email: { type: GraphQLString },
    posts: {
        type: new GraphQLList(PostType),
        resolve(parent, args) {
            return Post.find({ userId : parent.id })
        }
    },
    submissions: {
        type: new GraphQLList(SubmissionType),
        resolve(parent, args) {
            return Submission.find({ userId : parent.id })
        }
    }
})
})

const QuestionType = new GraphQLObjectType({
    name: 'Question',
    description: 'Question type',
    fields: () => ({
        id: { type: GraphQLID },
        title: { type: GraphQLString },
        correctAnswer: { type: GraphQLString },
        postId: { type: GraphQLString },
        order: { type: GraphQLInt },
        post: { 
            type: PostType,
            resolve(parent, args) {
                return User.findById(parent.postId)
            }
        }
    })
})

const QuestionInputType = new GraphQLInputObjectType({
    name: 'QuestionInput',
    description: 'Question input type',
    fields: () => ({
        title: { type: GraphQLString },
        order: { type: GraphQLInt },
        correctAnswer: { type: GraphQLString }
    })
})

const AnswerInputType = new GraphQLInputObjectType({
    name: 'AnswerInput',
    description: 'Answer input type for post submits',
    fields: () => ({
        questionId: { type: GraphQLString },
        answer: { type: GraphQLString }
    })
})

const PostType = new GraphQLObjectType({
    name: 'Post',
    description: 'Post type',
    fields: () => ({
        id: { type: GraphQLID },
        slug: { type: GraphQLString },
        title: { type: GraphQLString },
        description: { type: GraphQLString },
        userId: { type: GraphQLString },
        user: { 
            type: UserType,
            resolve(parent, args) {
                return User.findById(parent.userId)
            }
        },
        questions: { 
            type: new GraphQLList(QuestionType),
            resolve(parent, args) {
                return Question.find({ postId: parent.id })
            }
        },
        submissions: {
            type: new GraphQLList(SubmissionType),
            resolve(parent, args) {
                return Submission.find({ postId: parent.id })
            }
        },
        avgScore: {
            type: GraphQLFloat,
            async resolve(parent, args) {
                const submissions = await Submission.find({ postId: parent.id })
                let score = 0

                console.log(submissions)
                for (const submission of submissions) {
                    score += submission.score
                }

                return score / submissions.length
            }
        }
    })
})

const SubmissionType = new GraphQLObjectType({
    name: 'Submission',
    description: 'Submission type',
    fields: () => ({
        id: { type: GraphQLID },
        postId: { type: GraphQLString },
        userId: { type: GraphQLString },
        score: { type: GraphQLInt },
        user: { 
            type: UserType,
            resolve(parent, args) {
                return User.findById(parent.userId)
            }
        },
        post: { 
            type: PostType,
            resolve(parent, args) {
                return Post.findById( parent.postId )
            }
        }
    })
})

module.exports = {
    UserType,
    PostType,
    QuestionType,
    QuestionInputType,
    AnswerInputType,
    SubmissionType
}
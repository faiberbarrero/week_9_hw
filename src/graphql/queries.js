const { GraphQLList, GraphQLID, GraphQLString } = require('graphql')
const { UserType, PostType, SubmissionType } = require('./types')
const { User, Post, Submission } = require('../models')

const users = {
    type: new GraphQLList(UserType),
    description: 'Query all users in the database',
    resolve(parent, args) {
        return User.find()
    }
}

const user = {
    type: UserType,
    description: 'Query user by id',
    args: {
        id: { type: GraphQLID }
    },
    resolve(parent, args) {
        return User.findById(args.id)
    }
}

const postBySlug = {
    type: PostType,
    description: 'Query post by slug value',
    args: {
        slug: { type: GraphQLString }
    },
    async resolve(parent, args) {
        return Post.findOne({ slug: args.slug })
    }
}

const submissionById = {
    type: SubmissionType,
    description: 'Query post submission by id',
    args: {
        id: { type: GraphQLString }
    },
    async resolve(parent, args) {
        return Submission.findById(args.id)
    }
}

module.exports = { users, user, postBySlug, submissionById }


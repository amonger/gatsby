const path = require('path')

exports.createPages = ({boundActionCreators, graphql}) => {
    const { createPage } = boundActionCreators
    const postTemplate = path.resolve(`src/templates/blog-page.js`)

    return graphql(`
        query MyQuerys {
            allMarkdownRemark {
              edges {
                node {
                  frontmatter {
                    title
                    date
                    path
                  }
                  excerpt
                }
              }
            }
          }
    `).then(res => {
        if (res.errors) {
            return Promise.reject(res.errors)
        }

        res.data.allMarkdownRemark.edges.forEach(({node}) => {
            createPage({
                path: node.frontmatter.path,
                component: postTemplate
            })
        })
    })
}
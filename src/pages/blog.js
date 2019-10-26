import React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"
import { graphql } from "gatsby"

const IndexPage = ({data}) => (
  <Layout>
    <SEO title="Home" />
    <h1>Latest posts</h1>
    {data.allMarkdownRemark.edges.map(post => (
      <div>
        <h1>{post.node.frontmatter.title}</h1>
        <p>
          {post.node.excerpt}
        </p>
        <Link to={post.node.frontmatter.path}>Read More...</Link>
      </div>
    ))}
  </Layout>
)

export const pageQuery = graphql`
query MyQueryi {
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
`

export default IndexPage

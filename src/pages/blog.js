import React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import Image from "../components/image"
import SEO from "../components/seo"
import { graphql } from "gatsby"

const IndexPage = ({data}) => (
  <Layout>
    <SEO title="Home" />
    <h1>Latest posts</h1>
    {data.allMarkdownRemark.edges.map(post => (
      <div>
        <h1>{post.node.frontmatter.title}</h1>
      </div>
    ))}
  </Layout>
)

export const pageQuery = graphql`
query MyQuery {
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

import React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"
import { graphql } from "gatsby"

const IndexPage = ({data}) => {
	const post = data.markdownRemark
	return <Layout>
		<SEO title="Home" />
		<h1>{post.frontmatter.title}</h1>
		<div dangerouslySetInnerHTML={{ __html: post.html}} />
	</Layout>
}

export const pageQuery = graphql`
	query PostQuery ($path: String!) {
		markdownRemark(frontmatter:{ path: { eq: $path}}) {
			frontmatter {
				title
				date
			}
			html
		}
	}
`

export default IndexPage

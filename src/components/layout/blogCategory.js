import React from 'react'
import kebabCase from '../utils/kebabCase'
import { graphql, Link } from 'gatsby'
import { object } from 'prop-types'

const BlogCategory = ({ data, pageContext }) => {
  const { allMarkdownRemark } = data

  return (
    <>
      <h1>Categories:</h1>
      {pageContext.allCategories.map((cat, i) => (
        <Link key={i} to={`/blog/category/${kebabCase(cat)}`}>
          {cat}
        </Link>
      ))}
      <br />

      {allMarkdownRemark.edges.map(({ node }) => {
        const imageSource = node.frontmatter.image.childImageSharp.fluid.src

        return (
          <>
            <Link to={node.fields.slug}>
              <img src={imageSource} alt={node.frontmatter.title} />
              <h1>{node.frontmatter.title}</h1>
            </Link>
            <p>{node.frontmatter.date}</p>
            <p>By {node.frontmatter.author}</p>
            <p>
              In:{' '}
              {node.frontmatter.category.map((cat, i) => (
                <Link key={i} to={`/blog/category/${kebabCase(cat)}`}>
                  {cat}
                </Link>
              ))}
            </p>
          </>
        )
      })}

      <ul>
        {Array.from({ length: pageContext.numPages }).map((item, i) => {
          const index = i + 1
          const category = kebabCase(pageContext.category)
          const link =
            index === 1
              ? `/blog/category/${category}`
              : `/blog/category/${category}/page/${index}`

          return (
            <li key={i}>
              {pageContext.currentPage === index ? (
                <span>{index}</span>
              ) : (
                <a href={link}>{index}</a>
              )}
            </li>
          )
        })}
      </ul>
    </>
  )
}
BlogCategory.propTypes = {
  data: object,
  pageContext: object,
}
export default BlogCategory

export const query = graphql`
  query blogPostsListByCategory($category: String, $skip: Int!, $limit: Int!) {
    allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { category: { in: [$category] } } }
      limit: $limit
      skip: $skip
    ) {
      edges {
        node {
          fields {
            slug
          }
          frontmatter {
            title
            date
            author
            category
            image {
              childImageSharp {
                fluid {
                  src
                }
              }
            }
          }
        }
      }
    }
  }
`

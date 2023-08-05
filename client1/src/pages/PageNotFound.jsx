import React from 'react'
import Layout from '../components/Layout/Layout'
import { Link } from 'react-router-dom'

const PageNotFound = () => {
    return (
        <Layout title="Page Not Found">
            <div className="pnf">
                <h1 className="pnf-header">404</h1>
                <h3 className="pnf-text">Oops! Page Not Fount</h3>
                <Link to="/" className="pnf-btn">Go Back</Link>
            </div>
        </Layout>
    )
}

export default PageNotFound
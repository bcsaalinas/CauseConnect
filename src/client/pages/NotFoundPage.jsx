import React from 'react';
import { Link } from 'react-router-dom';
import useDocumentTitle from '../hooks/useDocumentTitle';

function NotFoundPage() {
  useDocumentTitle("Page not found");
  return (
    <section className="page-section" data-animate="section">
      <div className="content-max text-center">
        <h1 className="display-4 mb-3">Page not found</h1>
        <p className="mb-4">The page you’re looking for doesn’t exist. Head back to the homepage to keep exploring.</p>
        <Link to="/" className="btn btn-pill btn-pill-primary">
          Go home
        </Link>
      </div>
    </section>
  );
}

export default NotFoundPage;

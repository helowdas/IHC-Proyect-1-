import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAllBlogs, createBlog } from '../hooks/useBlogs';
import BlogEditor from '../components/ui/blog/BlogEditor';

export default function Blogs() {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setPosts(getAllBlogs());
  }, []);

  const handleCreated = (post) => {
    setPosts(getAllBlogs());
    // navegar al post creado
    navigate(`/blogs/${post.id}`);
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Blogs</h2>
        <Link to="/editor" className="btn btn-outline-secondary">Ir al Editor</Link>
      </div>

      <div className="row">
        <div className="col-md-8">
          {posts.length === 0 && (
            <div className="alert alert-info">No hay posts aún. Crea el primero.</div>
          )}
          {posts.map((p) => (
            <article key={p.id} className="card mb-3">
              <div className="card-body">
                <h5 className="card-title">{p.title}</h5>
                <p className="card-text text-truncate" style={{ maxHeight: 60 }}>{p.body}</p>
                <div className="d-flex justify-content-between align-items-center">
                  <small className="text-muted">{new Date(p.createdAt).toLocaleString()}</small>
                  <Link to={`/blogs/${p.id}`} className="btn btn-sm btn-primary">Ver</Link>
                </div>
              </div>
            </article>
          ))}
        </div>
        <div className="col-md-4">
          <div className="sticky-top pt-3">
            <h5>Crear nuevo post</h5>
            <BlogEditor onCreated={handleCreated} />
          </div>
        </div>
      </div>
    </div>
  );
}

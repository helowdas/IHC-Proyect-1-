import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getBlog, addComment, toggleReaction } from '../hooks/useBlogs';
import CommentList from '../components/ui/blog/CommentList';
import CommentForm from '../components/ui/blog/CommentForm';
import ReactionButtons from '../components/ui/blog/ReactionButtons';
import ShareButton from '../components/ui/blog/ShareButton';

export default function BlogPost() {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    setPost(getBlog(id));
  }, [id]);

  if (!post) return (
    <div className="container py-4">
      <div className="alert alert-warning">Post no encontrado.</div>
      <Link to="/blogs" className="btn btn-outline-primary">Volver a Blogs</Link>
    </div>
  );

  const handleComment = (data) => {
    addComment(id, data);
    setPost(getBlog(id));
  };

  const handleReact = (kind) => {
    toggleReaction(id, kind);
    setPost(getBlog(id));
  };

  return (
    <div className="container py-4">
      <div className="mb-3 d-flex justify-content-between align-items-start">
        <div>
          <h1>{post.title}</h1>
          <small className="text-muted">{new Date(post.createdAt).toLocaleString()}</small>
        </div>
        <div className="d-flex gap-2">
          <ShareButton post={post} />
          <Link to="/blogs" className="btn btn-outline-secondary">Volver</Link>
        </div>
      </div>

      {post.image && (
        <div className="mb-3">
          <img src={post.image} alt="" className="img-fluid rounded" />
        </div>
      )}

      <div className="mb-4">
        <p style={{ whiteSpace: 'pre-wrap' }}>{post.body}</p>
      </div>

      <ReactionButtons reactions={post.reactions} onReact={handleReact} />

      <hr />
      <CommentList comments={post.comments} />
      <CommentForm onSubmit={handleComment} />
    </div>
  );
}

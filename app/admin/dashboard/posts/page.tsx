'use client';

import { useState, useEffect } from 'react';
import { Post } from '@/libs/models/post';
import ImageUpload from '@/components/admin/ImageUpload';
import RichTextEditor from '@/components/admin/RichTextEditor';
import BilingualField from '@/components/admin/BilingualField';

const PostsPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<Partial<Post>>({
    title: '',
    titleAr: '',
    content: '',
    contentAr: '',
    excerpt: '',
    excerptAr: '',
    image: '',
    video: '',
    tags: [],
    authorId: 1,
    enabled: true,
  });
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/posts');
      const result = await res.json();
      if (result.success) {
        setPosts(result.data);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const postId = editingPost?._id ? String(editingPost._id) : editingPost?.id ? String(editingPost.id) : null;
      const url = postId 
        ? `/api/posts/${postId}`
        : '/api/posts';
      const method = postId ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      const result = await res.json();
      if (result.success) {
        await fetchPosts();
        resetForm();
        setIsAdding(false);
      } else {
        alert(result.error || 'Failed to save post');
      }
    } catch (error) {
      console.error('Error saving post:', error);
      alert('Failed to save post');
    }
  };

  const handleEdit = (post: Post) => {
    setEditingPost(post);
    setFormData({
      title: post.title || '',
      titleAr: post.titleAr || '',
      content: post.content || '',
      contentAr: post.contentAr || '',
      excerpt: post.excerpt || '',
      excerptAr: post.excerptAr || '',
      image: post.image || '',
      video: post.video || '',
      tags: post.tags || [],
      authorId: post.authorId || 1,
      enabled: post.enabled !== undefined ? post.enabled : true,
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) {
      return;
    }
    
    try {
      const res = await fetch(`/api/posts/${id}`, {
        method: 'DELETE',
      });
      const result = await res.json();
      if (result.success) {
        await fetchPosts();
      } else {
        alert(result.error || 'Failed to delete post');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      titleAr: '',
      content: '',
      contentAr: '',
      excerpt: '',
      excerptAr: '',
      image: '',
      video: '',
      tags: [],
      authorId: 1,
      enabled: true,
    });
    setEditingPost(null);
    setIsAdding(false);
    setTagInput('');
  };

  const addTag = () => {
    if (tagInput.trim()) {
      setFormData({
        ...formData,
        tags: [...(formData.tags || []), tagInput.trim()],
      });
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: (formData.tags || []).filter(t => t !== tag),
    });
  };

  if (loading) {
    return <div className="admin-loading">Loading...</div>;
  }

  return (
    <div className="admin-cms-container">
      <div className="admin-cms-header">
        <h1>Posts Management</h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="button"
            className="button button-primary"
            onClick={() => {
              resetForm();
              setIsAdding(true);
            }}
          >
            + Add New Post
          </button>
        </div>
      </div>

      {(editingPost || isAdding) && (
        <div className="admin-edit-panel" style={{ marginBottom: '30px' }}>
          <div className="admin-edit-panel-header">
            <div className="admin-edit-panel-title">
              <strong>{editingPost ? 'Editing Post' : 'Add New Post'}</strong>
              <span>{editingPost ? `Editing: ${editingPost.title}` : 'Create a new post'}</span>
            </div>
            <button type="button" className="admin-btn admin-btn-edit" onClick={resetForm}>✕ Close</button>
          </div>
            <form onSubmit={handleSubmit} className="admin-cms-form">
              <BilingualField
                label="Title"
                enValue={formData.title || ''}
                arValue={formData.titleAr || ''}
                onEnChange={(value) => setFormData({ ...formData, title: value })}
                onArChange={(value) => setFormData({ ...formData, titleAr: value })}
                type="text"
                required
              />

              <BilingualField
                label="Excerpt"
                enValue={formData.excerpt || ''}
                arValue={formData.excerptAr || ''}
                onEnChange={(value) => setFormData({ ...formData, excerpt: value })}
                onArChange={(value) => setFormData({ ...formData, excerptAr: value })}
                type="textarea"
                rows={3}
                required
              />

              <BilingualField
                label="Content"
                enValue={formData.content || ''}
                arValue={formData.contentAr || ''}
                onEnChange={(value) => setFormData({ ...formData, content: value })}
                onArChange={(value) => setFormData({ ...formData, contentAr: value })}
                type="richtext"
                required
              />

              <ImageUpload
                value={formData.image || ''}
                onChange={(url) => setFormData({ ...formData, image: url })}
                placeholder="/img/blog/blog-1.jpg"
                folder="blog"
                required
                label="Image"
              />

              <div className="form-group">
                <label>Video URL (optional)</label>
                <input
                  type="text"
                  value={formData.video || ''}
                  onChange={(e) => setFormData({ ...formData, video: e.target.value || null })}
                />
              </div>

              <div className="form-group">
                <label>Tags</label>
                <div className="admin-tag-input-row">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addTag();
                      }
                    }}
                    placeholder="Add tag and press Enter"
                  />
                  <button type="button" onClick={addTag} className="admin-btn admin-btn-edit">Add</button>
                </div>
                <div className="admin-tag-list">
                  {(formData.tags || []).map((tag, index) => (
                    <span key={index} className="admin-tag">
                      {tag}
                      <button type="button" onClick={() => removeTag(tag)} className="admin-tag-remove">×</button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Author ID</label>
                <input
                  type="number"
                  value={formData.authorId}
                  onChange={(e) => setFormData({ ...formData, authorId: parseInt(e.target.value) })}
                  min={1}
                />
              </div>

              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={formData.enabled}
                    onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
                  />
                  {' '}Published
                </label>
              </div>

              <div className="form-actions">
                <button type="submit" className="button button-primary">
                  {editingPost ? 'Update Post' : 'Create Post'}
                </button>
                <button type="button" className="admin-btn admin-btn-edit" onClick={resetForm}>Cancel</button>
              </div>
            </form>
        </div>
      )}

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Title</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.length === 0 ? (
              <tr>
                <td colSpan={5} className="admin-table-empty">
                  No posts found. Click &ldquo;Add New Post&rdquo; to create one.
                </td>
              </tr>
            ) : (
              posts.map((post) => {
                const postId = post._id ? String(post._id) : post.id ? String(post.id) : null;
                const editingPostId = editingPost?._id ? String(editingPost._id) : editingPost?.id ? String(editingPost.id) : null;
                const isEditing = postId === editingPostId;
                
                return (
                  <tr key={post._id || post.id} className={isEditing ? 'admin-table-row-active' : ''}>
                    <td>
                      <div className="admin-section-thumb">
                        {post.image ? (
                          <img src={post.image} alt={post.title || "Post image"} />
                        ) : (
                          <span className="admin-section-thumb-placeholder">
                            No Image
                          </span>
                        )}
                      </div>
                    </td>
                    <td><strong>{post.title}</strong></td>
                    <td>{post.created_at ? new Date(post.created_at).toLocaleDateString() : 'N/A'}</td>
                    <td>
                      <span className={`admin-badge ${post.enabled !== false ? 'published' : 'draft'}`}>
                        {post.enabled !== false ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td>
                      <div className="admin-table-actions">
                        <button 
                          type="button" 
                          onClick={() => isEditing ? resetForm() : handleEdit(post)} 
                          className={`admin-btn ${isEditing ? 'admin-btn-delete' : 'admin-btn-edit'}`}
                        >
                          {isEditing ? 'Close' : 'Edit'}
                        </button>
                        {!isEditing && (
                          <button
                            type="button"
                            onClick={() => {
                              if (postId) handleDelete(postId);
                            }}
                            className="admin-btn admin-btn-delete"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PostsPage;

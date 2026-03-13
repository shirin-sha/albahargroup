'use client';

import { useState, useEffect } from 'react';
import { Post } from '@/libs/models/post';
import ImageUpload from '@/components/admin/ImageUpload';

const PostsPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [formData, setFormData] = useState<Partial<Post>>({
    title: '',
    titleAr: '',
    category: '',
    categoryAr: '',
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
      category: post.category || '',
      categoryAr: post.categoryAr || '',
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
    setShowForm(true);
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
      category: '',
      categoryAr: '',
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
    setShowForm(false);
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
        <button
          type="button"
          className="button button-primary"
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
        >
          + Add New Post
        </button>
      </div>

      {showForm && (
        <div className="admin-cms-form-container" style={{ marginBottom: '30px' }}>
          <div className="admin-cms-section-card">
            <div className="admin-cms-section-header">
              <h3>{editingPost ? 'Edit Post' : 'Add New Post'}</h3>
              <button
                type="button"
                className="admin-cms-toggle"
                onClick={resetForm}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit} className="admin-cms-form">
              <div className="form-group">
                <label>Title (English) *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Title (Arabic)</label>
                <input
                  type="text"
                  value={formData.titleAr}
                  onChange={(e) => setFormData({ ...formData, titleAr: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Category (English) *</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Category (Arabic)</label>
                <input
                  type="text"
                  value={formData.categoryAr}
                  onChange={(e) => setFormData({ ...formData, categoryAr: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Excerpt (English) *</label>
                <textarea
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  rows={3}
                  required
                />
              </div>

              <div className="form-group">
                <label>Excerpt (Arabic)</label>
                <textarea
                  value={formData.excerptAr}
                  onChange={(e) => setFormData({ ...formData, excerptAr: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="form-group">
                <label>Content (English) *</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={10}
                  required
                />
              </div>

              <div className="form-group">
                <label>Content (Arabic)</label>
                <textarea
                  value={formData.contentAr}
                  onChange={(e) => setFormData({ ...formData, contentAr: e.target.value })}
                  rows={10}
                />
              </div>

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
                <button type="button" onClick={resetForm} className="button">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Title</th>
              <th>Category</th>
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
              posts.map((post) => (
                <tr key={post._id || post.id}>
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
                  <td>{post.category}</td>
                  <td>{post.created_at ? new Date(post.created_at).toLocaleDateString() : 'N/A'}</td>
                  <td>
                    <span className={`admin-badge ${post.enabled !== false ? 'published' : 'draft'}`}>
                      {post.enabled !== false ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td>
                    <div className="admin-table-actions">
                      <button type="button" onClick={() => handleEdit(post)} className="admin-btn admin-btn-edit">Edit</button>
                      <button
                        type="button"
                        onClick={() => {
                          const postId = post._id ? String(post._id) : post.id ? String(post.id) : null;
                          if (postId) handleDelete(postId);
                        }}
                        className="admin-btn admin-btn-delete"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PostsPage;

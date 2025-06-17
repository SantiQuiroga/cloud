import { useState, useEffect } from 'react';
import { PostService } from '../services/postService';
import { Post, CreatePostData } from '../types';
import type { User } from 'firebase/auth';

export const usePosts = (user: User | null) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadUserPosts = async () => {
    if (!user?.uid) return;

    try {
      setLoading(true);
      setError(null);
      const userPosts = await PostService.getUserPosts(user.uid);
      setPosts(userPosts);
    } catch (err) {
      setError('Error al cargar los posts');
      console.error('Error loading posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const createPost = async (postData: CreatePostData) => {
    if (!user?.uid || !user?.email) {
      setError('Usuario no autenticado');
      return false;
    }

    try {
      setLoading(true);
      setError(null);
      const newPost = await PostService.createPost(user.uid, user.email, postData);
      setPosts(prev => [newPost, ...prev]);
      return true;
    } catch (err) {
      setError('Error al crear el post');
      console.error('Error creating post:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deletePost = async (postId: string) => {
    try {
      setLoading(true);
      setError(null);
      await PostService.deletePost(postId);
      setPosts(prev => prev.filter(post => post.id !== postId));
      return true;
    } catch (err) {
      setError('Error al eliminar el post');
      console.error('Error deleting post:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadPosts = async () => {
      if (!user?.uid) {
        setPosts([]);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const userPosts = await PostService.getUserPosts(user.uid);
        setPosts(userPosts);
      } catch (err) {
        setError('Error al cargar los posts');
        console.error('Error loading posts:', err);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, [user?.uid]);

  return {
    posts,
    loading,
    error,
    createPost,
    deletePost,
    refreshPosts: loadUserPosts
  };
};

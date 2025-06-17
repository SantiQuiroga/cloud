'use client';

import { useState } from 'react';
import { User } from 'firebase/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/atoms/Card';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Textarea } from '@/components/atoms/Textarea';
import { Label } from '@/components/atoms/Label';
import { MessageDisplay } from '@/components/molecules/MessageDisplay';
import { Trash2 } from 'lucide-react';
import { usePosts } from './hooks/usePosts';
import type { Post, CreatePostData } from './types';

interface PostsManagerProps {
  user: User;
}

interface CreatePostFormProps {
  onSubmit: (data: CreatePostData) => Promise<boolean>;
  loading?: boolean;
}

interface PostListProps {
  posts: Post[];
  onDeletePost: (postId: string) => Promise<boolean>;
  loading?: boolean;
}

// Consolidated CreatePostForm component
function CreatePostForm({ onSubmit, loading = false }: CreatePostFormProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) return;

    setIsSubmitting(true);
    const success = await onSubmit({ title: title.trim(), content: content.trim() });

    if (success) {
      setTitle('');
      setContent('');
    }

    setIsSubmitting(false);
  };

  const isDisabled = loading || isSubmitting || !title.trim() || !content.trim();

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Crear Nuevo Post</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              placeholder="Escribe el título de tu post..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Contenido</Label>
            <Textarea
              id="content"
              placeholder="Escribe el contenido de tu post..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={isSubmitting}
              rows={5}
            />
          </div>

          <Button
            type="submit"
            disabled={isDisabled}
            className="w-full"
          >
            {isSubmitting ? 'Creando...' : 'Crear Post'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function PostList({ posts, onDeletePost, loading = false }: PostListProps) {
  const handleDelete = async (postId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este post?')) {
      await onDeletePost(postId);
    }
  };

  if (posts.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-gray-500">
          No tienes posts aún. ¡Crea tu primer post!
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">Mis Posts ({posts.length})</h3>
      {posts.map((post) => (
        <Card key={post.id}>
          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
            <CardTitle className="text-lg">{post.title}</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => post.id && handleDelete(post.id)}
              disabled={loading}
              className="text-red-600 hover:text-red-800 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 whitespace-pre-wrap">{post.content}</p>
            <div className="mt-4 text-sm text-gray-500">
              Creado el {post.createdAt.toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function PostsManager({ user }: PostsManagerProps) {
  const { posts, loading, error, createPost, deletePost } = usePosts(user);

  return (
    <div className="space-y-6">
      <CreatePostForm
        onSubmit={createPost}
        loading={loading}
      />

      {error && (
        <MessageDisplay message={error} type="error" />
      )}

      <PostList
        posts={posts}
        onDeletePost={deletePost}
        loading={loading}
      />
    </div>
  );
}

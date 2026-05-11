import { useRef, useState } from 'react';
import * as memosApi from '../api/memos';
import { useAuthStore } from '../store/authStore';
import type { Memo } from '../types';

interface Props {
  memo: Memo;
  onUpdate: (id: number, content: string, imageUrl: string | null) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

export default function MemoCard({ memo, onUpdate, onDelete }: Props) {
  const userId = useAuthStore((s) => s.userId);
  const isOwner = memo.owner_id === userId;

  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(memo.content);
  const [imageUrl, setImageUrl] = useState<string | null>(memo.image_url);
  const [newFile, setNewFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setNewFile(file);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setNewFile(null);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setImageUrl(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleSave = async () => {
    const trimmed = content.trim();
    if (!trimmed || loading) return;
    setLoading(true);
    try {
      let finalImageUrl = imageUrl;
      if (newFile) {
        const { data } = await memosApi.uploadImage(newFile);
        finalImageUrl = data.url;
      }
      await onUpdate(memo.id, trimmed, finalImageUrl);
      setIsEditing(false);
      setNewFile(null);
      setPreview(null);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setContent(memo.content);
    setImageUrl(memo.image_url);
    setNewFile(null);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (!confirm('이 메모를 삭제하시겠습니까?')) return;
    await onDelete(memo.id);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); handleSave(); }
    if (e.key === 'Escape') handleCancel();
  };

  const displayImage = preview ?? (imageUrl ?? null);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col overflow-hidden">
      {/* 이미지 영역 */}
      {displayImage && !isEditing && (
        <img
          src={displayImage}
          alt="첨부 이미지"
          className="w-full h-40 object-cover"
        />
      )}

      <div className="p-4 flex flex-col gap-3 flex-1">
        {/* 작성자 배지 */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-400 truncate max-w-[160px]">
            {memo.owner_email}
          </span>
          {isOwner && (
            <span className="text-xs bg-indigo-50 text-indigo-500 px-1.5 py-0.5 rounded font-medium flex-shrink-0">
              내 메모
            </span>
          )}
        </div>

        {isEditing ? (
          <>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
              rows={3}
              className="w-full resize-none border border-slate-300 rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
            />

            {/* 편집 시 이미지 미리보기 */}
            {displayImage && (
              <div className="relative inline-block">
                <img
                  src={displayImage}
                  alt="첨부 이미지"
                  className="max-h-32 rounded-lg object-cover border border-slate-200"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 bg-slate-700 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-500 transition-colors"
                >
                  ✕
                </button>
              </div>
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="text-xs text-slate-500 hover:text-indigo-600 px-2 py-1.5 rounded-lg hover:bg-indigo-50 transition-colors"
              >
                🖼️ 사진 변경
              </button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleSave}
                disabled={loading}
                className="flex-1 text-sm bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white py-2 rounded-lg transition-colors disabled:opacity-60"
              >
                {loading ? '저장 중...' : '저장'}
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 text-sm border border-slate-300 text-slate-600 py-2 rounded-lg hover:bg-slate-50 transition-colors"
              >
                취소
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="text-sm text-slate-700 whitespace-pre-wrap flex-1 leading-relaxed min-h-[40px]">
              {memo.content}
            </p>

            {isOwner && (
              <div className="flex gap-2">
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex-1 text-xs text-slate-500 border border-slate-200 py-2 rounded-lg hover:bg-slate-50 active:bg-slate-100 transition-colors"
                >
                  수정
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 text-xs text-red-400 border border-red-100 py-2 rounded-lg hover:bg-red-50 active:bg-red-100 transition-colors"
                >
                  삭제
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

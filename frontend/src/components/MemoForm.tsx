import { useRef, useState } from 'react';
import * as memosApi from '../api/memos';

interface Props {
  onCreate: (content: string, imageUrl?: string) => Promise<void>;
}

export default function MemoForm({ onCreate }: Props) {
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImageFile(null);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  const submit = async () => {
    if (!content.trim() || uploading) return;
    setUploading(true);
    try {
      let imageUrl: string | undefined;
      if (imageFile) {
        const { data } = await memosApi.uploadImage(imageFile);
        imageUrl = data.url;
      }
      await onCreate(content.trim(), imageUrl);
      setContent('');
      removeImage();
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submit();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="새 메모를 입력하세요..."
        rows={3}
        className="w-full resize-none border-0 focus:outline-none text-slate-700 placeholder:text-slate-400 bg-transparent"
      />

      {/* 이미지 미리보기 */}
      {preview && (
        <div className="relative mt-2 inline-block">
          <img
            src={preview}
            alt="첨부 이미지 미리보기"
            className="max-h-40 rounded-lg object-cover border border-slate-200"
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

      <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100 gap-2">
        <div className="flex items-center gap-2">
          {/* 이미지 첨부 버튼 */}
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-indigo-600 px-2 py-1.5 rounded-lg hover:bg-indigo-50 transition-colors"
          >
            <span>🖼️</span>
            <span className="hidden sm:inline">사진 추가</span>
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          <span className="hidden sm:block text-xs text-slate-300">·</span>
          <span className="hidden sm:block text-xs text-slate-400">Ctrl + Enter 로 저장</span>
        </div>

        <button
          type="submit"
          disabled={!content.trim() || uploading}
          className="text-sm bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white px-5 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
        >
          {uploading ? '업로드 중...' : '저장'}
        </button>
      </div>
    </form>
  );
}

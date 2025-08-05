import { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Camera, Upload, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AvatarUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentAvatarUrl?: string;
  onAvatarUpdate: (url: string) => void;
}

export function AvatarUploadDialog({ 
  open, 
  onOpenChange, 
  currentAvatarUrl, 
  onAvatarUpdate 
}: AvatarUploadDialogProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: '檔案過大',
        description: '請選擇小於 5MB 的圖片檔案',
        variant: 'destructive'
      });
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: '檔案格式錯誤',
        description: '請選擇圖片檔案',
        variant: 'destructive'
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!preview) return;

    setUploading(true);

    try {
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, you would upload to Supabase storage here
      // For now, we'll just use the preview URL
      onAvatarUpdate(preview);
      
      toast({
        title: '頭像更新成功',
        description: '您的頭像已成功更新'
      });

      onOpenChange(false);
      setPreview(null);
    } catch (error) {
      toast({
        title: '上傳失敗',
        description: '頭像上傳失敗，請稍後再試',
        variant: 'destructive'
      });
    } finally {
      setUploading(false);
    }
  };

  const handleCancel = () => {
    setPreview(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>更換頭像</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current/Preview Avatar */}
          <div className="flex justify-center">
            <div className="relative">
              <Avatar className="w-32 h-32">
                <AvatarImage 
                  src={preview || currentAvatarUrl} 
                  alt="頭像預覽" 
                />
                <AvatarFallback className="bg-gradient-to-br from-primary to-secondary">
                  <User className="w-16 h-16 text-primary-foreground" />
                </AvatarFallback>
              </Avatar>
              <Button
                size="icon"
                variant="secondary"
                className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full"
                onClick={() => fileInputRef.current?.click()}
              >
                <Camera className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />

          {/* Upload Button */}
          <div className="flex justify-center">
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
              className="w-full"
            >
              <Upload className="w-4 h-4 mr-2" />
              選擇圖片
            </Button>
          </div>

          {/* File Requirements */}
          <div className="text-sm text-muted-foreground text-center space-y-1">
            <p>支援格式：JPG、PNG、GIF</p>
            <p>檔案大小：最大 5MB</p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="flex-1"
            >
              取消
            </Button>
            <Button
              onClick={handleUpload}
              disabled={!preview || uploading}
              className="flex-1"
            >
              {uploading ? '上傳中...' : '更新頭像'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
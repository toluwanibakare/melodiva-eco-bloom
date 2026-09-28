import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { AlertTriangle, Upload, X, Loader2, CheckCircle2, Image as ImageIcon, Video } from 'lucide-react';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface ReportIssueModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: {
    id: string;
    order_number: string;
    phone_number?: string;
    delivery_address?: string;
  };
  currentUser?: {
    full_name?: string;
    email?: string;
    phone_number?: string;
    id?: string;
  };
}

export const ReportIssueModal: React.FC<ReportIssueModalProps> = ({
  isOpen,
  onClose,
  order,
  currentUser,
}) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [customerName, setCustomerName] = useState(currentUser?.full_name || '');
  const [customerEmail, setCustomerEmail] = useState(currentUser?.email || '');
  const [customerPhone, setCustomerPhone] = useState(currentUser?.phone_number || order?.phone_number || '');
  const [issueType, setIssueType] = useState('damaged_item');
  const [description, setDescription] = useState('');
  const [mediaFiles, setMediaFiles] = useState<{ url: string; type: 'image' | 'video'; name: string }[]>([]);
  const [uploadingMedia, setUploadingMedia] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingMedia(true);
    try {
      Array.from(files).forEach((file) => {
        const isVideo = file.type.startsWith('video/');
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setMediaFiles((prev) => [
              ...prev,
              {
                url: event.target!.result as string,
                type: isVideo ? 'video' : 'image',
                name: file.name,
              },
            ]);
          }
        };
        reader.readAsDataURL(file);
      });
      toast({
        title: 'File attached',
        description: 'Proof media attached successfully.',
      });
    } catch (err) {
      console.error('File upload error:', err);
      toast({
        title: 'Upload error',
        description: 'Failed to read file.',
        variant: 'destructive',
      });
    } finally {
      setUploadingMedia(false);
    }
  };

  const removeMedia = (index: number) => {
    setMediaFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerEmail || !description) {
      toast({
        title: 'Missing information',
        description: 'Please provide your name, email, and detailed issue description.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      await api.submitOrderIssue({
        order_id: order.id,
        order_number: order.order_number,
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone,
        issue_type: issueType,
        description,
        media_urls: mediaFiles.map((m) => m.url),
        user_id: currentUser?.id,
      });

      setSuccess(true);
      toast({
        title: 'Issue Reported',
        description: 'Your report has been submitted. Our support team will review within 24 hours.',
      });
    } catch (error: any) {
      console.error('Submit issue error:', error);
      toast({
        title: 'Submission Failed',
        description: error.message || 'Failed to submit issue report.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResetAndClose = () => {
    setSuccess(false);
    setDescription('');
    setMediaFiles([]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleResetAndClose}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            Report Issue for Order #{order.order_number}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Please inspect your order upon receipt. If an item arrives damaged or incorrect, upload photo/video proof within 24 hours for a prompt replacement.
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-500/10 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <h3 className="text-2xl font-bold text-foreground">Issue Report Received!</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              We have received your claim for order <strong>#{order.order_number}</strong>. Our support team is reviewing your media proof and will contact you via WhatsApp / Email promptly.
            </p>
            <Button onClick={handleResetAndClose} className="w-full">
              Done
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label htmlFor="customerName" className="text-xs font-semibold">Your Full Name</Label>
                <Input
                  id="customerName"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g., Melody Nwosu"
                  required
                />
              </div>
              <div>
                <Label htmlFor="customerEmail" className="text-xs font-semibold">Email Address</Label>
                <Input
                  id="customerEmail"
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="e.g., customer@gmail.com"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label htmlFor="customerPhone" className="text-xs font-semibold">WhatsApp / Phone Number</Label>
                <Input
                  id="customerPhone"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="e.g., 08012345678"
                />
              </div>
              <div>
                <Label htmlFor="issueType" className="text-xs font-semibold">Issue Type</Label>
                <select
                  id="issueType"
                  value={issueType}
                  onChange={(e) => setIssueType(e.target.value)}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="damaged_item">Damaged Item (Package / Product)</option>
                  <option value="wrong_item">Incorrect Item Sent</option>
                  <option value="missing_item">Missing Item in Order</option>
                  <option value="other">Other Issue</option>
                </select>
              </div>
            </div>

            <div>
              <Label htmlFor="description" className="text-xs font-semibold">Describe the Issue in Detail</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain what happened upon delivery, bottle condition, leakage, or missing items..."
                rows={3}
                required
              />
            </div>

            <div>
              <Label className="text-xs font-semibold flex items-center justify-between">
                <span>Upload Photo / Video Proof (Required within 24h)</span>
                <span className="text-[10px] text-muted-foreground">Images or Videos</span>
              </Label>
              <div className="mt-1.5 border-2 border-dashed border-border rounded-xl p-4 text-center hover:border-primary/50 transition-colors bg-secondary/10">
                <input
                  type="file"
                  id="mediaUpload"
                  accept="image/*,video/*"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <label
                  htmlFor="mediaUpload"
                  className="cursor-pointer flex flex-col items-center justify-center gap-1.5 text-xs text-muted-foreground"
                >
                  <Upload className="h-6 w-6 text-primary" />
                  <span className="font-semibold text-foreground">Click to upload photo or unboxing video</span>
                  <span className="text-[10px] text-muted-foreground">Supports PNG, JPG, MP4, MOV</span>
                </label>
              </div>

              {/* Media Preview Grid */}
              {mediaFiles.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mt-3">
                  {mediaFiles.map((media, index) => (
                    <div key={index} className="relative group rounded-lg overflow-hidden border border-border bg-black/5 aspect-square">
                      {media.type === 'video' ? (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-900 text-white p-2">
                          <Video className="h-6 w-6 mb-1 text-primary" />
                          <span className="text-[10px] truncate max-w-full px-1">{media.name}</span>
                        </div>
                      ) : (
                        <img src={media.url} alt={`Proof ${index}`} className="w-full h-full object-cover" />
                      )}
                      <button
                        type="button"
                        onClick={() => removeMedia(index)}
                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-90 hover:opacity-100 transition-opacity"
                        aria-label="Remove image"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={handleResetAndClose} disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading || uploadingMedia}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...
                  </>
                ) : (
                  'Submit Issue Report'
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

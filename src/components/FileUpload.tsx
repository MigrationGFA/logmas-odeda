import { useState, type ChangeEvent } from "react";
import { Loader2, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { uploadsService, type UploadType } from "@/services/uploads";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  type: UploadType;
  value?: string;
  onChange: (url: string) => void;
  accept?: string;
  label?: string;
  className?: string;
  preview?: boolean;
}

export function FileUpload({
  type,
  value,
  onChange,
  accept = "image/*",
  label = "Upload file",
  className,
  preview = true,
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);

  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await uploadsService.uploadFile(file, type);
      onChange(res.url);
      toast.success("File uploaded");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      {preview && value && accept.startsWith("image") && (
        <div className="relative inline-block">
          <img src={value} alt="preview" className="h-24 w-24 rounded-md object-cover border" />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center"
            aria-label="Remove"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      )}
      <label className="inline-flex">
        <input
          type="file"
          accept={accept}
          onChange={handleChange}
          className="hidden"
          disabled={uploading}
        />
        <Button type="button" variant="outline" size="sm" disabled={uploading} asChild>
          <span>
            {uploading ? (
              <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
            ) : (
              <Upload className="h-4 w-4 mr-1.5" />
            )}
            {uploading ? "Uploading..." : value ? "Replace" : label}
          </span>
        </Button>
      </label>
    </div>
  );
}

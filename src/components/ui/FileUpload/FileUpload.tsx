import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button/Button";
import { Icon } from "@/components/ui/Icon/Icon";
import { FiUpload } from "react-icons/fi";

interface FileUploadProps {
  accept?: string;
  onFileSelect?: (file: File) => void;
  dropLabel?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
  disabled?: boolean;
}

const FileUpload = ({
  accept,
  onFileSelect,
  dropLabel = "Importer un PDF",
  actionLabel,
  onAction,
  className,
  disabled,
}: FileUploadProps) => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = React.useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onFileSelect) onFileSelect(file);
    e.target.value = "";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    const file = e.dataTransfer.files?.[0];
    if (file && onFileSelect) onFileSelect(file);
  };

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "w-full rounded-[12px] border-2 border-dashed border-slate-300 bg-white px-6 py-10",
          "flex flex-col items-center justify-center gap-3 transition-colors cursor-pointer",
          "hover:border-primary hover:bg-bg-hover",
          isDragging && "border-primary bg-bg-hover",
          disabled && "opacity-50 cursor-not-allowed pointer-events-none"
        )}
      >
        <Icon size="xl" className="text-slate-400">
          <FiUpload />
        </Icon>
        <span className="font-serif font-bold text-text-primary text-base">{dropLabel}</span>
      </button>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleFileChange}
        disabled={disabled}
      />

      {actionLabel && (
        <>
          <div className="flex items-center gap-3">
            <span className="flex-1 h-px bg-border" />
            <span className="text-sm text-text-muted">ou</span>
            <span className="flex-1 h-px bg-border" />
          </div>
          <Button variant="solid" className="w-full" onClick={onAction} disabled={disabled}>
            {actionLabel}
          </Button>
        </>
      )}
    </div>
  );
};

FileUpload.displayName = "FileUpload";

export { FileUpload };

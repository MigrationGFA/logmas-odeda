"use client";
import React, { useRef } from "react";
import { Upload, FileText, CheckCircle2, AlertCircle, Trash2, ShieldCheck, FileCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export interface DocumentSpec {
  id: string;
  label: string;
  description: string;
  required: boolean;
  acceptedFormats?: string;
}

interface DocumentUploadStepProps {
  documents: DocumentSpec[];
  uploadedFiles: Record<string, string>;
  onFileUpload: (docId: string, fileName: string) => void;
  onFileRemove: (docId: string) => void;
  serviceName: string;
}

export function DocumentUploadStep({
  documents,
  uploadedFiles,
  onFileUpload,
  onFileRemove,
  serviceName,
}: DocumentUploadStepProps) {
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const handleNativeFileChange = (docId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      onFileUpload(docId, file.name);
    }
  };

  const simulateQuickUpload = (docId: string, docLabel: string) => {
    const extensions: Record<string, string> = {
      photo: "jpg",
      passport: "jpg",
      image: "jpg",
      sketch: "pdf",
      plan: "pdf",
      cert: "pdf",
      letter: "pdf",
      constitution: "pdf",
    };
    const ext = Object.keys(extensions).find((k) => docId.toLowerCase().includes(k))
      ? extensions[Object.keys(extensions).find((k) => docId.toLowerCase().includes(k))!]
      : "pdf";
    const sampleName = `${docId}_verified_document.${ext}`;
    onFileUpload(docId, sampleName);
  };

  const missingRequired = documents.filter((d) => d.required && !uploadedFiles[d.id]);

  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h4 className="text-base font-bold text-foreground">
          Statutory Supporting Documents
        </h4>
        <p className="text-xs text-muted-foreground mt-1">
          In accordance with Odeda Local Government statutory bye-laws, please upload clear, legible copies of all required supporting documents for <strong className="text-foreground">{serviceName}</strong>.
        </p>
      </div>

      {missingRequired.length > 0 ? (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex items-start gap-3 text-xs text-amber-900 dark:text-amber-200">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Required Documents Remaining:</span>
            <p className="mt-0.5 text-muted-foreground">
              Please attach {missingRequired.map((d) => d.label).join(", ")} before proceeding to review & submission.
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 flex items-center gap-3 text-xs text-emerald-900 dark:text-emerald-200">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
          <div>
            <span className="font-bold">All mandatory documents attached!</span>
            <p className="text-muted-foreground">
              Your documentation is ready for statutory verification by Odeda LGA reviewing officers.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {documents.map((doc) => {
          const isUploaded = !!uploadedFiles[doc.id];
          const fileName = uploadedFiles[doc.id];

          return (
            <div
              key={doc.id}
              className={`border rounded-xl p-4 transition-all flex flex-col justify-between ${
                isUploaded
                  ? "bg-emerald-500/5 border-emerald-500/30 shadow-xs"
                  : doc.required
                  ? "bg-card border-border/80 hover:border-primary/50"
                  : "bg-muted/20 border-dashed border-border"
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div
                      className={`p-2 rounded-lg ${
                        isUploaded
                          ? "bg-emerald-500/20 text-emerald-600"
                          : "bg-primary/10 text-primary"
                      }`}
                    >
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-xs text-foreground flex items-center gap-1.5">
                        {doc.label}
                        {doc.required ? (
                          <Badge variant="outline" className="text-[10px] bg-red-500/10 text-red-600 border-red-200 px-1 py-0">
                            Required *
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-[10px] text-muted-foreground px-1 py-0">
                            Optional
                          </Badge>
                        )}
                      </div>
                      <div className="text-[11px] text-muted-foreground mt-0.5">
                        {doc.description}
                      </div>
                    </div>
                  </div>
                </div>

                {isUploaded && (
                  <div className="mt-3 bg-background border border-emerald-500/20 rounded-lg p-2.5 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <FileCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="text-xs font-mono font-medium truncate text-foreground">
                        {fileName}
                      </span>
                    </div>
                    <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 text-[10px] shrink-0 border-emerald-300">
                      Attached
                    </Badge>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t flex items-center justify-between gap-2">
                <input
                  type="file"
                  id={`file-input-${doc.id}`}
                  ref={(el) => {
                    fileInputRefs.current[doc.id] = el;
                  }}
                  onChange={(e) => handleNativeFileChange(doc.id, e)}
                  accept={doc.acceptedFormats || ".pdf,.jpg,.jpeg,.png"}
                  className="hidden"
                />

                {isUploaded ? (
                  <div className="flex items-center justify-between w-full">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => fileInputRefs.current[doc.id]?.click()}
                      className="text-xs h-7 text-primary hover:text-primary/80 px-2"
                    >
                      Replace File
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => onFileRemove(doc.id)}
                      className="text-xs h-7 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 px-2 gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Remove
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between w-full gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRefs.current[doc.id]?.click()}
                      className="text-xs h-8 gap-1.5 flex-1"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      Choose File
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => simulateQuickUpload(doc.id, doc.label)}
                      className="text-[11px] h-8 text-muted-foreground hover:text-foreground px-2.5 shrink-0"
                    >
                      Attach Sample
                    </Button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

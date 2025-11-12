import { Download, ExternalLink, Eye, FileText, Image } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";

interface DocumentPreviewProps {
  url: string;
  name: string;
  className?: string;
  onError?: () => void;
  showAllPages?: boolean;
  currentPage?: number;
  showHeader?: boolean;
  documentType?: string;
  uploadedAt?: string;
  onPrevious?: () => void;
  onNext?: () => void;
  currentIndex?: number;
  totalDocuments?: number;
  allDocuments?: Array<{
    id: string;
    name: string;
    url: string;
    type: string;
    uploadedAt: string;
  }>;
  onDocumentSelect?: (doc: any) => void;
}

const DocumentPreview: React.FC<DocumentPreviewProps> = ({
  url,
  name,
  className = "w-full h-full",
  onError,
  showAllPages = false,
  currentPage = 1,
  showHeader = false,
  documentType,
  uploadedAt = new Date().toISOString(),
  currentIndex = 0,
  allDocuments = [],
  onDocumentSelect,
}) => {
  const [iframeError, setIframeError] = useState(false);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setIframeError(false);
    setImageError(false);
    setImageLoading(true);
  }, [url]);

  const handleIframeError = () => {
    setIframeError(true);
    onError?.();
  };

  const handleOpenInNewTab = () => {
    window.open(url, "_blank");
  };

  const handleDownload = async () => {
    try {
      // Fetch the file as a blob to ensure proper download
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch file");
      }

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up the blob URL
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Download failed:", error);
      window.open(url, "_blank");
    }
  };

  const handleView = () => {
    window.open(url, "_blank");
  };

  const handleDownloadClick = () => {
    handleDownload();
  };

  // File type detection
  const getFileExtension = (filename: string) => {
    return filename.toLowerCase().split(".").pop() || "";
  };

  const fileExtension = getFileExtension(name) || getFileExtension(url);

  const isPdfFile =
    fileExtension === "pdf" ||
    url.toLowerCase().includes(".pdf") ||
    name.toLowerCase().includes(".pdf");

  const isImageFile = [
    "jpg",
    "jpeg",
    "png",
    "gif",
    "bmp",
    "webp",
    "svg",
    "tiff",
    "tif",
    "ico",
    "avif",
  ].includes(fileExtension);

  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
    onError?.();
  };

  const handleImageLoad = () => {
    setImageError(false);
    setImageLoading(false);
  };

  // Determine document type dynamically
  const getDocumentType = () => {
    if (documentType) return documentType;

    if (isImageFile) {
      return `${fileExtension.toUpperCase()} Image`;
    } else if (isPdfFile) {
      return "PDF Document";
    } else {
      return `${fileExtension.toUpperCase()} Document`;
    }
  };

  // Document Header Component
  const DocumentHeader = () => {
    if (!showHeader) return null;

    return (
      <div className="bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 border border-cyan-200 dark:border-cyan-700 rounded-lg p-4 mb-4">
        <div className="flex flex-col space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-2 truncate">
              {name}
            </h3>
            <div className="flex items-center space-x-3 text-xs">
              <span className="px-2 py-1 text-gray-600 dark:text-slate-300 rounded-full">
                {getDocumentType()}
              </span>
              <span className="text-gray-500 dark:text-slate-400">
                {new Date(uploadedAt).toLocaleDateString()}
              </span>
            </div>
          </div>
          <div className="flex justify-center space-x-2">
            <Button
              size="sm"
              variant="outline"
              className="bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-300 hover:text-gray-900 dark:hover:text-slate-100 font-medium px-3 py-2 rounded-md transition-all duration-200"
              onClick={handleView}
            >
              <Eye className="h-4 w-4 mr-2" />
              View
            </Button>
            <Button
              size="sm"
              className="bg-gray-700 hover:bg-gray-800 dark:bg-slate-600 dark:hover:bg-slate-500 text-white font-medium px-3 py-2 rounded-md transition-all duration-200"
              onClick={handleDownloadClick}
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </div>
      </div>
    );
  };

  // Document Thumbnail Navigation Component
  const DocumentThumbnails = () => {
    if (!showHeader || allDocuments.length <= 1) return null;

    return (
      <div className="mt-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-slate-300">
            All Documents
          </span>
          <span className="text-xs text-gray-500 dark:text-slate-400">
            {allDocuments.length} files
          </span>
        </div>
        <div className="flex justify-center space-x-3 overflow-x-auto">
          {allDocuments.map((doc, index) => (
            <div
              key={doc.id}
              className={`flex-shrink-0 w-16 h-16 border-2 rounded-lg cursor-pointer flex flex-col items-center justify-center transition-all duration-200 ${
                currentIndex === index
                  ? "border-cyan-500 bg-cyan-50 dark:bg-cyan-900/20 shadow-md"
                  : "border-gray-200 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700 hover:border-gray-300 dark:hover:border-slate-500"
              }`}
              onClick={() => onDocumentSelect?.(doc)}
            >
              {[
                "jpg",
                "jpeg",
                "png",
                "gif",
                "bmp",
                "webp",
                "svg",
                "tiff",
                "tif",
                "ico",
                "avif",
              ].includes(
                getFileExtension(doc.name) || getFileExtension(doc.url)
              ) ? (
                <Image
                  className={`h-4 w-4 ${
                    currentIndex === index
                      ? "text-cyan-600 dark:text-cyan-400"
                      : "text-gray-500 dark:text-slate-400"
                  }`}
                />
              ) : (
                <FileText
                  className={`h-4 w-4 ${
                    currentIndex === index
                      ? "text-cyan-600 dark:text-cyan-400"
                      : "text-gray-500 dark:text-slate-400"
                  }`}
                />
              )}
              <span
                className={`text-xs mt-1 truncate max-w-[60px] ${
                  currentIndex === index
                    ? "text-cyan-700 dark:text-cyan-300 font-medium"
                    : "text-gray-600 dark:text-slate-400"
                }`}
              >
                {doc.name.split(" ")[0]}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Image Preview Component
  const ImagePreview = () => {
    if (imageError) {
      return (
        <div
          className={`flex flex-col items-center justify-center p-4 ${className}`}
        >
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4 max-w-md text-center">
            <h3 className="text-red-800 font-medium mb-2">
              Failed to load image
            </h3>
            <p className="text-red-700 text-sm mb-4">
              The image could not be loaded. It may be corrupted or the URL is
              invalid.
            </p>
            <div className="flex justify-center gap-2">
              <Button size="sm" onClick={handleOpenInNewTab}>
                <ExternalLink className="h-4 w-4 mr-1" />
                Open in New Tab
              </Button>
              <Button size="sm" variant="outline" onClick={handleDownload}>
                <Download className="h-4 w-4 mr-1" />
                Download
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div
        className={`flex items-center justify-center p-4 bg-gray-50 dark:bg-slate-800 ${className}`}
      >
        <div className="relative max-w-full max-h-full">
          {imageLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-slate-700 rounded-lg">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-600"></div>
            </div>
          )}
          <img
            src={url}
            alt={name}
            className={`max-w-full max-h-full object-contain rounded-lg shadow-lg transition-opacity duration-300 ${
              imageLoading ? "opacity-0" : "opacity-100"
            }`}
            onError={handleImageError}
            onLoad={handleImageLoad}
          />
        </div>
      </div>
    );
  };

  if (isImageFile) {
    return (
      <div className="flex flex-col">
        <DocumentHeader />
        <ImagePreview />
        <DocumentThumbnails />
      </div>
    );
  }

  if (iframeError) {
    return (
      <div className="flex flex-col">
        <DocumentHeader />
        <div
          className={`flex flex-col items-center justify-center p-4 ${className}`}
        >
          <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mb-4 max-w-md text-center">
            <h3 className="text-amber-800 font-medium mb-2">
              This document cannot be displayed in the preview
            </h3>
            <p className="text-amber-700 text-sm mb-4">
              The document server doesn't allow embedding in iframes due to
              security restrictions.
            </p>
            <div className="flex justify-center gap-2">
              <Button size="sm" onClick={handleOpenInNewTab}>
                <ExternalLink className="h-4 w-4 mr-1" />
                Open in New Tab
              </Button>
              <Button size="sm" variant="outline" onClick={handleDownload}>
                <Download className="h-4 w-4 mr-1" />
                Download
              </Button>
            </div>
          </div>
        </div>
        <DocumentThumbnails />
      </div>
    );
  }

  if (isPdfFile && showAllPages) {
    // const url1="http://10.8.100.39:5001/api/files/agents/11/bd1812ea-e30d-4ce2-8ec2-cf734c97a0fa.pdf"
    return (
      <div className="flex flex-col">
        <DocumentHeader />
        <iframe
          src={`${url}#page=${currentPage}&toolbar=0&navpanes=0&scrollbar=0&statusbar=0&messages=0&scrollbar=0`}
          className={`border-0 ${className}`}
          title={`${name} - Page ${currentPage}`}
          onError={handleIframeError}
          onLoad={() => {
            if (totalPages === 1) {
              setTotalPages(1);
            }
          }}
        />
        <DocumentThumbnails />
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <DocumentHeader />
      <iframe
        src={`${url}#toolbar=0&navpanes=0&scrollbar=0&statusbar=0&messages=0`}
        className={`border-0 ${className}`}
        title={name}
        onError={handleIframeError}
      />
      <DocumentThumbnails />
    </div>
  );
};

export default DocumentPreview;

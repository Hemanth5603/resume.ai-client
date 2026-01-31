"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { FaArrowLeft, FaPaperPlane, FaDownload, FaInfoCircle } from "react-icons/fa";
import { RxMagicWand } from "react-icons/rx";
import styles from "../../styles/wizard-steps/EditWithAIStep.module.css";

interface EditWithAIStepProps {
  downloadUrl: string;
  onBack: () => void;
  onEdit: (userInstruction: string) => Promise<string | void>;
  isEditing?: boolean;
  onReset?: () => void;
}

interface Message {
  id: string;
  role: "user" | "assistant" | "thinking";
  content: string;
  timestamp: Date;
}

const MAX_PROMPTS = 5;

export default function EditWithAIStep({ 
  downloadUrl, 
  onBack, 
  onEdit,
  isEditing = false,
  onReset
}: EditWithAIStepProps) {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentPreviewUrl, setCurrentPreviewUrl] = useState(downloadUrl);
  const [urlTimestamp, setUrlTimestamp] = useState(Date.now());
  const [isDownloading, setIsDownloading] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const previousDownloadUrlRef = useRef<string>(downloadUrl);
  const tooltipTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Update preview URL when downloadUrl prop changes from parent
  // This ensures the preview updates when parent state changes
  useEffect(() => {
    if (downloadUrl && downloadUrl !== previousDownloadUrlRef.current) {
      previousDownloadUrlRef.current = downloadUrl;
      setCurrentPreviewUrl(downloadUrl);
      setUrlTimestamp(Date.now());
    }
  }, [downloadUrl]);

  // Helper function to clean URL (remove cache-busting params but preserve other query params)
  const cleanUrl = (url: string): string => {
    try {
      const urlObj = new URL(url);
      // Remove cache-busting parameters
      urlObj.searchParams.delete('_t');
      // Preserve other query parameters, remove fragment (zoom is only for preview)
      const cleanUrl = urlObj.origin + urlObj.pathname;
      const searchParams = urlObj.searchParams.toString();
      return searchParams ? `${cleanUrl}?${searchParams}` : cleanUrl;
    } catch {
      // If URL parsing fails (e.g., relative URL), try simple string manipulation
      // Remove _t parameter and fragment
      let cleaned = url.split('#')[0]; // Remove fragment
      cleaned = cleaned.replace(/[?&]_t=\d+/g, ''); // Remove _t parameter
      cleaned = cleaned.replace(/\?$/, ''); // Remove trailing ?
      return cleaned;
    }
  };

  // Determine file type and preview URL
  const fileInfo = useMemo(() => {
    if (!currentPreviewUrl) {
      return { fileType: 'unknown' as const, previewUrl: '', canPreview: false };
    }

    const url = currentPreviewUrl.toLowerCase();
    const isPDF = url.includes('.pdf') || url.match(/\.pdf(\?|$|#)/) || url.includes('pdf');
    const isDOCX = url.includes('.docx') || url.match(/\.docx(\?|$|#)/) || url.includes('docx');
    
    let previewUrl = currentPreviewUrl;
    let fileType: 'pdf' | 'docx' | 'unknown' = 'unknown';
    
    if (isPDF) {
      fileType = 'pdf';
      // Add cache-busting parameter for PDFs preview
      const separator = previewUrl.includes('?') ? '&' : '?';
      previewUrl = `${currentPreviewUrl}${separator}_t=${urlTimestamp}`;
    } else if (isDOCX) {
      fileType = 'docx';
      // For DOCX, Office viewer handles cache-busting via the src parameter
      previewUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(currentPreviewUrl)}&_t=${urlTimestamp}`;
    }
    
    return { 
      fileType, 
      previewUrl, 
      canPreview: isPDF || isDOCX 
    };
  }, [currentPreviewUrl, urlTimestamp]);

  // Auto-scroll to bottom when messages change (only within chat container)
  useEffect(() => {
    if (chatEndRef.current && messages.length > 0) {
      const messagesContainer = chatEndRef.current.closest(`.${styles.messagesContainer}`);
      if (messagesContainer) {
        messagesContainer.scrollTo({
          top: messagesContainer.scrollHeight,
          behavior: "smooth"
        });
      }
    }
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      const newHeight = Math.min(textarea.scrollHeight, 150);
      textarea.style.height = `${newHeight}px`;
    }
  }, [prompt]);

  // Cleanup tooltip timeout on unmount
  useEffect(() => {
    return () => {
      if (tooltipTimeoutRef.current) {
        clearTimeout(tooltipTimeoutRef.current);
      }
    };
  }, []);

  // Calculate remaining prompts
  const userMessageCount = messages.filter(msg => msg.role === "user").length;
  const remainingPrompts = MAX_PROMPTS - userMessageCount;
  const isLimitReached = remainingPrompts <= 0;

  const handleSend = async () => {
    if (!prompt.trim() || isEditing || isLimitReached) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: prompt.trim(),
      timestamp: new Date(),
    };

    // Add user message optimistically (will be removed if request fails)
    setMessages((prev) => [...prev, userMessage]);
    const userInstruction = prompt.trim();
    setPrompt("");

    // Add thinking/processing message (like Gemini)
    const thinkingMessage: Message = {
      id: (Date.now() + 0.5).toString(),
      role: "thinking",
      content: "",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, thinkingMessage]);

    try {
      const newUrl = await onEdit(userInstruction);
      
      // Remove thinking message
      setMessages((prev) => prev.filter(msg => msg.id !== thinkingMessage.id));
      
      // Update preview URL if a new URL is returned
      // The parent (ResumeWizard) will update editedResumeUrl which becomes downloadUrl prop
      // The useEffect will sync it when the prop updates, but we also update here immediately
      if (newUrl && typeof newUrl === 'string') {
        // Update immediately for instant feedback
        // The parent will update editedResumeUrl -> currentResumeUrl -> downloadUrl prop
        // The useEffect will detect the prop change and update again (which is fine, it's idempotent)
        // IMPORTANT: Update currentPreviewUrl immediately so download button uses latest URL
        setCurrentPreviewUrl(newUrl);
        setUrlTimestamp(Date.now());
        previousDownloadUrlRef.current = newUrl; // Update ref to track the change
        
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "I've processed your request. The resume has been updated. Check the preview on the right.",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        // This should rarely happen now since errors are thrown properly
        // But keep this as a fallback for unexpected cases
        // Remove user message so counter doesn't increment
        setMessages((prev) => prev.filter(msg => msg.id !== userMessage.id));
        
        // Restore the prompt text so user can try again
        setPrompt(userInstruction);
        
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "Unable to process your request",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
      }
    } catch (error: unknown) {
      // Console log the actual error details for debugging
      console.error("Edit resume error:", error);
      if (error instanceof Error) {
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
      } else if (error && typeof error === 'object') {
        console.error("Error object:", JSON.stringify(error, null, 2));
      }
      
      // Remove thinking message and user message (so counter doesn't increment for failed requests)
      setMessages((prev) => prev.filter(msg => msg.id !== thinkingMessage.id && msg.id !== userMessage.id));
      
      // Restore the prompt text so user can try again
      setPrompt(userInstruction);
      
      // Show generic error message to user
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Unable to process your request",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      // Prefer currentPreviewUrl first since it's updated immediately when we get a new URL
      // Fall back to downloadUrl prop if currentPreviewUrl is not set
      // This ensures we always download the latest version, even if parent prop hasn't updated yet
      const sourceUrl = currentPreviewUrl || downloadUrl;
      
      if (!sourceUrl) {
        throw new Error('No resume URL available for download');
      }
      
      // Clean it to remove any cache-busting parameters that might have been added
      const urlToDownload = cleanUrl(sourceUrl);
      
      const link = document.createElement("a");
      link.href = urlToDownload;
      link.download = fileInfo.fileType === 'pdf' ? 'resume.pdf' : 'resume.docx';
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Wait a bit then reset to home
      setTimeout(() => {
        if (onReset) {
          onReset();
        }
      }, 1000);
    } catch (error) {
      console.error("Download error:", error);
    } finally {
      setTimeout(() => setIsDownloading(false), 1000);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !isLimitReached) {
      e.preventDefault();
      e.stopPropagation();
      handleSend();
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.backButton} onClick={onBack}>
          <FaArrowLeft />
          Back to Preview
        </button>
        <h2 className={styles.title}>Edit Resume with AI</h2>
        <button
          className={styles.downloadButton}
          onClick={handleDownload}
          disabled={isDownloading}
          title="Download Resume"
        >
          <FaDownload />
          {isDownloading ? "Downloading..." : "Download"}
        </button>
      </div>

      <div className={styles.content}>
        <div className={styles.chatSection}>
          <div className={styles.messagesContainer}>
            {messages.length === 0 ? (
              <div className={styles.emptyState}>
                <RxMagicWand className={styles.emptyIcon} />
                <p className={styles.emptyText}>
                  Start a conversation to edit your resume
                </p>
                <p className={styles.emptySubtext}>
                  Example: &apos;Make the summary more concise&apos; or &apos;Add more technical skills&apos;
                </p>
              </div>
            ) : (
              <div className={styles.messages}>
                {messages.map((message) => (
                  message.role === "thinking" ? (
                    <div key={message.id} className={`${styles.message} ${styles.thinkingMessage}`}>
                      <div className={styles.thinkingContent}>
                        <div className={styles.thinkingDots}>
                          <span></span>
                          <span></span>
                          <span></span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div
                      key={message.id}
                      className={`${styles.message} ${
                        message.role === "user" ? styles.userMessage : styles.assistantMessage
                      }`}
                    >
                      <div className={styles.messageContent}>{message.content}</div>
                      <div className={styles.messageTime}>
                        {message.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  )
                ))}
                <div ref={chatEndRef} />
              </div>
            )}
          </div>

          <div className={styles.inputWrapper}>
            <div className={styles.promptCounterContainer}>
              <div 
                className={styles.promptCounter}
                onMouseEnter={() => {
                  if (tooltipTimeoutRef.current) {
                    clearTimeout(tooltipTimeoutRef.current);
                  }
                  setShowTooltip(true);
                }}
                onMouseLeave={() => {
                  tooltipTimeoutRef.current = setTimeout(() => {
                    setShowTooltip(false);
                  }, 200);
                }}
              >
                <span className={styles.counterText}>
                  {remainingPrompts} / {MAX_PROMPTS} prompts remaining
                </span>
                <FaInfoCircle className={styles.infoIcon} />
                {showTooltip && (
                  <div className={styles.tooltip}>
                    <p>You can add up to {MAX_PROMPTS} prompts to edit your resume. Each prompt counts as one edit request.</p>
                  </div>
                )}
              </div>
            </div>
            <form 
              className={styles.inputContainer}
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleSend();
              }}
            >
              <textarea
                ref={textareaRef}
                className={`${styles.input} ${isLimitReached ? styles.inputDisabled : ''}`}
                placeholder={isLimitReached ? "Prompt limit reached. Please download your resume." : "Describe the changes you want to make..."}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isEditing || isLimitReached}
                rows={1}
              />
              <button
                type="submit"
                className={styles.sendButton}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleSend();
                }}
                disabled={!prompt.trim() || isEditing || isLimitReached}
                title={isLimitReached ? `You've reached the limit of ${MAX_PROMPTS} prompts` : "Send prompt"}
              >
                {isEditing ? (
                  <div className={styles.spinner} />
                ) : (
                  <FaPaperPlane />
                )}
              </button>
            </form>
          </div>
        </div>

        <div className={styles.previewSection}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>Preview</h3>
            <p className={styles.sectionSubtitle}>
              {isEditing 
                ? (
                  <span className={styles.processingText}>
                    <span className={styles.typingIndicator}>
                      <span></span>
                      <span></span>
                      <span></span>
                    </span>
                    AI is processing your request...
                  </span>
                )
                : "See your changes here"}
            </p>
          </div>
          <div className={styles.previewContainer}>
            {isEditing ? (
              <div className={styles.aiProcessingOverlay}>
                <div className={styles.aiAnimationContainer}>
                  <div className={styles.aiParticles}>
                    {[...Array(12)].map((_, i) => (
                      <div key={i} className={styles.particle} style={{ '--delay': `${i * 0.1}s` } as React.CSSProperties}></div>
                    ))}
                  </div>
                  <div className={styles.aiCenterIcon}>
                    <RxMagicWand className={styles.aiMagicWand} />
                  </div>
                  <p className={styles.aiProcessingText}>AI is updating your resume...</p>
                </div>
              </div>
            ) : fileInfo.canPreview && currentPreviewUrl ? (
              fileInfo.fileType === 'pdf' ? (
                <object
                  key={`pdf-${currentPreviewUrl}-${urlTimestamp}`}
                  data={`${fileInfo.previewUrl}#zoom=fit`}
                  type="application/pdf"
                  className={styles.preview}
                  title="Resume Preview"
                >
                  <iframe
                    key={`pdf-iframe-${currentPreviewUrl}-${urlTimestamp}`}
                    src={`${fileInfo.previewUrl}#zoom=fit`}
                    className={styles.preview}
                    title="Resume Preview"
                  />
                </object>
              ) : (
                <iframe
                  key={`docx-${currentPreviewUrl}-${urlTimestamp}`}
                  src={fileInfo.previewUrl}
                  className={styles.preview}
                  title="Resume Preview"
                />
              )
            ) : (
              <div className={styles.noPreview}>
                <p>Preview not available</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

import { useRef, useState } from 'react'
import { FaGoogleDrive, FaCloudUploadAlt, FaRobot } from 'react-icons/fa'
import styles from '../styles/PDFUploadForm.module.css'
import usePdfUploader from '../hooks/usePdfUploader'
import { RxMagicWand } from "react-icons/rx";



export default function PDFUploadForm() {
  const [file, setFile] = useState<File | null>(null)
  const [description, setDescription] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const [progress, setProgress] = useState(0)
  const { handleUpload, loading, success, error } = usePdfUploader()
    
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (selected?.type === 'application/pdf') {
      setFile(selected)
    } else {
      alert('Only PDF files allowed.')
    }
  }

  const handleSubmit = async () => {
    if (!file || !description.trim()) {
      alert('Please select a PDF and enter a description.')
      return
    }
    setProgress(0)

    const simulateProcess = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95){
          clearInterval(simulateProcess)
          return 95
        }
        return prev + 5
      })
    }, 150)
    await handleUpload(file, description)
    setProgress(100)
    setTimeout(() => setProgress(0), 1000)
  }

  return (
    <div className={styles.container}>
      <div className={styles.formSection}>
        <div className={styles.uploadSection}>
          <button
            type="button"
            className={styles.uploadButton}
            onClick={() => inputRef.current?.click()}
          >
            UPLOAD RESUME
          </button>
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf"
            style={{ display: 'none' }}
            onChange={handleFileSelect}
          />

          <div className={styles.iconGroup}>
            <button className={styles.iconButton} title="Google Drive">
              <FaGoogleDrive className={styles.reactIcon} />
            </button>
            <button className={styles.iconButton} title="Cloud Storage">
              <FaCloudUploadAlt className={styles.reactIcon} />
            </button>
          </div>
        </div>

        {loading && (
          <div className={styles.progressBarContainer}>
            <div className={styles.progressBar} style={{ width: `${progress}%` }} />
          </div>
        )}

        {/* Job Description Section */}
        <div className={styles.textareaSection}>
          <textarea
            className={styles.textarea}
            placeholder="Write Your Job Description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <div className={styles.textareaFooter}>
            <span className={styles.upgradeText}>Upgrade to pro subscription for advanced models</span>
            <button className={styles.aiButton} title="AI Assistant">
              <FaRobot className={styles.reactIcon} />
            </button>
          </div>
        </div>

        <button
          className={styles.getResumeButton}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'PROCESSING...' : 'GET RESUME'}
          <RxMagicWand scale={4}/>
        </button>

        {success && <p className={styles.success}>Upload successful!</p>}
        {error && <p className={styles.error}>{error}</p>}
      </div>
    </div>
  )
}

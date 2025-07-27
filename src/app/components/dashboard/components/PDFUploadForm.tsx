import { useRef, useState } from 'react'
import styles from '../styles/PDFUploadForm.module.css'
import usePdfUploader from '../hooks/usePdfUploader'


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
    <div className={styles.main_comtainer}>
      <div className={styles.container}>
        <h2 className={styles.heading}>AI Resume Editor</h2>
        <h3 className={styles.intro}>Make your PDF ATS friendly with one click.</h3>
        <div className={styles.uploadWrapper}>
          <button
            type="button"
            className={styles.uploadButton}
            onClick={() => inputRef.current?.click()}
          >
            Select PDF file
          </button>
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf"
            style={{ display: 'none' }}
            onChange={handleFileSelect}
          />

          {/* Fake Cloud buttons (you can make functional later) */}
          <div className={styles.iconGroup}>
            <button className={styles.iconButton}>
              <img src="/google-drive.svg" alt="Google Drive" />
            </button>
            <button className={styles.iconButton}>
              <img src="/dropbox.svg" alt="Dropbox" />
            </button>
          </div>
        </div>
        {loading && (
          <div className={styles.progressBarContainer}>
            <div className={styles.progressBar} style={{ width: `${progress}%` }} />
          </div>
        )}

        <p className={styles.dropNote}>
          {file?.name ? file.name : 'or drop PDF here'}
        </p>

        <textarea
          className={styles.textarea}
          placeholder="Enter the job description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button
          className={styles.button}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'Uploading...' : 'Upload PDF'}
        </button>

        {success && <p className={styles.success}>✅ Upload successful!</p>}
        {error && <p className={styles.error}>❌ {error}</p>}
      </div>
    </div>
  )
}

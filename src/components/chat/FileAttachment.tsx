type FileAttachmentProps = {
  fileName: string
  fileUrl: string
}

export default function FileAttachment({ fileName, fileUrl }: FileAttachmentProps) {
  return (
    <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="badge badge-info" style={{ textDecoration: 'none' }}>
      {fileName}
    </a>
  )
}

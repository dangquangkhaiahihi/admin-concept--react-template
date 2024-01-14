import {useState} from 'react'

const useSelectFiles = () => {
  const [files, setFiles] = useState([])
  const [filesTemp, setFilesTemp] = useState([])
  const [isShow, setShow] = useState(false)

  const onOpenSelectFile = () => {
    setShow(true)
    setFilesTemp(files)
  }

  const onCloseSelectFile = () => {
    setShow(false)
    setFiles(filesTemp)
  }

  const onSaveSelectFile = () => setShow(false)

  return {
    isShow,
    onOpenSelectFile,
    files,
    setFiles,
    onCloseSelectFile,
    onSaveSelectFile
  }
}

export default useSelectFiles
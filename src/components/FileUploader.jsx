import React, { useRef } from 'react';

const FileUploader = ({onFileSelect}) => {
  const fileInput = useRef(null);

  const handleFileInput = (e) => {
    // handle validations
    onFileSelect(e.target.files[0]);
    // // validation example
    // if (fileInput.size > 1024) {
    //   onFileSelectError({ error: "File size cannot exceed 1MB" });
    // } else {
    //   onFileSelectSuccess(file);
    // }
    onFileSelectSuccess(file);
  };

  return (
    <div className="file-uploader">
      <input type="file" onChange={handleFileInput} />
      <button onClick={e => fileInput.current && fileInput.current.click()} className="btn btn-primary" />
    </div>
  )
};

export default FileUploader;
import { useState } from 'react'

// Import Worker
import { Worker } from '@react-pdf-viewer/core';
// Import the main Viewer component
import { ProgressBar, Viewer } from '@react-pdf-viewer/core';
// Import the styles
import '@react-pdf-viewer/core/lib/styles/index.css';
// default layout plugin
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
// Import styles of default layout plugin
import '@react-pdf-viewer/default-layout/lib/styles/index.css';


function App() {

  // creating new plugin instance
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  // pdf file onChange state
  const [pdfFile, setPdfFile] = useState(null);

  // pdf file error state
  const [pdfError, setPdfError] = useState('');
  //Geting pdf information
  const [pdfInfo, setPdfInfo] = useState({
    name: '',
    size: 0
  })

  // handle file onChange event
  const allowedFiles = ['application/pdf'];
  const handleFile = (e) => {
    let selectedFile = e.target.files[0];
    setPdfInfo((prevState) => {
      return { name: e.target.files[0].name, size: e.target.files[0].size }
    })
    // console.log(selectedFile.type);
    if (selectedFile) {
      if (selectedFile && allowedFiles.includes(selectedFile.type)) {
        let reader = new FileReader();
        reader.readAsDataURL(selectedFile);
        reader.onloadend = (e) => {
          setPdfError('');
          setPdfFile(e.target.result);
        }
      }
      else {
        setPdfError('Not a valid pdf: Please select only PDF');
        setPdfFile('');
      }
    }
    else {
      setPdfError('please select a PDF');
    }
  }



  return (
    <div className="container">

      {/* Upload PDF */}
      <form >

        <label className='file-label'>
          <label><h5>Upload PDF</h5></label>
          <br></br>
          Darg & Drop your pdf file here or click to select a file
          <input type='file' onDrop={handleFile} className="file-control"
            onChange={handleFile} ></input>
        </label>

        {/* we will display error message in case user select some file
        other than pdf */}
        {pdfError && <span className='text-danger'>{pdfError}</span>}

      </form>

      {/* View PDF */}
      <h5>View PDF</h5>
      <div className="viewer">
        <div className='pdf-container'>
          {/* render this if we have a pdf file */}
          {pdfFile && (
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.12.313/build/pdf.worker.min.js">
              <Viewer fileUrl={pdfFile}
                plugins={[defaultLayoutPluginInstance]} renderLoader={(percentages: number) => (
                  <div style={{ width: '200px' }}>
                    <ProgressBar progress={Math.round(percentages)} />
                  </div>
                )} ></Viewer>
            </Worker>
          )}

          {/* render this if we have pdfFile state null   */}
          {!pdfFile && <>No file is selected yet</>}
        </div>
        <div className='pdf-info'>
          <label>File Name: {pdfInfo.name ? pdfInfo.name : 'No File is selected yet'}</label>
          <label>File Size: {pdfInfo.size ? pdfInfo.size : 'No File is selected yet'}</label>
        </div>
      </div>

    </div >
  );
}

export default App;

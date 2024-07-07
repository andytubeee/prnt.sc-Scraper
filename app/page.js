'use client';
import { useCallback, useEffect, useState } from 'react';

export default function Home() {
  const [imgData, setImgData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showOcr, setShowOcr] = useState(false);
  const generateImage = async () => {
    setLoading(true);
    setErrorMsg('');
    if (imgData) {
      setImgData(null);
      setErrorMsg('');
      setShowOcr(false);
    }
    const res = await fetch('/api/scrape', { cache: 'no-store' });
    const data = await res.json();
    if (data.error || res.status !== 200) {
      setErrorMsg(data.error);
      setLoading(false);
      return;
    } else if (!data?.imageSrc) {
      setErrorMsg('Failed to fetch image');
      setLoading(false);
      return;
    }
    setImgData(data);
    setLoading(false);
  };
  return (
    <div className='flex flex-col justify-center p-10 min-h-screen'>
      <button
        className='bg-white text-black rounded-lg p-4 mb-10'
        onClick={generateImage}
      >
        generate a <b>random screenshot</b>
      </button>
      <div className='flex-1 flex flex-col items-center justify-center'>
        {loading && <p>Loading...</p>}
        {errorMsg && <p>{errorMsg}</p>}
        {imgData && (
          <div>
            <img
              src={imgData.imageSrc}
              className='min-w-[20vw] max-w-[40vw] max-h-[60vh] mx-auto'
              draggable='false'
            />
            {/* <div className='my-2 w-[550px]'>
              <button
                className='bg-red-500 p-3 m-3 rounded'
                onClick={() => setShowOcr((prev) => !prev)}
              >
                {showOcr ? 'hide' : 'show'} OCR
              </button>
              {showOcr && (
                <p className='text-center'>
                  {imgData.text || 'Failed to extract text from image.'}
                </p>
              )}
            </div> */}
          </div>
        )}
      </div>
      <p className='absolute bottom-5'>
        <b>DISCLAIMER</b>: use this ethically for laughs only
      </p>
    </div>
  );
}

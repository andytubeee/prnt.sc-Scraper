'use client';
import { useCallback, useEffect, useState } from 'react';

export default function Home() {
  const [imgSrc, setImgSrc] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const generateImage = async () => {
    setLoading(true);
    if (imgSrc) {
      setImgSrc('');
    }
    const res = await fetch('/api/scrape');
    const data = await res.json();
    if (data.error) {
      setErrorMsg(data.error);
      setLoading(false);
      return;
    } else if (!data?.imageSrc) {
      setErrorMsg('Failed to fetch image');
      setLoading(false);
      return;
    }
    setImgSrc(data?.imageSrc ?? '');
    setLoading(false);
  };
  return (
    <div className='flex flex-col justify-center p-10 max-h-screen'>
      <button
        className='bg-white text-black rounded-lg p-4 mb-10'
        onClick={generateImage}
      >
        generate a <b>random screenshot</b>
      </button>
      <div className='flex-1 flex flex-col items-center justify-center'>
        {loading && <p>Loading...</p>}
        {errorMsg && <p>{errorMsg}</p>}
        {imgSrc && (
          <img
            src={imgSrc}
            className='min-w-[40vw] max-w-[70vw] mx-auto'
            draggable='false'
          />
        )}
      </div>
    </div>
  );
}

import React from 'react';
import { useState } from 'react';
import { MediaRenderer, useStorageUpload } from '@thirdweb-dev/react';

const IPFS = () => {
  const [file, setFile] = useState();
  const [result, setResult] = useState();
  const { mutateAsync: upload } =  useStorageUpload();

  const uploadToIpfs = async () => {
    const result =  await upload({
        data: [file],
        options: {
            uploadWithGatewayUrl: true,
            uploadWithoutDirectory: true
        }
    })
    console.log('Upload URL: ', result);
    setResult(result);
  }
  return (
    <div>
        <input className="font-epilogue font-semibold text-[16px]
        leading-[26px] text-white min-h-[52px] px-4 rounded-[10px]" type="file" onChange = {(e) => {
            if (e.target.files) {
                setFile(e.target.files[0]);
                console.log(e.target.files[0]);
            }
        }}/>
        {file && (
          <MediaRenderer className="px-4 py-3 hover:rounded-full" src= "https://ipfs.thirdwebcdn.com/ipfs/QmTj7VVT7ANUu33CuRJsRQLyMtfz6Z1JX9a6fTcuuGPQdF"/>
        )}
        <button onClick={uploadToIpfs}> Upload </button>
    </div>
  );
};

export default IPFS
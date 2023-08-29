import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ethers } from 'ethers';
import { useStateContext } from '../context';
import { money } from '../assets';
import { CustomButton, FormField, Loader } from '../components';
import { checkIfImage } from '../utils';
// need to write a code to handle checkIfImage url is available
import { MediaRenderer, useStorageUpload } from '@thirdweb-dev/react';


const CreateAuction = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { createAuction } = useStateContext();
  //this form is an `Object` type which used to store all the fields required.
  const [form, setform] = useState({
    name: '',
    title: '',
    description: '',
    target: '',
    deadline: '',
    image: ''
  });

  const [file, setFile] = useState();
  const [result, setResult] = useState();
  const { mutateAsync: upload } =  useStorageUpload();

  const handleFormFieldChange = (fieldName, e) => {
    setform({...form, [fieldName]: e.target.value})
  }

  useEffect(() => {
    console.log('Result:', result);
    if (result) initCreateAuction();
  }, [result]);

  const handleSubmit = async (e) => {
    //prevent auto reload when submit button clicked, because it is auto reload on default
    e.preventDefault();

    //process upload to IPFS, then change the value for img to the IPFS address
    setIsLoading(true);
    await uploadToIpfs();
    setIsLoading(false);

  }

  const initCreateAuction = async (e) => {
    try {
      setIsLoading(true);
      await createAuction({...form, image: result, target: ethers.utils.parseUnits(form.target, 18)});
      setIsLoading(false);
      navigate('/');
    } catch (error) {
      console.error(error);
    }

  }

  const uploadToIpfs = async () => {
    const output =  await upload({
        data: [file],
        options: {
            uploadWithGatewayUrl: true,
            uploadWithoutDirectory: true
        }
    })
    console.log('Upload URL: ', output[0]);
    setResult(output[0]);
    return output;
  }

  return (
    <div className="bg-[#1c1c24] flex justify-center
    items-center flex-col rounded-[10px] sm:p-10
    p-4">{isLoading && <Loader />}
      <div className="flex justify-center items-center
      p-[16px] sm:min-w-[380px] bg-[#3a3a43] rounded-[10px]">
        <h1 className="font-epilogue font-bold sm:text=[25px]
        text-[18px] leading-[38px]
        text-white">Start an Auction</h1>
      </div>

      <form onSubmit={handleSubmit} className="w-full
      mt-[65px] flex flex-col gap-[30px]">
        <div className="flex flex-wrap gap-[40px]">
          <FormField
            labelName="Your Name *"
            placeholder="Johnny"
            inputType="text"
            value={form.name}
            handleChange={(e) => handleFormFieldChange('name', e)}
            isDisabled={false}
          />
          <FormField
            labelName="Auction Title *"
            placeholder="Write a title"
            inputType="text"
            value={form.title}
            handleChange={(e) => handleFormFieldChange('title', e)}
            isDisabled={false}
          />
          <FormField
            labelName="Product Description *"
            placeholder="Write product description"
            isTextArea
            value={form.description}
            handleChange={(e) => handleFormFieldChange('description', e)}
            isDisabled={false}
          />
        </div>
          <div className="w-full flex justify-start
          items-center p-4 bg-[#37367b] h-[120px]
          rounded-[10px]">
            <img src={money} alt="money" className="w-
            [40px] h-[40px] object-contain"/>
            <h4 className="font-epilogue font-bold text-[25px]
            text-white ml-[20px]">100% Trusted Auction</h4>
          </div>

          <div className="flex flex-wrap gap-[40px]">
            <FormField
              labelName="Headshot *"
              placeholder="ETH 0.50"
              inputType="text"
              value={form.target}
              handleChange={(e) => handleFormFieldChange('target', e)}
              isDisabled={false}
            />
            <FormField
              labelName="End Date *"
              placeholder="End Date"
              inputType="date"
              value={form.deadline}
              handleChange={(e) => handleFormFieldChange('deadline', e)}
              isDisabled={false}
            />
          </div>

          <FormField
            labelName="Auction image *"
            placeholder="Place image URL of your auction product"
            inputType="hidden"
            value={form.image}
            handleChange={(e) => handleFormFieldChange('image', e)}
            isDisabled={true}
          />


          <div>
              <input className="block w-full text-sm text-gray-900 border
              border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400
              focus:outline-none dark:bg-gray-700 dark:border-gray-600 placeholder:text-[#4b5264]"
              type="file" id="file_input" onChange = {(e) => {
                  if (e.target.files) {
                      setform({...form, image: e.target.files[0].name});
                      setFile(e.target.files[0]);
                      console.log(e.target.files[0]);
                  }
              }}/>
              {result && (
                <MediaRenderer className="px-4 py-3 hover:rounded-full" src= {result}/>
              )}
              {/* <button onClick={uploadToIpfs}> Upload </button> */}
          </div>



          <div className="flex justify-center
          items-center mt-[40px]">
            <CustomButton
              btnType="submit"
              title="Submit"
              styles="bg-[#1dc071]"
            />
          </div>

      </form>
    </div>
  )
}

export default CreateAuction
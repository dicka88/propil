import Head from 'next/head';
import { useRef, useState } from 'react';
import { HiOutlineExternalLink, HiCamera, HiPlus, HiPhotograph, HiCheck, HiTrash, HiPencil, HiGlobe } from 'react-icons/hi';
import TextareaAutosize from 'react-textarea-autosize';
import { Cropper } from 'react-cropper';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import Header from '../components/Header';
import Footer from '../components/Footer';
import BrowserFrame from '../components/BrowserFrame';
import Modal from '../components/Modal';
import useModal from '../hooks/useModal';

import "cropperjs/dist/cropper.css";
import ModalWorkExperience from '../components/ModalWorkExperience';
import Input from '../components/Input';
import useYupValidationResolver from '../hooks/useYupValidationResolver';
import PreviewResume from '../components/PreviewResume';

const validatorSchema = yup.object({
  picture: yup.string().required("Picture is required"),
  name: yup.string().required("Fullname is required"),
  jobTitle: yup.string().notRequired(),
  age: yup.number().required("Age is required").nullable(),
  intro: yup.string().notRequired()
});

export default function Home() {
  const [cropperInstance, setCropperInstance] = useState();
  const { register, handleSubmit, watch, setValue, formState: { errors, isDirty }, } = useForm({
    resolver: useYupValidationResolver(validatorSchema)
  });

  register('picture');
  register('workExperiences', { value: [] });
  register('links', { value: [] });

  const name = watch('name');
  const jobTitle = watch('jobTitle');
  const age = watch('age');
  const intro = watch('intro');
  const picture = watch('picture');
  const links = watch('links');
  const workExperiences = watch('workExperiences');

  const auth = false;

  const pictureRef = useRef();

  const { open: modalPictureOpen, toggle: modalPictureToggle } = useModal();
  const { open: modalwWorkExprienceOpen, toggle: modalWorkExperienceToggle } = useModal();

  const handlePictureclick = () => {
    if (picture) {
      return modalPictureToggle();
    }
    pictureRef.current.click();
  };

  const handlePictureChange = (e) => {
    const [file] = e.target.files;
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setValue('picture', reader.result);
    };
    reader.readAsDataURL(file);

    if (!picture) {
      modalPictureToggle();
    }
  };

  const handleSavePicture = () => {
    const picture = cropperInstance.getCroppedCanvas().toDataURL();

    setValue('picture', picture);
    // TODO: should fix this
    // desc: when save and toggle hide the modal, then open modal again, the cropperjs will bugly, the cropview size be smaller
    setTimeout(modalPictureToggle, 100);
  };

  const handleWorkExperienceSubmit = (data) => {
    const weLength = workExperiences.length;
    setValue(`workExperiences.${weLength}`, data);
  };

  const handleLinkAdd = () => {
    const newLength = links.length;
    if (!links[newLength - 1].label || !links[newLength - 1].url) return;

    setValue(`links.${newLength}.label`, '');
    setValue(`links.${newLength}.url`, '');
  };

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <>
      <Head>
        <title>Propil - Make Your Personal Resume Website</title>
      </Head>

      <Header />

      <div className="container py-4">
        <main>
          <div className="flex justify-end mb-4">
            <button className="bg-black text-white py-2 px-4 rounded-md shadow" onClick={handleSubmit(onSubmit)}>
              {isDirty && !auth && (
                <>
                  <HiGlobe className="inline mr-4" />
                  <span>Publish</span>
                </>
              )}
              {isDirty && auth && "Save"}
              {!isDirty && (
                <>
                  <HiOutlineExternalLink className="inline mr-4" />
                  <span>Open in new tab</span>
                </>
              )}
              {/* This can publish / save  */}
            </button>
          </div>
          <div className="flex gap-4">
            <div>
              <div className='bg-white rounded-md p-4 w-full lg:min-w-[430px] lg:max-w-[430px] shadow'>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="flex items-center mb-4 border-b pb-4">
                    <input ref={pictureRef} type="file" className="hidden w-0" accept="image/jpg,image/png,image/jpeg" onChange={handlePictureChange} />
                    <div className="relative aspect-square bg-gray-100 w-20 rounded-full flex justify-center items-center overflow-hidden mr-6 hover:bg-gray-200 cursor-pointer" onClick={handlePictureclick}>
                      <div className="absolute transition-colors duration-200 h-full w-full hover:bg-black hover:bg-opacity-25" />
                      {picture ?
                        <img src={picture} alt="" />
                        :
                        <HiCamera size={30} className="text-gray-400" />
                      }
                    </div>
                    <div>
                      <button className="px-2 py-1 bg-black text-white rounded-md" onClick={handlePictureclick}>
                        <HiCamera className="inline mr-2" />
                        Select your picture
                      </button>
                      {errors.picture?.type === 'required' && <small class="text-red-500 block">{errors.picture.message}</small>}
                    </div>
                  </div>

                  {/* Personal information */}
                  <div className="mb-4">
                    <p className="font-bold mb-2">Personal Information</p>
                    <div className="mb-2">
                      <label htmlFor="" className="text-gray-500">Fullname</label>
                      <Input register={register} name="name" type="text" placeholder="John Doe" isError={errors.name} />
                      {errors.name?.type === 'required' && <small class="text-red-500">{errors.name.message}</small>}
                    </div>
                    <div className="mb-2">
                      <label htmlFor="" className="text-gray-500">Job Title (optional)</label>
                      <input {...register('jobTitle')} type="text" className="w-full bg-gray-100 rounded-md px-2 py-2" placeholder="Frontend Developer" />
                    </div>
                    <div className="mb-2">
                      <label htmlFor="" className="text-gray-500">
                        Age
                      </label>
                      <Input register={register} name="age" type="number" isError={errors.age} />
                      {errors.age?.type === 'required' && <small class="text-red-500">{errors.age.message}</small>}
                    </div>
                    <div className="mb-2">
                      <label htmlFor="" className="text-gray-500">
                        Intro
                      </label>
                      <TextareaAutosize {...register('intro')} minRows={2} className="w-full bg-gray-100 rounded-md px-2 py-2 resize-none" placeholder="I like to code " />
                    </div>
                  </div>

                  {/* Links */}
                  <div className="mb-4">
                    <div className="flex justify-between">
                      <p className="font-bold mb-2">Links</p>
                      <button className="hover:bg-gray-200 p-2 rounded-full" onClick={handleLinkAdd}>
                        <HiPlus size="1rem" />
                      </button>
                    </div>
                    {links?.length === 0 && (
                      <div className="text-center text-gray-500">
                        No links
                      </div>
                    )}
                    {links?.map((link, i) =>
                      <div className="flex justify-between gap-2 mb-2">
                        <div className="basis-1/3">
                          <Input register={register} name={`links.${i}.label`} placeholder="Label" />
                        </div>
                        <div className="basis-2/3">
                          <Input register={register} name={`links.${i}.url`} placeholder="URL" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Work experiences */}
                  <div className="mb-4">
                    <div className="flex justify-between mb-2">
                      <p className="font-bold mb-2">Work experience</p>
                      <button className="hover:bg-gray-200 p-2 rounded-full" onClick={modalWorkExperienceToggle}>
                        <HiPlus size="1rem" />
                      </button>
                    </div>
                    {workExperiences?.length === 0 && (
                      <div className="text-center text-gray-500">
                        No work experiences
                      </div>
                    )}
                    {workExperiences?.map((exp, i) =>
                      <div key={i} className="flex justify-between group gap-4 mb-4">
                        <div className="flex gap-4">
                          <div className="aspect-square bg-gray-100 h-[40px] rounded-full overflow-hidden">
                            <img src={exp.companyLogo} alt="" />
                          </div>
                          <div>
                            <p className="font-bold">{exp.company}</p>
                            <p className="text-light">{exp.jobTitle}</p>
                            <p className="text-light text-gray-500 text-sm mb-2">{exp.startDate} - {exp.endDate || "Present"}</p>
                            <p className="text-light text-sm whitespace-pre-line">
                              {exp.jobDescription}
                            </p>
                          </div>
                        </div>

                        <div className="lg:invisible transition-all duration-200 lg:group-hover:visible">
                          <button className="hover:bg-gray-200 p-2 rounded-full">
                            <HiPencil />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </form>
              </div>
            </div>
            <div className='hidden lg:block w-full'>
              <BrowserFrame url="propil.io/dickaismaji">
                <PreviewResume
                  name={name}
                  age={age}
                  picture={picture}
                  intro={intro}
                  jobtitle={jobTitle}
                  workExperiences={workExperiences}
                  links={links}
                />
              </BrowserFrame >
            </div>
          </div>
        </main>

        {/* Modal picture picker */}
        <Modal
          open={modalPictureOpen}
          toggle={modalPictureToggle}
          title="Upload Picture"
        >
          <Cropper
            viewMode={1}
            src={picture}
            initialAspectRatio={1 / 1}
            aspectRatio={1 / 1}
            style={{ height: 400, width: "100%" }}
            draggable={false}
            cropBoxResizable={false}
            guides={false}
            shape="circle"
            dragMode="none"
            center
            movable={false}
            cropBoxMovable={false}
            autoCrop
            onInitialized={(instance) => setCropperInstance(instance)}
          />
          <div className="mb-4"></div>
          <div className="flex gap-2 justify-end">
            <button className="py-2 px-4 border border-red-200 text-red-500 rounded-md" onClick={() => (setValue('picture', null), toggle())}>
              <HiTrash className="inline mr-4" />
              Remove
            </button>
            <button className="py-2 px-4 text-black border rounded-md" onClick={() => pictureRef.current.click()}>
              <HiPhotograph className="inline mr-4" />
              Change Picture
            </button>
            <button className="py-2 px-4 bg-black text-white rounded-md" onClick={handleSavePicture}>
              <HiCheck className="inline mr-4" />
              Save
            </button>
          </div>
        </Modal>

        <ModalWorkExperience
          open={modalwWorkExprienceOpen}
          toggle={modalWorkExperienceToggle}
          data={{ name: "dicka" }}
          onSubmit={handleWorkExperienceSubmit}
        />
        <Footer />
      </div>
    </>
  );
}

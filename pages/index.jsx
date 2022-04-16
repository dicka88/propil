import Head from 'next/head';
import { useEffect } from 'react';
import { useCallback, useRef, useState } from 'react';
import { HiOutlineExternalLink, HiCamera, HiPlus, HiPhotograph, HiCheck, HiTrash, HiPencil, HiGlobe } from 'react-icons/hi';
import TextareaAutosize from 'react-textarea-autosize';
import { Cropper } from 'react-cropper';
import { useFieldArray, useForm } from 'react-hook-form';
import * as yup from 'yup';
import ReactLoading from 'react-loading';
import "cropperjs/dist/cropper.css";

import Header from '../components/Header';
import Footer from '../components/Footer';
import BrowserFrame from '../components/BrowserFrame';
import Modal from '../components/Modal';
import ModalWorkExperience from '../components/ModalWorkExperience';
import Input from '../components/Input';
import useYupValidationResolver from '../hooks/useYupValidationResolver';
import PreviewResume from '../components/PreviewResume';
import ModalPublishResume from '../components/ModalPublishResume';

import useModal from '../hooks/useModal';
import useAuth from '../zustand/auth';

import { getResume, updateResume } from '../services/resume.service';

const validatorSchema = yup.object({
  picture: yup.string().required("Picture is required"),
  name: yup.string().required("Fullname is required"),
  jobTitle: yup.string().notRequired(),
  age: yup.number().min(10, "You are too younger, min age is 10").max(120).required("Age is required").nullable(),
  intro: yup.string().notRequired()
});

const initialForm = {
  picture: null,
  name: "",
  jobTitle: "",
  age: null,
  intro: null,
  links: [],
  workExperinces: []
};

export default function Home() {
  const { isLoggedIn, user } = useAuth();

  const [cropperInstance, setCropperInstance] = useState();
  const [resume, setResume] = useState({});
  const [tempPicture, setTempPicture] = useState();
  const [tempWorkExperience, setTempWorkExperience] = useState({
    index: null,
    data: null
  });
  const [isSaveLoading, setIsSaveLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [submitMessage, setSubmitMessage] = useState("");

  const { register, unregister, control, handleSubmit, watch, getValues, setValue, reset, formState: { errors, isDirty }, } = useForm({
    resolver: useYupValidationResolver(validatorSchema)
  });
  const { fields: linkFields, append: linkFieldAppend, remove: linkFieldRemove } = useFieldArray({
    control,
    name: "links",
  });
  const {
    fields: workExperienceFields,
    append: workExperienceAppend,
    remove: workExperienceRemove,
    update: workExperienceUpdate
  } = useFieldArray({
    control,
    name: "workExperiences",
  });

  register('picture');
  register('workExperiences', { value: [] });
  register('links', { value: [] });

  const name = watch('name');
  const jobTitle = watch('jobTitle');
  const age = watch('age');
  const intro = watch('intro');
  const picture = watch('picture');
  const links = watch('links') || [];
  const workExperiences = watch('workExperiences') || [];

  const pictureRef = useRef();

  const { open: modalPictureOpen, toggle: modalPictureToggle } = useModal();
  const { open: modalwWorkExprienceOpen, toggle: modalWorkExperienceToggle } = useModal();
  const { open: modalPublishOpen, toggle: modalPublishToggle } = useModal();

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
      setTempPicture(reader.result);
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
    if (tempWorkExperience.data) {
      workExperienceUpdate(tempWorkExperience.index, data);
    } else {
      workExperienceAppend(data);
    }
  };

  const handleLinkAdd = () => {
    const newLength = links?.length || 0;
    if (links?.length > 0 && (!links[newLength - 1].label || !links[newLength - 1].url)) return;

    linkFieldAppend();
  };

  const onSubmit = async (data) => {
    // if not auth then show login modal
    if (!isLoggedIn) {
      return alert("Login first");
    }

    // if auth and not yet published then show publish modal
    if (isLoggedIn && !resume.user_id) {
      return modalPublishToggle();
    }

    // if auth and already publish then just save
    try {
      setIsSaveLoading(true);
      await updateResume(resume.id, data);
      setSubmitMessage("Successful saved");
      // clear dirty
      reset(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaveLoading(false);
    }
  };

  const fetchResume = useCallback(async () => {
    setIsPageLoading(true);

    // fetch resumes  
    const data = await getResume(user.user_id);

    if (!data) return;
    // set to react hook form value
    Object.entries(data).forEach((obj) => {
      const [key, value] = obj;
      setValue(key, value);
    });

    setResume(data);

    setIsPageLoading(false);
  });

  // will triggerred on isLoggedIn changed
  useEffect(() => {
    console.log({ isLoggedIn });
    if (isLoggedIn) {
      fetchResume();
    } else {
      reset(initialForm);
    }
  }, [isLoggedIn]);

  return (
    <>
      <Head>
        <title>Propil - Make Your Personal Resume Website</title>
      </Head>

      <Header />

      {isPageLoading && (
        <div className="container py-4">
          <div className="flex justify-center items-center py-36">
            <ReactLoading type="bubbles" color="#000" />
          </div>
        </div>
      )}

      {!isPageLoading && (
        <div className="container py-4">
          <main>
            <div className="flex justify-end items-center mb-4">
              {submitMessage && (
                <span className="mr-4">
                  {submitMessage}
                </span>
              )}
              {isSaveLoading && (
                <span className="mr-4">
                  <ReactLoading type="bubbles" color="#000" />
                </span>
              )}
              {!isDirty && resume.user_id && isLoggedIn && (
                <a href={resume.username} className="bg-black text-white py-2 px-4 rounded-md shadow" target="_blank">
                  <HiOutlineExternalLink className="inline mr-4" />
                  <span>Open in new tab</span>
                </a>
              )}
              {isDirty && (
                <button className="bg-black text-white py-2 px-4 rounded-md shadow disabled:opacity-60" onClick={handleSubmit(onSubmit)} disabled={isSaveLoading}>
                  {!resume.user_id && (
                    <>
                      <HiGlobe className="inline mr-4" />
                      <span>Publish</span>
                    </>
                  )}
                  {isDirty && isLoggedIn && resume.user_id && "Save"}
                </button>
              )}
            </div>
            <div className="flex gap-4">
              <div className="w-full lg:min-w-[430px] lg:max-w-[430px]">
                <div className='bg-white rounded-md p-4  shadow'>
                  <form onSubmit={handleSubmit(onSubmit)}>

                    {/* Picture */}
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
                        <button type="button" className="px-2 py-1 bg-black text-white rounded-md" onClick={handlePictureclick}>
                          <HiCamera className="inline mr-2" />
                          Select your picture
                        </button>
                        {errors.picture?.type === 'required' && <small className="text-red-500 block">{errors.picture.message}</small>}
                      </div>
                    </div>

                    {/* Personal information */}
                    <div className="mb-4">
                      <p className="font-bold mb-2">Personal Information</p>
                      <div className="mb-2">
                        <label htmlFor="" className="text-gray-500">Fullname</label>
                        <Input register={register} name="name" type="text" placeholder="John Doe" isError={errors.name} />
                        {errors.name?.type === 'required' && <small className="text-red-500">{errors.name.message}</small>}
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
                        {errors.age?.type === 'required' && <small className="text-red-500">{errors.age.message}</small>}
                        {errors.age?.type === 'max' && <small className="text-red-500">{errors.age.message}</small>}
                        {errors.age?.type === 'min' && <small className="text-red-500">{errors.age.message}</small>}
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
                        <button type="button" className="hover:bg-gray-200 p-2 rounded-full" onClick={handleLinkAdd}>
                          <HiPlus size="1rem" />
                        </button>
                      </div>
                      {links?.length === 0 && (
                        <div className="text-center text-gray-500">
                          No links
                        </div>
                      )}
                      {linkFields.map((_, i) =>
                        <div key={i} className="group flex justify-between gap-2 mb-2">
                          <div className="basis-1/3">
                            <Input register={register} name={`links.${i}.label`} placeholder="Label" />
                          </div>
                          <div className="flex basis-2/3">
                            <Input register={register} name={`links.${i}.url`} placeholder="URL" />
                          </div>
                          <button type='button' className='text-gray-500 hover:text-red-500 p-2 invisible group-hover:visible' onClick={() => linkFieldRemove(i)}>
                            <HiTrash />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Work experiences */}
                    <div className="mb-4">
                      <div className="flex justify-between mb-2">
                        <p className="font-bold mb-2">Work experience</p>
                        <button type="button" className="hover:bg-gray-200 p-2 rounded-full"
                          onClick={() => (modalWorkExperienceToggle(), setTempWorkExperience({ index: null, data: null }))}
                        >
                          <HiPlus size="1rem" />
                        </button>
                      </div>
                      {workExperienceFields?.length === 0 && (
                        <div className="text-center text-gray-500">
                          No work experiences
                        </div>
                      )}
                      {workExperienceFields?.map((_, i) =>
                        <div key={i} className="flex justify-between group gap-4 mb-4">
                          <div className="flex gap-4">
                            <div>
                              <div className="aspect-square bg-gray-100 h-[40px] rounded-full overflow-hidden">
                                <img src={workExperiences[i]?.companyLogo} alt="" />
                              </div>
                            </div>
                            <div>
                              <p className="font-bold">{workExperiences[i]?.company}</p>
                              <p className="text-light">{workExperiences[i]?.jobTitle}</p>
                              <p className="text-light text-gray-500 text-sm mb-2">{workExperiences[i]?.startDate} - {workExperiences[i]?.endDate || "Present"}</p>
                              <p className="text-light text-sm whitespace-pre-line">
                                {workExperiences[i]?.jobDescription}
                              </p>
                            </div>
                          </div>

                          <div className="lg:invisible transition-all duration-200 lg:group-hover:visible">
                            <button type="button" className="hover:bg-gray-200 p-2 rounded-full"
                              onClick={() => (setTempWorkExperience({ index: i, data: workExperiences[i] }), modalWorkExperienceToggle())}
                            >
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
                <BrowserFrame url={`propil.io/${resume?.username || ""}`}>
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
              src={tempPicture}
              initialAspectRatio={1 / 1}
              aspectRatio={1 / 1}
              style={{ height: 400, width: "100%" }}
              draggable={false}
              cropBoxResizable={false}
              guides={false}
              shape="circle"
              dragMode="move"
              center
              cropBoxMovable={false}
              autoCrop
              onInitialized={(instance) => setCropperInstance(instance)}
            />
            <div className="mb-4"></div>
            <div className="flex gap-2 justify-end">
              <button className="py-2 px-4 border border-red-200 text-red-500 rounded-md" onClick={() => (setValue('picture', null), modalPictureToggle())}>
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
            data={tempWorkExperience.data}
            onSubmit={handleWorkExperienceSubmit}
            onRemove={() => {
              unregister(`workExperiences.${tempWorkExperience.index}`);
              workExperienceRemove(tempWorkExperience.index);
            }}
          />

          <ModalPublishResume
            open={modalPublishOpen}
            toggle={modalPublishToggle}
            getValues={getValues}
          />

          <Footer />
        </div>
      )}

    </>
  );
}

import React, {
  useEffect, useCallback, useRef, useState,
} from 'react';
import Head from 'next/head';
import {
  HiOutlineExternalLink, HiCamera, HiPlus, HiTrash,
  HiPencil, HiGlobe, HiClipboardCopy, HiExternalLink,
} from 'react-icons/hi';
import { FaMagic } from 'react-icons/fa';
import TextareaAutosize from 'react-textarea-autosize';
import { useFieldArray, useForm } from 'react-hook-form';
import * as yup from 'yup';
import ReactLoading from 'react-loading';
import 'cropperjs/dist/cropper.css';

import Header from '../components/Header';
import Footer from '../components/Footer';
import BrowserFrame from '../components/BrowserFrame';
import ModalWorkExperience from '../components/ModalWorkExperience';
import Input from '../components/Input';
import useYupValidationResolver from '../hooks/useYupValidationResolver';
import PreviewResume from '../components/PreviewResume';
import Modal from '../components/Modal';
import ModalPublishResume from '../components/ModalPublishResume';
import ModalPicturePicker from '../components/ModalPicturePicker';
import ModalCustomizeLink from '../components/ModalCustomizeLink';

import useModal from '../hooks/useModal';
import useAuth from '../zustand/auth';
import useModalState from '../zustand/modal';

import { getResume, updateResume } from '../services/resume.service';

const validatorSchema = yup.object({
  picture: yup.string().required('Picture is required'),
  name: yup.string().required('Full Name is required'),
  jobTitle: yup.string().notRequired(),
  age: yup.number().min(10, 'You are too younger, min age is 10').max(120).required('Age is required')
    .nullable(),
  intro: yup.string().notRequired(),
});

const initialForm = {
  picture: null,
  name: '',
  jobTitle: '',
  age: null,
  intro: null,
  links: [],
  workExperinces: [],
};

export default function Home() {
  const { isLoggedIn, user } = useAuth();
  const { toggleModalAuth, setModalAuthMode } = useModalState();

  const [resume, setResume] = useState({});
  const [tempPicture, setTempPicture] = useState();
  const [tempWorkExperience, setTempWorkExperience] = useState({
    index: null,
    data: null,
  });
  const [isSaveLoading, setIsSaveLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [submitMessage, setSubmitMessage] = useState('');

  const {
    register,
    unregister,
    control,
    handleSubmit,
    watch,
    getValues,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: useYupValidationResolver(validatorSchema),
  });
  const { fields: linkFields, append: linkFieldAppend, remove: linkFieldRemove } = useFieldArray({
    control,
    name: 'links',
  });
  const {
    fields: workExperienceFields,
    append: workExperienceAppend,
    remove: workExperienceRemove,
    update: workExperienceUpdate,
  } = useFieldArray({
    control,
    name: 'workExperiences',
  });

  register('picture', { value: '' });
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
  const { open: modalCustomizeLinkOpen, toggle: modalCustomizeLinkToggle } = useModal();
  const { open: modalCongratulationsOpen, toggle: modalCongratulationsToggle } = useModal();

  const handlePictureclick = () => {
    if (picture) {
      modalPictureToggle();
      return;
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
      setModalAuthMode('signin');
      toggleModalAuth();
      return;
    }

    // if auth and not yet published then show publish modal
    if (isLoggedIn && !resume.user_id) {
      modalPublishToggle();
      return;
    }

    // if auth and already publish then just save
    try {
      setIsSaveLoading(true);
      await updateResume(resume.id, data);
      setSubmitMessage('Successful saved');
      // clear dirty
      reset(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaveLoading(false);
    }
  };

  const fetchResume = useCallback(async () => {
    try {
      setIsPageLoading(true);
      // fetch resumes
      const data = await getResume(user.user_id);

      if (!data) {
        // register for new user that login
        handleSubmit(onSubmit)();
      } else {
        // set to react hook form value
        Object.entries(data).forEach((obj) => {
          const [key, value] = obj;
          setValue(key, value);
        });

        setResume(data);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsPageLoading(false);
    }
  });

  // will triggerred on isLoggedIn changed
  useEffect(() => {
    if (isLoggedIn) {
      fetchResume();
    } else {
      // when logout
      setResume({});
      setIsPageLoading(false);
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
            <ReactLoading type="bubbles" color="#22c55e" />
          </div>
        </div>
      )}

      {!isPageLoading && (
        <div className="container py-4">
          <main>
            <div className="flex gap-2 justify-end items-center mb-4">
              {isLoggedIn && resume.username && (
                <button
                  type="button"
                  className="text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 py-2 px-4 rounded-md shadow disabled:opacity-60"
                  disabled={isSaveLoading}
                  onClick={modalCustomizeLinkToggle}
                >
                  <FaMagic className="inline lg:mr-4" />
                  <span className="hidden lg:inline-block">
                    Customize link
                  </span>
                </button>
              )}
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
              {resume.user_id && isLoggedIn && (
                <a href={resume.username} className="text-black py-2 px-4 rounded-md shadow" target="_blank" rel="noreferrer">
                  <HiOutlineExternalLink className="inline mr-4" />
                  <span>Open in new tab</span>
                </a>
              )}
              <button
                type="button"
                className="bg-black active:bg-slate-700 text-white py-2 px-4 rounded-md shadow disabled:opacity-60"
                onClick={handleSubmit(onSubmit)}
                disabled={isSaveLoading}
              >
                {!resume.user_id && (
                  <>
                    <HiGlobe className="inline mr-4" />
                    <span>Publish</span>
                  </>
                )}
                {isLoggedIn && resume.user_id && 'Save'}
              </button>
            </div>
            <div className="flex gap-4">
              <div className="w-full lg:min-w-[430px] lg:max-w-[430px]">
                <div className="bg-white rounded-md p-4  shadow">
                  <form onSubmit={handleSubmit(onSubmit)}>

                    {/* Picture */}
                    <div className="flex items-center mb-4 border-b pb-4">
                      <input ref={pictureRef} type="file" className="hidden w-0" accept="image/jpg,image/png,image/jpeg" onChange={handlePictureChange} />
                      <div
                        className="relative aspect-square bg-gray-100 w-20 rounded-full flex justify-center items-center overflow-hidden mr-6 hover:bg-gray-200 cursor-pointer"
                        onClick={handlePictureclick}
                      >
                        <div className="absolute transition-colors duration-200 h-full w-full hover:bg-black hover:bg-opacity-25" />
                        {picture
                          ? <img src={picture} alt="" />
                          : <HiCamera size={30} className="text-gray-400" />}
                      </div>
                      <div>
                        <button type="button" className="px-2 py-1 bg-black text-white rounded-md" onClick={handlePictureclick}>
                          <HiCamera className="inline mr-2" />
                          Select your picture
                        </button>
                        {errors.picture && <small className="text-red-500 block">Picture is required</small>}
                      </div>
                    </div>

                    {/* Personal information */}
                    <div className="mb-4">
                      <p className="font-bold mb-2">Personal Information</p>
                      <div className="mb-2">
                        <label className="text-gray-500">Full Name</label>
                        <Input register={register} name="name" type="text" placeholder="John Doe" isError={errors.name && true} />
                        {errors.name?.type === 'required' && <small className="text-red-500">{errors.name.message}</small>}
                      </div>
                      <div className="mb-2">
                        <label className="text-gray-500">Job Title (optional)</label>
                        <input {...register('jobTitle')} type="text" className="w-full bg-gray-100 rounded-md px-2 py-2" placeholder="e.g. Frontend Developer" />
                      </div>
                      <div className="mb-2">
                        <label className="text-gray-500">
                          Age
                        </label>
                        <Input register={register} name="age" type="number" min="10" max="150" placeholder="Min 10" isError={errors.age && true} />
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
                          <HiPlus size={16} />
                        </button>
                      </div>
                      {links?.length === 0 && (
                        <div className="text-center text-gray-500">
                          No links
                        </div>
                      )}
                      {linkFields.map((_, i) => (
                        <div key={i} className="group flex justify-between gap-2 mb-2">
                          <div className="basis-1/3">
                            <Input register={register} name={`links.${i}.label`} placeholder="Label" />
                          </div>
                          <div className="flex basis-2/3">
                            <Input register={register} name={`links.${i}.url`} placeholder="URL" />
                          </div>
                          <button type="button" className="text-gray-500 hover:text-red-500 p-2 lg:invisible group-hover:visible" onClick={() => linkFieldRemove(i)}>
                            <HiTrash />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Work experiences */}
                    <div className="mb-4">
                      <div className="flex justify-between mb-2">
                        <p className="font-bold mb-2">Work experience</p>
                        <button
                          type="button"
                          className="hover:bg-gray-200 p-2 rounded-full"
                          onClick={() => {
                            modalWorkExperienceToggle();
                            setTempWorkExperience({ index: null, data: null });
                          }}
                        >
                          <HiPlus size={16} />
                        </button>
                      </div>
                      {workExperienceFields?.length === 0 && (
                        <div className="text-center text-gray-500">
                          No work experiences
                        </div>
                      )}
                      {workExperienceFields?.map((_, i) => (
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
                              <p className="text-light text-gray-500 text-sm mb-2">
                                {workExperiences[i]?.startDate}
                                {' '}
                                -
                                {' '}
                                {workExperiences[i]?.endDate || 'Present'}
                              </p>
                              <p className="text-light text-sm whitespace-pre-line">
                                {workExperiences[i]?.jobDescription}
                              </p>
                            </div>
                          </div>

                          <div className="lg:invisible transition-all duration-200 lg:group-hover:visible">
                            <button
                              type="button"
                              className="hover:bg-gray-200 p-2 rounded-full"
                              onClick={() => {
                                setTempWorkExperience({ index: i, data: workExperiences[i] });
                                modalWorkExperienceToggle();
                              }}
                            >
                              <HiPencil />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </form>
                </div>
              </div>
              <div className="hidden lg:block w-full">
                <BrowserFrame url={`${window.location.origin}/${resume?.username || ''}`}>
                  <PreviewResume
                    name={name}
                    age={age}
                    picture={picture}
                    intro={intro}
                    jobTitle={jobTitle}
                    workExperiences={workExperiences}
                    links={links}
                  />
                </BrowserFrame>
              </div>
            </div>
          </main>

          {/* Modal Picture Picker */}
          <ModalPicturePicker
            open={modalPictureOpen}
            toggle={modalPictureToggle}
            src={tempPicture}
            inputPictureRef={pictureRef}
            onRemove={() => {
              setValue('picture', null);
              setTempPicture(null);
              modalPictureToggle();
            }}
            onSave={(base64) => {
              setValue('picture', base64);
              modalPictureToggle();
            }}
          />

          {/* Modal Work Experience */}
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

          {/* Modal Publish Resume */}
          <ModalPublishResume
            open={modalPublishOpen}
            toggle={modalPublishToggle}
            getValues={getValues}
            afterSubmit={(data) => {
              setResume(data);
              modalCongratulationsToggle();
            }}
          />

          {/* Modal Customize Link */}
          {isLoggedIn && modalCustomizeLinkOpen && (
            <ModalCustomizeLink
              open={modalCustomizeLinkOpen}
              toggle={modalCustomizeLinkToggle}
              resumeId={resume.id}
              username={resume.username}
              isPublic={resume.isPublic}
              afterSubmit={(data) => {
                setResume({
                  ...resume,
                  ...data,
                });
              }}
            />
          )}

          {/* Modal Congratz Resume is live */}
          <Modal open={modalCongratulationsOpen} toggle={modalCongratulationsToggle}>
            <div className="text-center">
              <h1 className="font-bold text-3xl">Congratulations Your Resume is Live</h1>
            </div>
            <div className="relative w-full rounded-xl overflow-hidden mb-4">
              <img src="/congratz.jpeg" className="w-full h-[230px] object-cover" alt="Congratulations" />
            </div>
            <p className="mb-4">Horray, now you can share you resume to your friends with the following link</p>

            <div className="bg-gray-100 w-full flex justify-between">
              <div className="py-2 px-4">
                {window.location.origin}
                /
                {resume.username}
              </div>
              <div className="flex">
                <button type="button" className="bg-gray-200 text-black py-2 px-4" onClick={() => navigator.clipboard.writeText(`${window.location.origin}/${resume.username}`)}>
                  <HiClipboardCopy className="inline mr-4" />
                  Copy
                </button>
                <a href={`${window.location.origin}/${resume.username}`} target="_blank" rel="noreferrer">
                  <button type="button" className="bg-black text-white py-2 px-4">
                    <HiExternalLink className="inline mr-4" />
                    Open new Tab
                  </button>
                </a>
              </div>
            </div>
          </Modal>

          <Footer />
        </div>
      )}
    </>
  );
}

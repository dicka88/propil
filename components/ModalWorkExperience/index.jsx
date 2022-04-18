import classNames from 'classnames';
import React, { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import TextareaAutosize from 'react-textarea-autosize';
import { HiCamera } from 'react-icons/hi';
import * as yup from 'yup';
import PropTypes from 'prop-types';

import useYupValidationResolver from '../../hooks/useYupValidationResolver';
import Modal from '../Modal';

const validationSchema = yup.object({
  company: yup.string().required('Field is required'),
  companyLogo: yup.string().required('Company Logo is required'),
  startDate: yup.string().required('Field is required'),
  endDate: yup.string().notRequired(),
  jobTitle: yup.string().required('Field is required'),
  jobDescription: yup.string().required('Field is required'),
});

const initialFormValue = {
  company: '',
  companyLogo: '',
  startDate: '',
  endDate: '',
  jobTitle: '',
  jobDescription: '',
};

export default function ModalWorkExperience({
  open, toggle, data, onSubmit, onRemove,
}) {
  const {
    register, handleSubmit, formState: { errors }, reset, setValue, watch,
  } = useForm({
    resolver: useYupValidationResolver(validationSchema),
  });
  register('companyLogo', '');
  const companyLogo = watch('companyLogo');
  const endDate = watch('endDate');

  const pictureRef = useRef();

  const handlePictureClick = () => {
    pictureRef.current.click();
  };

  const handlePictureChange = (e) => {
    const [file] = e.target.files;
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setValue('companyLogo', reader.result);
    };
    reader.readAsDataURL(file);
  };

  const customToggle = () => {
    reset(initialFormValue);
    toggle();
  };

  const handleOnRemove = () => {
    onRemove();
    customToggle();
  };

  const handleCheckboxEndDate = (e) => {
    const { checked } = e.target;
    if (checked) {
      setValue('endDate', 'Present');
    } else {
      setValue('endDate', '');
    }
  };

  const customSubmit = (resume) => {
    onSubmit(resume);
    customToggle();
  };

  useEffect(() => {
    if (data) {
      Object.entries(data).forEach((obj) => {
        const [key, value] = obj;
        setValue(key, value);
      });
    } else {
      reset(initialFormValue);
    }
  }, [open]);

  return (
    <Modal open={open} toggle={customToggle} title={data ? 'Update Work Experience' : 'Add Work Experience'}>
      <form onSubmit={handleSubmit(customSubmit)}>
        <div className="mb-4">
          <div className="flex justify-center">
            <div className="flex items-center mb-4 pb-4">
              <input ref={pictureRef} type="file" className="hidden w-0" accept="image/jpg,image/png,image/jpeg" onChange={handlePictureChange} />
              <div className="text-center">
                <button type="button" className="mb-4 relative aspect-square bg-gray-100 w-20 mx-auto rounded-full flex justify-center items-center overflow-hidden hover:bg-gray-200 cursor-pointer" onClick={handlePictureClick}>
                  <div className="absolute transition-colors duration-200 h-full w-full hover:bg-black hover:bg-opacity-25" />
                  {companyLogo
                    ? <img src={companyLogo} alt="" />
                    : <HiCamera size={30} className="text-gray-400" />}
                </button>
                <span className="font-bold block">Company Logo</span>
                {errors.companyLogo?.type === 'required' && <small className="text-red-500">{errors.companyLogo.message}</small>}

              </div>
            </div>
          </div>
          <p className="font-bold mb-2">Company</p>
          <input
            {...register('company')}
            type="text"
            className={classNames('w-full bg-gray-100 rounded-md px-2 py-2', { 'border border-red-500': errors.company })}
            placeholder="Google Indonesia"
          />
          {errors.company?.type === 'required' && <small className="text-red-500">{errors.company.message}</small>}
        </div>

        <div className="flex gap-4 mb-4">
          <div className="w-full">
            <label className="font-bold mb-2">Start Date</label>
            <input
              {...register('startDate')}
              type="text"
              className={classNames('w-full bg-gray-100 rounded-md px-2 py-2', { 'border border-red-500': errors.startDate })}
              placeholder="Mar 2021"
            />
            {errors.startDate?.type === 'required' && <small className="text-red-500">{errors.startDate.message}</small>}
          </div>
          <div className="w-full">
            <label className="font-bold mb-2">End Date</label>
            <input
              {...register('endDate')}
              type="text"
              className={classNames('w-full bg-gray-100 rounded-md px-2 py-2 disabled:bg-gray-200', { 'border border-red-500': errors.endDate })}
              placeholder=""
              disabled={endDate === 'Present'}
            />
            {errors.endDate?.type === 'required' && <small className="text-red-500">{errors.endDate.message}</small>}
            <div>
              <input type="checkbox" onChange={handleCheckboxEndDate} className="mr-2" checked={endDate === 'Present'} />
              <small>
                Still on this position
              </small>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <p className="font-bold mb-2">Job Title</p>
          <input
            {...register('jobTitle')}
            type="text"
            className={classNames('w-full bg-gray-100 rounded-md px-2 py-2', { 'border border-red-500': errors.jobTitle })}
            placeholder="e.g, Fullstack Javascript"
          />
          {errors.jobTitle?.type === 'required' && <small className="text-red-500">{errors.jobTitle.message}</small>}
        </div>

        <div className="mb-4">
          <p className="font-bold">Job Description</p>
          <TextareaAutosize
            {...register('jobDescription')}
            placeholder="Set a message"
            minRows={3}
            className={classNames('bg-gray-100 w-full p-2 rounded-lg resize-none focus:ring-black focus:outline-black focus:border-black', {
              'border border-red-500': errors.jobDescription,
            })}
          />
          {errors.jobDescription?.type === 'required' && <small className="text-red-500">{errors.jobDescription.message}</small>}
        </div>

        <div className="flex gap-2 justify-between">
          <button type="button" className="py-2 px-6 border hover:border-red-500 text-red-500 rounded-md" onClick={handleOnRemove}>
            Remove
          </button>
          <button type="submit" className="py-2 px-6 bg-black text-white rounded-md">
            Save
          </button>
        </div>
      </form>

    </Modal>
  );
}

ModalWorkExperience.defaultProps = {
  data: null,
};

ModalWorkExperience.propTypes = {
  open: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  data: PropTypes.objectOf({
    companyLogo: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    jobTitle: PropTypes.string.isRequired,
    startDate: PropTypes.string.isRequired,
    endDate: PropTypes.string.isRequired,
  }),
  onSubmit: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
};

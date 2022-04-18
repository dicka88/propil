import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import PropTypes from 'prop-types';

import useYupValidationResolver from '../../hooks/useYupValidationResolver';
import { createResume, getResumeUsername } from '../../services/resume.service';
import useAuth from '../../zustand/auth';
import Input from '../Input';
import Modal from '../Modal';

const validationSchema = yup.object({
  username: yup.string().min(3).max(20).required('Customize link is required'),
});

export default function ModalPublishResume({
  open, toggle, getValues, afterSubmit,
}) {
  const { user } = useAuth();
  const {
    register, handleSubmit, setValue, watch, formState: { errors },
  } = useForm({
    resolver: useYupValidationResolver(validationSchema),
  });
  register('username');
  const username = watch('username');

  const [isUsernameExist, setIsUsernameExist] = useState(false);

  const onSubmit = async (data) => {
    const formValues = getValues();
    // set username non safe
    setIsUsernameExist(false);
    // check username
    const usernameExists = await getResumeUsername(data.username);

    // if exist set non safe
    if (usernameExists) {
      setIsUsernameExist(true);
      return;
    }

    const newData = {
      ...formValues,
      user_id: user.user_id,
      username,
    };

    try {
      await createResume(newData);
      const resume = await getResumeUsername(data.username);

      afterSubmit(resume);

      toggle();
    } catch (err) {
      // show error
      console.log(err);
      alert('Something error has happen');
    }
  };

  const handleUsernameChange = (e) => {
    const { value } = e.target;
    const slug = value.replace(/\W/ig, '-');
    setValue('username', slug);
  };

  return (
    <Modal title="Publish Your Resume" open={open} toggle={toggle}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <p>Make your resume is public, so your friend can see</p>
        <div>
          <div className="flex items-center bg-gray-100 px-2">
            <span className="mr-0 text-gray-500">propil.io/</span>
            <Input
              onChange={handleUsernameChange}
              name="username"
              value={username}
              placeholder="enter customize link"
              className="!outline-none border-none ring-0 !pl-1"
            />
          </div>
          {errors.username && <p className="text-red-500">{errors.username.message}</p>}
          {isUsernameExist && <p className="text-red-500">Username has been used another</p>}
        </div>
        <div className="flex justify-end">
          <button type="submit" className="py-2 px-4 bg-black text-white rounded-md hover:bg-gray-700">
            Publish now
          </button>
        </div>
      </form>
    </Modal>
  );
}

ModalPublishResume.propTypes = {
  open: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  getValues: PropTypes.func.isRequired,
  afterSubmit: PropTypes.func.isRequired,
};

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import classNames from 'classnames';
import ReactLoading from 'react-loading';
import { HiOutlineClipboard } from 'react-icons/hi';

import Modal from '../Modal';
import Input from '../Input';
import { getResumeByUsername, updateResume } from '../../services/resume.service';
import useYupValidationResolver from '../../hooks/useYupValidationResolver';

const validationSchema = yup.object({
  username: yup.string().min(3).max(20).required('Customize link is required'),
});

export default function ModalCustomizeLink({
  open, toggle, resumeId, username, isPublic, afterSubmit,
}) {
  const {
    register, setValue, handleSubmit, watch, formState: { errors },
  } = useForm({
    resolver: useYupValidationResolver(validationSchema),
    defaultValues: {
      username,
      isPublic,
    },
  });

  const [isUsernameExist, setIsUsernameExist] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  register('isPublic', { value: isPublic });

  const usernameValue = watch('username');
  const isPublicValue = watch('isPublic');

  const initialDataJSON = JSON.stringify({ username, isPublic });
  const formDataJSON = JSON.stringify({ username: usernameValue, isPublic: isPublicValue });

  const handleVisibilityChange = (mode) => {
    setValue('isPublic', mode);
  };

  const handleUsernameChange = (e) => {
    const { value } = e.target;
    const slug = value.replace(/\W/ig, '-');
    setValue('username', slug);
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}/${usernameValue}`;
    navigator.clipboard.writeText(url);
  };

  const onSubmit = async (data) => {
    try {
      setIsUsernameExist(false);
      setSubmitLoading(true);
      if (data.username !== username) {
        const usernameExists = await getResumeByUsername(data.username);

        if (usernameExists) {
          setIsUsernameExist(true);
          return;
        }
      }

      await updateResume(resumeId, data);
      afterSubmit(data);
      toggle();
    } catch (err) {
      // console.log(err);
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <Modal open={open} toggle={toggle} title="Customize Link">
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>

        <p>Make your profile is public</p>

        <div>
          <div className="inline-block">
            <div className="flex rounded-full overflow-hidden mb-2 border">
              <button
                type="button"
                className={classNames('py-1 px-4', {
                  'text-white bg-red-500': !isPublicValue,
                  'text-black bg-gray-200': isPublicValue,
                })}
                onClick={() => handleVisibilityChange(false)}
              >
                Private
              </button>
              <button
                type="button"
                className={classNames('py-1 px-4', {
                  'text-black bg-gray-200': !isPublicValue,
                  'bg-green-500 text-white': isPublicValue,
                })}
                onClick={() => handleVisibilityChange(true)}
              >
                Public
              </button>
            </div>
          </div>
          {!isPublicValue && <p className="text-red-500">Note: your resume cannot view by others </p>}
        </div>

        <div className="flex items-center bg-gray-100 px-2">
          <span className="mr-0 text-gray-500">propil.io/</span>
          <Input
            register={register}
            onChange={handleUsernameChange}
            name="username"
            value={usernameValue}
            placeholder="enter customize link"
            className="!outline-none border-none ring-0 !pl-1"
          />
          <button type="button" className="bg-black whitespace-nowrap px-2 py-2 text-white" onClick={handleCopyLink}>
            <HiOutlineClipboard className="inline mr-4" />
            Copy link
          </button>
        </div>
        {errors.username && <p className="text-red-500">{errors.username.message}</p>}
        {isUsernameExist && <p className="text-red-500">Username has been used by another</p>}

        <div className="flex justify-end items-center">
          {submitLoading && (
            <span>
              <ReactLoading type="bubbles" color="#000" height={25} width={25} className="mr-6" />
            </span>
          )}
          <button
            type="submit"
            className={classNames('py-2 px-6 text-white rounded-md', {
              'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500': !submitLoading && initialDataJSON !== formDataJSON,
              'bg-gray-300': submitLoading || initialDataJSON === formDataJSON,
            })}
            disabled={submitLoading || initialDataJSON === formDataJSON}
          >
            Update
          </button>
        </div>
      </form>

    </Modal>
  );
}

ModalCustomizeLink.defaultProps = {
  username: '',
};

ModalCustomizeLink.propTypes = {
  open: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  isPublic: PropTypes.bool.isRequired,
  resumeId: PropTypes.string.isRequired,
  username: PropTypes.string,
  afterSubmit: PropTypes.func.isRequired,
};

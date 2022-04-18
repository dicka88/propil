import React, { useState } from 'react';
import { Cropper } from 'react-cropper';
import PropTypes from 'prop-types';
import { HiTrash, HiPhotograph, HiCheck } from 'react-icons/hi';

import Modal from '../Modal';

export default function ModalPicturePicker({
  open, toggle, src, inputPictureRef, onRemove, onSave,
}) {
  const [cropperInstance, setCropperInstance] = useState();

  const handleSavePicture = () => {
    const picture = cropperInstance.getCroppedCanvas().toDataURL();
    onSave(picture);
  };

  const handleChangePicture = () => {
    inputPictureRef.current.click();
  };

  return (
    <Modal
      open={open}
      toggle={toggle}
      title="Upload Picture"
    >
      <Cropper
        viewMode={1}
        src={src}
        initialAspectRatio={1 / 1}
        aspectRatio={1 / 1}
        style={{ height: 400, width: '100%' }}
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
      <div className="mb-4" />
      <div className="flex gap-2 justify-end">
        <button type="button" className="py-2 px-4 border border-red-200 text-red-500 rounded-md" onClick={onRemove}>
          <HiTrash className="inline mr-4" />
          Remove
        </button>
        <button type="button" className="py-2 px-4 text-black border rounded-md" onClick={handleChangePicture}>
          <HiPhotograph className="inline mr-4" />
          Change Picture
        </button>
        <button type="button" className="py-2 px-4 bg-black text-white rounded-md" onClick={handleSavePicture}>
          <HiCheck className="inline mr-4" />
          Save
        </button>
      </div>
    </Modal>
  );
}

ModalPicturePicker.defaultProps = {
  src: '',
};

ModalPicturePicker.propTypes = {
  open: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  src: PropTypes.string,
  inputPictureRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }).isRequired,
  onSave: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
};

import React, { useState, useRef } from 'react';
import ReactCrop, { type Crop, centerCrop, makeAspectCrop } from 'react-image-crop';

interface ImageCropModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string | null;
  onCropComplete: (croppedImageUrl: string, index: number) => void;
  imageIndex: number;
}

// Utility to get cropped image data using a canvas
function getCroppedImg(
  image: HTMLImageElement,
  crop: Crop
): Promise<string> {
  const canvas = document.createElement('canvas');
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  
  const cropWidth = crop.width * scaleX;
  const cropHeight = crop.height * scaleY;

  canvas.width = cropWidth;
  canvas.height = cropHeight;
  
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return Promise.reject(new Error('Canvas context not available'));
  }

  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    cropWidth,
    cropHeight,
    0,
    0,
    cropWidth,
    cropHeight
  );

  return new Promise((resolve) => {
    // Get the data URL with high quality for JPEGs
    resolve(canvas.toDataURL('image/jpeg', 0.95));
  });
}

const ImageCropModal: React.FC<ImageCropModalProps> = ({
  isOpen,
  onClose,
  imageSrc,
  onCropComplete,
  imageIndex,
}) => {
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<Crop>();
  const [aspect, setAspect] = useState<number | undefined>(16 / 9);
  const imgRef = useRef<HTMLImageElement>(null);

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const { width, height } = e.currentTarget;
    const newCrop = centerCrop(
      makeAspectCrop(
        {
          unit: '%',
          width: 90,
        },
        aspect || (width / height), // Use image aspect if free crop
        width,
        height
      ),
      width,
      height
    );
    setCrop(newCrop);
    setCompletedCrop(newCrop); // Set initial completed crop
  }

  const handleConfirmCrop = async () => {
    if (completedCrop?.width && completedCrop?.height && imgRef.current) {
      const croppedImageUrl = await getCroppedImg(
        imgRef.current,
        completedCrop
      );
      onCropComplete(croppedImageUrl, imageIndex);
    } else {
        console.error("Crop is not complete or image ref is not available.");
        onClose();
    }
  };
  
  const handleAspectChange = (newAspect: number | undefined) => {
    setAspect(newAspect);
    if(imgRef.current) {
        const { width, height } = imgRef.current;
        const newCrop = centerCrop(
            makeAspectCrop(
                {
                  unit: '%',
                  width: 90,
                },
                newAspect || (width / height),
                width,
                height
            ),
            width,
            height
        );
        setCrop(newCrop);
        setCompletedCrop(newCrop);
    }
  };

  if (!isOpen || !imageSrc) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 animate-fade-in" onClick={onClose}>
      <div className="bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 w-full max-w-4xl mx-4 p-8 flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-indigo-400 mb-4">Crop Your Image</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl leading-none">&times;</button>
        </div>
        <div className="flex justify-center gap-4 mb-4">
          <button onClick={() => handleAspectChange(16 / 9)} className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${aspect === 16/9 ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>16:9 (Thumbnail)</button>
          <button onClick={() => handleAspectChange(1 / 1)} className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${aspect === 1/1 ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>1:1 (Square)</button>
          <button onClick={() => handleAspectChange(undefined)} className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${!aspect ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>Free</button>
        </div>
        <div className="flex justify-center bg-gray-900 p-4 rounded-lg">
            <ReactCrop
              crop={crop}
              onChange={c => setCrop(c)}
              onComplete={c => setCompletedCrop(c)}
              aspect={aspect}
              className="max-h-[60vh]"
            >
              <img ref={imgRef} src={imageSrc} onLoad={onImageLoad} alt="Image to crop" style={{ maxHeight: '60vh' }}/>
            </ReactCrop>
        </div>
        <div className="mt-6 flex justify-end gap-4">
          <button onClick={onClose} className="py-2 px-4 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600">
            Cancel
          </button>
          <button onClick={handleConfirmCrop} className="py-2 px-6 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
            Confirm Crop
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageCropModal;
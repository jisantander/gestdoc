import React from 'react';
import { FadeLoader } from 'react-spinners';
const Loading = () => {
  return (
    <>
      <div className="d-flex align-items-center flex-column vh-100 justify-content-center text-center py-3">
        <div className="d-flex align-items-center flex-column px-4">
          <FadeLoader color={'#3c44b1'} loading={true} />
        </div>
      </div>
    </>
  );
};
export { Loading };
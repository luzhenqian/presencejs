import React from 'react';

export const Card = ({ style = {}, children }) => {
  return (
    <div
      className="inline-flex justify-center w-40 p-10 border rounded-md shadow-sm cursor-pointer"
      style={style}
    >
      {children}
    </div>
  );
};

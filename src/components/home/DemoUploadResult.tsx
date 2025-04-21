
import React from "react";

const DemoUploadResult: React.FC<{ transcript: string }> = ({ transcript }) => (
  <div className="w-full max-w-md mt-4">
    <div className="border-t border-gray-200 pt-4">
      <h3 className="text-lg font-semibold text-medical-dark mb-2 text-center">
        Result
      </h3>
      <div className="p-4 bg-gray-50 rounded-md shadow-inner">
        <p className="text-sm text-gray-700 whitespace-pre-wrap">{transcript}</p>
      </div>
    </div>
  </div>
);

export default DemoUploadResult;


import React from "react";

const DemoUploadError: React.FC<{ error: string }> = ({ error }) => (
  <div className="w-full max-w-md">
    <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
      {error}
    </div>
  </div>
);

export default DemoUploadError;

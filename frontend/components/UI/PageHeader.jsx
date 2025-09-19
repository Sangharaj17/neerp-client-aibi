import React from "react";

const PageHeader = ({ title, description, icon: Icon }) => {
  return (
    <div>
      <h2 className="text-lg font-medium text-gray-800 flex items-center gap-2">
        {Icon && <Icon className="w-5 h-5 text-gray-600" />}
        {title}
      </h2>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
  );
};

export default PageHeader;

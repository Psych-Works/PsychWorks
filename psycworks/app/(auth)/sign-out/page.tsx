import React from "react";
import { Loader } from "lucide-react";

const SignOutPage = () => {
  return (
    <div className="justify-center items-center">
      <div className="flex space-x-5 justify-center items-center">
        <Loader className="animate-spin w-10 h-10 text-white" />
        <p className="text-white text-xl">Sign Out In Progress...</p>
      </div>
    </div>
  );
};

export default SignOutPage;

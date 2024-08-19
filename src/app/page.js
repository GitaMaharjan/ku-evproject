"use client";

import React from "react";
import Link from "next/link";

const page = () => {
  return (
    <div className="bg-black text-white flex justify-center items-center h-screen flex-col">
      <p className="text-[50px]">Welcome</p>
      <br />
      <p>
        Go to{" "}
        <span>
          <Link href="/dashboard">Prediction</Link>
        </span>{" "}
        page
      </p>
    </div>
  );
};

export default page;

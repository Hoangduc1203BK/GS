import { useEffect, useState } from "react";

import { checkNameField } from "@/common/const"


export default function InfoStuTea({ children, info }) {
  const [infoArr, setInfo] = useState([]);
  useEffect(()=>{
    setInfo(Object.entries(info)?.map(([key, value], index) => {
      return {
        key : checkNameField(key),
        value: value
      }
    }));
  },[info])


  return (
    <div className="p-4">
      <div className="flex justify-center ">
        <img
          className="rounded-full"
          alt="avata"
          src="/images/avatar.jpg"
        ></img>
      </div>
    <div>
    {infoArr?.map((el, index) => (
        <div key={index} className="flex items-center mb-1">
          <b className="w-1/4"> {el.key}</b>
          <div className="mx-1"> : </div>
          <div className="w-3/4">{el.value}</div>
        </div>
      ))}
    </div>
      {children}
    </div>
  );
}

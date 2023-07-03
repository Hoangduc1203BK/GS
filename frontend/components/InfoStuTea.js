import { useEffect, useState } from "react";
import PopupStudentSuggest from "./popup/popupStudentSuggest";
import PopupStudentFeedback from "./popup/popupStudentFeedback";
import PopupStudentTuitionFee from "./popup/popupStudentTuitionFee";
import { checkNameField } from "@/common/const"

import { Button } from "antd";

export default function InfoStuTea({ info }) {
  console.log(info);


  const [openSugget, setOpenSuggest] = useState(false);
  const [openFeedback, setOpenFeedback] = useState(false);
  const [openTuitionFee, setOpenTuitionFee] = useState(false);
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
      <PopupStudentSuggest open={openSugget} setOpen={setOpenSuggest} />
      <PopupStudentFeedback open={openFeedback} setOpen={setOpenFeedback} />
      <PopupStudentTuitionFee open={openTuitionFee} setOpen={setOpenTuitionFee} info={info} />

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
      

      <div className="flex gap-2 w-full mt-3">
        <Button
          type="primary"
          className="w-1/2"
          onClick={() => setOpenSuggest(true)}
        >
          Đề xuất
        </Button>
        <Button
          type="primary"
          className="w-1/2 !bg-violet-700"
          onClick={() => setOpenTuitionFee(true)}
        >
          Học phí
        </Button>
      </div>
      <div className="flex gap-2 w-full mt-3">
        <Button
          type="primary"
          className="w-1/2 !bg-green-600"
          onClick={() => setOpenFeedback(true)}
        >
          Thư góp ý
        </Button>
        <div className="w-1/2"></div>
      </div>
    </div>
  );
}

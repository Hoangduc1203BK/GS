import { OPTION_SUBJECT, TYPE_SUGGEST_STUDENT } from "@/common/const";
import { Modal, Radio, Select } from "antd";
import { useState } from "react";
import { Input } from "antd";

const { TextArea } = Input;
export default function PopupStudentSuggest({ open, setOpen }) {
  const [option, setOption] = useState(OPTION_SUBJECT);
  const [subject, setSubject] = useState("");
  const [typeSugget, setTypeSuggest] = useState();

  const handleOk = () => {
    setOpen(!open);
  };

  const handleCancel = () => {
    setOpen(!open);
  };

  const handleChange = (value) => {
    console.log(`selected ${value}`);
    setSubject(value);
    setOption(
      OPTION_SUBJECT.map((el, index) =>
        el.value === value
          ? { ...el, disabled: true }
          : { ...el, disabled: false }
      )
    );
  };

  const onChange = (e) => {
    console.log("radio checked", e.target.value);
    setTypeSuggest(e.target.value);
  };

  return (
    <>
      <Modal
        title="Môn đề xuất"
        open={open}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Gửi thông tin"
        cancelText="Đóng"
      >
        <div className="p-10">
          <div className="flex">
            <b className="w-1/4">Môn đề xuất</b>
            <Select
              placeholder="--Chọn--"
              value={subject}
              className="w-3/4"
              onChange={handleChange}
              options={option}
            />
          </div>
          <div className="flex mt-5">
            <b className="w-1/4">Nội dung</b>
            <TextArea rows={4}  className="w-3/4" />
          </div>
          <div className="flex">
            <b className="w-1/4"></b>
            <Radio.Group
              onChange={onChange}
              value={typeSugget}
              className="mt-5 w-3/4"
            >
              {TYPE_SUGGEST_STUDENT.map((el) => (
                <Radio key={el.value} value={el.value}>
                  {el.label}
                </Radio>
              ))}
            </Radio.Group>
          </div>
        </div>
      </Modal>
    </>
  );
}

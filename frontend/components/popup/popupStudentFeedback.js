import { Modal } from "antd";
import { Input } from "antd";

const { TextArea } = Input;
export default function PopupStudentFeedback ({ open, setOpen }) {

  const handleOk = () => {
    setOpen(!open);
  };

  const handleCancel = () => {
    setOpen(!open);
  };

  const handleChange = (value) => {
    console.log(`selected ${value}`);
    
  };

  const onChange = (e) => {
    console.log("radio checked", e.target.value);
  };

  return (
    <>
      <Modal
        title="Góp ý kiến cho trung tâm"
        open={open}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Lưu"
        cancelText="Đóng"
      >
        <div className="p-10">
          <div className="flex">
            <b className="w-1/4">Họ và tên</b>
            <Input
              placeholder="nhập họ tên"
              className="w-3/4"
            />
          </div>
          <div className="flex mt-5">
            <b className="w-1/4">Số ĐT</b>
            <Input
              placeholder="Nhập số điện thoại"
              className="w-3/4"
            />
          </div>
          <div className="flex mt-5">
            <b className="w-1/4">Mô tả</b>
            <TextArea rows={4}  className="w-3/4" />
          </div>
          
        </div>
      </Modal>
    </>
  );
}
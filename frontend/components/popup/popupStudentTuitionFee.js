import { Modal } from "antd";
import { Input } from "antd";

const { TextArea } = Input;
export default function PopupStudentTuitionFee  ({ open, setOpen , info}) {

  const handleOk = () => {
    setOpen(!open);
  };

  const handleCancel = () => {
    setOpen(!open);
  };


  return (
    <>
      <Modal
        title="Học phí"
        open={open}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="In học phí"
        cancelText="Đóng"
        width={800}
      >
        <div className="p-10 custom-table">
            <table className="border-collapse w-1/2">
              <tbody>
              <tr>
                    <th>Mã số</th>
                    <td>{info?.code || ""}</td>
                </tr>
                <tr>
                    <th>Họ và tên</th>
                    <td>{info?.name|| ""}</td>
                </tr>
                <tr>
                    <th>Số điện thoại</th>
                    <td>{info?.phone|| ""}</td>
                </tr>
                <tr>
                    <th>Tháng</th>
                    <td></td>
                </tr>
              </tbody>
               
            </table>
          
        </div>
      </Modal>
    </>
  );
}
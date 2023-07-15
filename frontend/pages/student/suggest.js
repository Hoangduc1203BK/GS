import { ApiGetListClass, ApiGetListSuggest } from "@/api/student";
import { PROPOSAL_STATUS_LIST, STUDENT_PROPOSAL_TYPE } from "@/common/const";
import LayoutAdmin from "@/components/LayoutAdmin";
import PopupStudentSuggest from "@/components/popup/popupSuggest";
import { DatabaseFilled, PullRequestOutlined } from "@ant-design/icons";

import {
  Button,
  Col,
  Form,
  Input,
  Row,
  Select,
  Table,
  Tabs,
  message,
} from "antd";
import { useState, useEffect } from "react";

const StudentSuggest = ({ user }) => {
  const [form] = Form.useForm();
  const [openSuggest, setOpenSuggest] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);

  const [listClass, setListClass] = useState([]);
  const [tableParams, setTableParams] = useState({
    page: 1,
    size: 10,
  });

  const [suggests, setSuggest] = useState({
    result: [],
    total: 0,
  });

  useEffect(() => {
    if (isUpdate) {
      getListSuggest();
    }
  }, [isUpdate]);

  useEffect(() => {
    getListSuggest();
    getListClass();
  }, [tableParams]);

  const getListClass = async () => {
    const classes = await ApiGetListClass({ type: "active" });
    setListClass([...classes.data]);
  };

  const getListSuggest = async () => {
    try {
      setIsFetching(true);
      const formData = form.getFieldValue();
      let params = {
        ...tableParams,
        userId: user.id,
      };

      if (formData.type) {
        params["type"] = formData.type;
      }
      if (formData.status) {
        params["type"] = formData.status;
      }
      const response = await ApiGetListSuggest(params);
      setSuggest({ result: [...response.data], total: response.total || 1 });

      setIsFetching(false);
    } catch (error) {
      message.error("Có lỗi xảy ra! Vui lòng thử lại");
      setIsFetching(false);
    }
  };

  const submitSearch = (values) => {
    getListSuggest();
  };

  const columns = [
    {
      title: "STT",
      render: (text, record, index) => {
        return <div>{index + 1}</div>;
      },
    },
    {
      title: "Người đề xuát",
      dataIndex: "user",
      key: "user",
    },
    {
      title: "Môn đề xuất",
      render: (text, record, index) => {
        return (
          <div>
            {listClass.find((el) => el.id == record?.sub_data?.classId)?.name}
          </div>
        );
      },
    },
    {
      title: "Ngày đề xuất",
      dataIndex: "time",
      key: "time",
    },
    {
      title: "nội dung",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Loại đề xuất",
      render: (text, record, index) => {
        return (
          <div>
            {STUDENT_PROPOSAL_TYPE.find((el) => el.value === record.type)
              ?.label || ""}
          </div>
        );
      },
    },
    {
      title: "Trạng thái",
      render: (text, record, index) => {
        return (
          <div>
            {PROPOSAL_STATUS_LIST.find((el) => el.value === record.status)
              ?.label || ""}
          </div>
        );
      },
    },
  ];

  function handleChangeTable(pagination) {
    setTableParams({
      ...tableParams,
      page: pagination.current,
      size: pagination.pageSize,
    });
  }
  const items = [
    {
      key: "1",
      label: `Quản lý đề xuất`,
      children: (
        <div>
          <PopupStudentSuggest
            open={openSuggest}
            setOpen={setOpenSuggest}
            info={user}
            setUpdate={setIsUpdate}
          />
          <div className="text-2xl font-bold mt-1 mb-5">
            <PullRequestOutlined /> Quản lý đề xuất
          </div>
          <Form form={form} onFinish={submitSearch}>
            <Row>
              <Col xs={24} lg={16} className="flex gap-5">
                <Form.Item name="type" label="Loại đề xuất" className="w-full">
                  <Select placeholder="-- Chọn --">
                    <Select.Option value="">-- Chọn --</Select.Option>
                    {STUDENT_PROPOSAL_TYPE.map((proposal, index) => (
                      <Select.Option value={proposal.value} key={index}>
                        {proposal.label}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item name="status" label="Trạng thái" className="w-full">
                  <Select placeholder="-- Chọn --">
                    <Select.Option value="">-- Chọn --</Select.Option>
                    {PROPOSAL_STATUS_LIST.map((proposal, index) => (
                      <Select.Option value={proposal.value} key={index}>
                        {proposal.label}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} lg={8}>
                <Button type="primary" className="ml-5" htmlType="submit">
                  Tìm kiếm
                </Button>

                <Button
                  type="primary"
                  onClick={() => {
                    setOpenSuggest(true), setIsUpdate(false);
                  }}
                  className="ml-5"
                  htmlType="text"
                >
                  Thêm đề xuất
                </Button>
              </Col>
            </Row>
          </Form>
          <Table
            size="middle"
            dataSource={suggests?.result.map((x) => ({
              ...x,
              key: x?.classroom,
            }))}
            columns={columns}
            bordered
            loading={isFetching}
            onChange={handleChangeTable}
            scroll={{ x: 1000 }}
            pagination={{
              locale: { items_per_page: "/ trang" },
              total: suggests?.total,
              showTotal: (total, range) => (
                <span>{`${range[0]} - ${range[1]} / ${total}`}</span>
              ),
              showSizeChanger: true,
              pageSizeOptions: ["10", "20", "50"],
              defaultPageSize: 10,
              position: ["bottomRight"],
            }}
          />
          ;
        </div>
      ),
    },
  ];

  return <Tabs defaultActiveKey="1" items={items} />;
};

StudentSuggest.getLayout = ({ page, pageProps }) => (
  <LayoutAdmin {...pageProps}>{page}</LayoutAdmin>
);

export default StudentSuggest;

import { ApiGetListClass, ApiGetListSuggest } from "@/api/student";
import { PROPOSAL_STATUS_LIST, TEACHER_PROPOSAL_TYPE } from "@/common/const";
import LayoutAdmin from "@/components/LayoutAdmin";
import PopupTeacherSuggest from "@/components/popup/popupTeacherSuggest";

import { Button, Col, Form, Input, Row, Select, Table, message } from "antd";
import { useState, useEffect } from "react";

const TeacherSuggest = ({ user }) => {
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
    getListSuggest();
  }, [tableParams]);
  useEffect(() => {
    if (isUpdate) {
      getListSuggest();
    }
  }, [isUpdate]);
  const getListSuggest = async () => {
    try {
      setIsFetching(true);
      const formData = form.getFieldValue();
      const response = await ApiGetListSuggest({
        ...tableParams,
        ...formData,
        userId: user.id,
      });
      setSuggest({ result: [...response.data], total: response.total || 1 });
      const classes = await ApiGetListClass({ type: "active" });
      setListClass([...classes.data]);
      setIsFetching(false);
      console.log([...response.data]);
    } catch (error) {
      setIsFetching(false);
      message.error("Có lỗi xảy ra! Vui lòng thử lại");
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
            {TEACHER_PROPOSAL_TYPE.find((el) => el.value === record.type)
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

  return (
    <div>
      <PopupTeacherSuggest
        open={openSuggest}
        setOpen={setOpenSuggest}
        info={user}
        setUpdate={setIsUpdate}
      />
      <Form form={form} onFinish={submitSearch}>
        <Row>
          <Col xs={24} lg={16} className="flex gap-5">
            <Form.Item name="type" label="Loại đề xuất" className="w-full">
              <Select placeholder="-- Chọn --">
                {TEACHER_PROPOSAL_TYPE.map((proposal, index) => (
                  <Select.Option value={proposal.value} key={index}>
                    {proposal.label}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item name="status" label="Trạng thái" className="w-full">
              <Select placeholder="-- Chọn --">
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
        dataSource={suggests?.result.map((x) => ({ ...x, key: x?.classroom }))}
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
  );
};

TeacherSuggest.getLayout = ({ page, pageProps }) => (
  <LayoutAdmin {...pageProps}>{page}</LayoutAdmin>
);

export default TeacherSuggest;

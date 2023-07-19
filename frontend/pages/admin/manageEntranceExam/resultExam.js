"use client"

import { getListExam, updateExam } from "@/api/address";
import { COLORS, GRADE, RESULT_EXAM } from "@/common/const";
import LayoutAdmin from "@/components/LayoutAdmin";
import { DeleteOutlined, IssuesCloseOutlined } from "@ant-design/icons";
import { Badge, Button, Col, Form, Input, Modal, Row, Space, Table, Tag, Tooltip, message } from "antd";
import { useEffect, useState } from "react";

const ResultExam = () => {
  const [form] = Form.useForm()
  const [tableParams, setTableParams] = useState({
    page: 1,
    size: 10
  });
  const [idSelect, setIdSelect] = useState([]);
  const [record, setRecord] = useState([]);
  const [listExam, setListExam] = useState({});
  const [recall, setRecall] = useState(false);
  const [modal, setModal] = useState({
    open: false,
    checkEdit: false // true: edit || false: add
  });

  function handleModal(option, open) {
    setModal({
      open: open,
      checkEdit: option
    })
    const dataScore = {}

    record[0].subjects.forEach(e => {
      console.log(e, 'eeee');
      dataScore[e.subjectId] = e.score
    });
    console.log(dataScore, 'dataScore');
    if (open) {
      form.setFieldsValue({
        studentId: record[0]?.studentId,
        studentName: record[0]?.studentName,
        ...dataScore
      })
    }
  }

  const [total, setTotal] = useState(tableParams.size);

  function handleChangeTable(pagination) {
    setTableParams({
      ...tableParams,
      page: pagination.current,
      size: pagination.pageSize,
    })
  }
  useEffect(() => {
    getListExam(tableParams).then(
      res => {
        setListExam(res?.data);
        setTotal(res?.data?.maxPages * res?.data?.perPage)
      }
    ).catch(err => console.log(err, 'errr get list student!'))
  }, [tableParams, recall]);

  const columns = [
    {
      title: "STT",
      render: (text, record, index) => {
        return <div>{index + 1}</div>;
      },
      align: "center",
    },
    {
      title: "Mã HS",
      render: (text, record) => {
        return <div>{record?.studentId}</div>;
      },
      align: "center",
    },
    {
      title: "Họ và tên",
      render: (text, record) => {
        return <div>{record?.studentName}</div>;
      },
      align: "center",
    },
    {
      title: "SĐT",
      render: (text, record) => {
        return <div>{record?.phoneNumber}</div>;
      },
      align: "center",
    },
    {
      title: "Khối",
      render: (text, record) => {
        return <div>{<Badge key={COLORS[record?.grade]} color={COLORS[record?.grade]} text={`Khối ${record?.grade || "..."} `} />}</div>;
      },
      align: "center",
    },
    {
      title: "Môn",
      render: (text, record) => {
        return <div className="text-left">{record?.subjects?.map(i => i.name)?.join(", ")}</div>;
      },
      align: "center",
    },
    {
      title: "Điểm thi",
      render: (text, record) => {
        return <div className="font-bold text-left">{record?.subjects?.filter(item => item?.score)?.map(i => `${i.name} : ${i?.score}`)?.join(", ")}</div>;
      },
      align: "center",
    },
    {
      title: "Trạng thái",
      render: (text, record) => {
        const result = RESULT_EXAM?.find(i => i?.value == record?.result)
        return <div>{<Tag color={result?.color} icon={result?.icon}>{result?.label}</Tag>}</div>;
      },
      align: "center",
    }
  ]
  async function updateScore(values) {
    delete values.studentId
    delete values.studentName
    const params = {
      subjects: []
    }
    for (const [key, value] of Object.entries(values)) {
      params.subjects.push({
        id: key,
        score: value ? +value : value
      })
    }
    updateExam(record[0]?.id, params).then(
      res => {
        if (res?.data?.id) {
          message.success("Cập nhật điểm thi thành công!")
          form.resetFields()
          setModal({
            open: false,
            checkEdit: false
          })
          setRecall(!recall)
          setTableParams({
            page: 1,
            size: 10
          })
          setIdSelect([])
          setRecord([])
        }
      }
    ).catch(err => message.error('Có lỗi xảy ra! ' + err))
  }
  return (
    <>
      <Modal
        open={modal.open}
        title="Cập nhật điểm thi"
        footer={null}
        onCancel={() => handleModal(false, false)}
      >
        <Form
          form={form}
          labelCol={{
            span: 6
          }}
          onFinish={updateScore}
        >
          <Form.Item name="studentId" label="Mã học sinh">
            <Input disabled />
          </Form.Item>
          <Form.Item name="studentName" label="Họ và tên">
            <Input disabled />
          </Form.Item>
          {
            record[0]?.subjects?.map(item => (
              <>
                <Form.Item name={item.subjectId} label={item.name}>
                  <Input placeholder="Nhập điểm thi" />
                </Form.Item>
              </>
            ))
          }
          <Row gutter={[8, 8]} justify="center">
            <Col>
              <Button onClick={() => handleModal(false, false)}>Hủy</Button>
            </Col>
            <Col>
              <Button type="primary" htmlType="submit">Lưu</Button>
            </Col>
          </Row>
        </Form>
      </Modal>
      <p className="font-bold mb-2">Danh sách kết quả thi đầu vào</p>
      <Row gutter={[8, 8]}>
        <Col xs={24} lg={12}></Col>
        <Col xs={24} lg={12} className="text-right">
          <Button type="primary"
            disabled={idSelect.length !== 1 || record[0]?.result == 'pass_exam'}
            onClick={() => handleModal(false, true)}
            icon={<IssuesCloseOutlined />}
          >Cập nhật điểm thi</Button>
        </Col>
      </Row>

      <Table
        locale={{
          emptyText: <div style={{ marginTop: '20px' }}>{listExam?.result?.length === 0 ? "Không có dữ liệu!" : null}</div>,
        }}
        rowSelection={{
          type: 'checkbox',
          selectedRowKeys: idSelect,
          onChange: (selectedRowKeys, selectedRows) => {
            setIdSelect(selectedRowKeys)
            setRecord(selectedRows)
          }
        }}
        size="middle"
        style={{
          marginTop: '10px',
          width: '100%'
        }}
        dataSource={listExam?.result?.map(item => ({ ...item, key: item?.studentId }))}
        columns={columns}
        bordered
        scroll={{ x: 1000 }}
        onChange={handleChangeTable}
        pagination={{
          locale: { items_per_page: "/ trang" },
          total: total,
          showTotal: (total, range) => (
            <span>{`${range[0]} - ${range[1]} / ${total}`}</span>
          ),
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50"],
          defaultPageSize: 10,
          position: ["bottomRight"],
          current: tableParams.page,
          pageSize: tableParams.size
        }}
      />
    </>
  )
}



ResultExam.getLayout = ({ page, pageProps }) => (
  <LayoutAdmin {...pageProps}>{page}</LayoutAdmin>
);

export default ResultExam
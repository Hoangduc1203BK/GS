import { dayOfWeekVn } from "@/common/util";
import { CalendarOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

export default function LayoutTimeTables({ schedule }) {
  return (
    <div>
      <div className="rounded-md mt-3	border-solid border-black border-2 p-4">
        {schedule.map((el, index) => (
          <div className="mb-2" key={index}>
            <div>
              <b>
                {index === 6 ? "Chủ nhật" : "Thứ " + (index + 2)} - Ngày{" "}
                {el.day}
              </b>
            </div>

            {el.classes ? (
              el.classes?.map((e, idx) => (
                <div className="flex items-center" key={idx}>
                  <div className="w-1/5 text-xs">
                    Từ {e.start}h đến {e.end}h
                  </div>
                  <div className="w-3/5">
                    <div>
                      <b>Môn {e.subject}</b>
                    </div>
                    <div className="text-xs">
                      {" "}
                      Giáo viên: {e.teacher} - {e.room}{" "}
                    </div>
                  </div>
                  <div className="w-1/5 text-end">
                    <div>{e.session}</div>
                    <div className="text-xs">{e.time}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center">Chưa Có lớp</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

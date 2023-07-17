import { dayOfWeekVn } from "@/common/util";
import { CalendarOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

export default function LayoutTimeTables({ schedule }) {
  return (
    <div>
      <div className="mt-3 p-4">
        {schedule.map((el, index) => (
          <div
            className="mb-3 cursor-pointer hover:scale-105  transition duration-700 ease-in-out hover:border-2 border-solid border-black border-[1px] py-1 px-2 rounded-md shadow-md"
            key={index}
          >
            <div>
              <b>
                {index === 6 ? "Chủ nhật" : "Thứ " + (index + 2)} - Ngày{" "}
                {el.day}
              </b>
            </div>

            {el.classes?.length ? (
              el.classes?.map((e, idx) => (
                <div className="flex items-center mt-2" key={idx}>
                  <div className="w-3/12 text-xs">
                    Từ {e.start}h đến {e.end}h
                  </div>
                  <div className="w-7/12">
                    <div>
                      <b>Môn {e.subject}</b>
                    </div>
                    <div className="text-xs">
                      {" "}
                      Giáo viên: {e.teacher} - {e.room}{" "}
                    </div>
                  </div>
                  <div className="w-2/12 text-end">
                    <div> Buổi {idx + 1}</div>
                    <div className="text-xs">2 tiếng</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center font-bold">
                Chưa Có lớp
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

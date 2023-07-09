import { dayOfWeekVn } from "@/common/util";
import { CalendarOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

export default function LayoutTimeTables({ schedule }) {

  return (
    <div>

      <div className="rounded-md mt-3	border-solid border-black border-2 p-4">
        {schedule.map((el,index) => (
          <div className="mb-2" key={index}>
            <div>
              <b>
                {dayOfWeekVn(el.startDate)} -{" "}
                {dayjs(el.startDate).format("DD.MM")}
              </b>
            </div>
            <div className="flex items-center">
              <div className="w-1/5 text-xs">{el.startTime}</div>
              <div className="w-3/5">
                <div>
                  <b>Môn {el.subject}</b>
                </div>
                <div className="text-xs">
                  {" "}
                  Giáo viên: {el.teacher} - {el.room}{" "}
                </div>
              </div>
              <div className="w-1/5 text-end">
                <div>{el.session}</div>
                <div className="text-xs">{el.time}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

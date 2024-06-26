import React, { useEffect } from "react";
import DatePicker from "react-datepicker";
import "../../../components/SubmitButton/SubmitButton.css";
import "react-datepicker/dist/react-datepicker.css";
import "./RTTableSelection.css";
import { FaCalendarAlt } from "react-icons/fa";
import CustomDropDown from "../../../components/CustomDropDown/CustomDropDown";
import { useRTTableDataMutation } from "../../../hooks/useRTDataMutation";
import { selectLocationOptions, selectUnitOptions, selectHourOptions } from "../../../constants/selectOption";
import useRTStore from '../../../store/RTStore';
import useNodeInfoStore from "../../../store/NodeInfoStore";

function RTTableSelection() {

  const { nodes } = useNodeInfoStore();
  const nodeLocation = ['전체', ...nodes.map((row) => (row.location))];

  const { tableLocation, tableUnit, tableDate, tableHour, setTableLocation, setTableUnit, setTableDate, setTableHour } = useRTStore();

  const { mutate: tableMutate } = useRTTableDataMutation();

  const handleSearchButton = () => {

    if(tableUnit.match("시간평균") && tableLocation.match("전체") && tableHour.match("전체")){
      alert('전체시간으로 검색시에는 상세 측정 위치를 선택하셔야 합니다.');
    }
    else{
      tableMutate();
    }

  };


  useEffect(() => {
    const loadData = async () => {
      await setTableUnit(selectUnitOptions[0]);
      await setTableDate(new Date(2024,0,2)); // new Date() 로 변경해줘야 함
      await setTableHour(selectHourOptions[0]);
      await setTableLocation(nodeLocation[0]);

      tableMutate();
    }
    
    loadData();
  },[]);


  const handleNodeSelect = (node) => {
    setTableLocation(node);
  };

  const handleUnitSelect = (unit) => {
    setTableUnit(unit);
  };

  const handleDateChange = (date) => {
    setTableDate(date);
  };

  const handleHourSelect = (hour) => {
    setTableHour(hour);
    console.log(hour);
  };

  const CustomDatePickerIcon = React.forwardRef(({ onClick }, ref) => (
    <button
      onClick={onClick}
      ref={ref}
      style={{ background: "none", border: "none" }}
    >
      <FaCalendarAlt style={{ color: "rgba(85,183,107)", fontSize: "1.2em" }} />
    </button>
  ));


  return (
    <div className="RTTable">
      <div className="RT-table-title-container">
        <span className="RT-table-title">| 측정 일시 |</span>
        {new Date(tableDate).toLocaleDateString()} 
      </div>
      <div className="RT-table-select-container">
        <div className="location-and-unit">
          <div className="RT-table-location">
            <p>측정위치</p>
            <CustomDropDown
              optionData={nodeLocation}
              selectedValue={tableLocation}
              handleSelectedValue={handleNodeSelect}
            />
          </div>
          <div className="RT-table-unit">
            <p>측정단위</p>
            <CustomDropDown
              optionData={selectUnitOptions}
              selectedValue={tableUnit}
              handleSelectedValue={handleUnitSelect}
            />
          </div>
          <div className="RT-table-time">
            <p>측정일시</p>
            <div className="time-dropdown">
              {tableDate && <div className="date-container">{tableDate.toLocaleDateString()}</div>}
              <DatePicker
                selected={tableDate}
                onChange={handleDateChange}
                maxDate={new Date()}
                showTimeSelect={false}
                dateFormat="MMMM d, yyyy h:mm aa"
                customInput={<CustomDatePickerIcon />}
              />
            </div>
            {tableUnit == "시간평균" ? (
              <CustomDropDown
                optionData={selectHourOptions}
                selectedValue={tableHour}
                handleSelectedValue={handleHourSelect}
              />
            ) : null}
          </div>
        </div>

        <div className="search-btn-container">
          <button className="search-btn" onClick={handleSearchButton}>검색</button>
        </div>
      </div>
    </div>
  );
}

export default RTTableSelection;

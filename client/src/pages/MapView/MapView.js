import React, { useState, useEffect } from "react";
import "./MapView.css";
import GoogleMap from "../../components/GoogleMap/GoogleMap";
import { Wrapper } from "@googlemaps/react-wrapper";
import OptionContainer from "./OptionContainer/OptionContainer";
import LegendInfo from "./LegendInfo/LegendInfo";
import NodeInfo from "./NodeInfo/NodeInfo";
import NodeInfoResponsive from "./NodeInfoResponsive/NodeInfoResponsive";
import { useMapDataMutation } from "../../hooks/useMapDataMutation";
import useMapStore from "../../store/MapStore";

function MapView() {
  const [selectedNode, setSelectedNode] = useState("전체");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [option, setOption] = useState("pm25"); // 초미세먼지 기본값으로 초기화

  const [legendTitle, setLegendTitle] = useState("초미세먼지");
  const [selectedButtonId, setSelectedButtonId] = useState(1);
  const [legendValueGood, setlegendValueGood] = useState("0~15");
  const [legendValueNormal, setlegendValueNormal] = useState("16~35");
  const [legendValueBad, setlegendValueBad] = useState("36~75");
  const [legendValueWorse, setlegendValueWorse] = useState("76~");

  const handleNodeSelect = (node) => {
    setSelectedNode(node);
    setDropdownOpen(false);
  };

  const selectedButtonAction = (buttonId) => {
    setSelectedButtonId(buttonId);

    var newOption = "pm25";
    if (buttonId === 1) {
      newOption = "pm25"; // 초미세먼지
      setLegendTitle("초미세먼지");
      setlegendValueGood( "0~15");
      setlegendValueNormal("16~35");
      setlegendValueBad("36~75");
      setlegendValueWorse("76~");
    } else if (buttonId === 2) {
      newOption = "pm10";
      setLegendTitle("미세먼지");
      setlegendValueGood("0~30");
      setlegendValueNormal("31~80");
      setlegendValueBad("81~150");
      setlegendValueWorse("151~");
    } else {
      newOption = "HCHO";
      setLegendTitle("포름알데히드");
      setlegendValueGood("-");
      setlegendValueNormal("-");
      setlegendValueBad("-");
      setlegendValueWorse("-");
    }

    setOption(newOption);
  };

  const { mutate: mapMutate } = useMapDataMutation();

  useEffect(() => {
    // 초기 데이터 로드
    mapMutate();

    // 다음 정각까지의 시간(밀리초) 계산
    const now = new Date();
    const delay = 3600000 - (now.getMinutes() * 60000 + now.getSeconds() * 1000 + now.getMilliseconds());

    // 정각에 첫 실행을 위한 타이머 설정
    const timeoutId = setTimeout(() => {
      mapMutate(); // 데이터 로드
      // 이후 매 시간마다 데이터 로드
      setInterval(mapMutate, 3600000);
    }, delay);

    // 컴포넌트 언마운트 시 타이머 정리
    return () => {
      clearTimeout(timeoutId);
    };

  },[]);


  return (
    <div className="main-container">
      <div className="map-and-info-container">
        <div className="map-container">
          <Wrapper apiKey={"AIzaSyCjp5Sxe-c5mUn1GtfLqEatR0mt7cXYdIM"}>
            <GoogleMap
              option={option}
              options={{ disableDefaultUI: true, zoomControl: false }}
            />
          </Wrapper>
        </div>
        <div className="option-and-info-flex-container">
          <OptionContainer
            selectedButtonId={selectedButtonId}
            selectedButtonAction={selectedButtonAction}
          />
          <div className="info-container">
            <NodeInfo
              selectedNode={selectedNode}
              handleNodeSelect={handleNodeSelect}
            />
            <div className="info-container-dividier"></div>
            <LegendInfo
              legendTitle={legendTitle}
              legendValueGood={legendValueGood}
              legendValueNormal={legendValueNormal}
              legendValueBad={legendValueBad}
              legendValueWorse={legendValueWorse}
            />
          </div>
        </div>
      </div>
      <NodeInfoResponsive
        selectedNode={selectedNode}
        handleNodeSelect={handleNodeSelect}
      />
    </div>
  );
  
}

export default MapView;

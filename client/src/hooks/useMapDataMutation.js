import { useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchMapData } from '../api/MapApi';
import useMapStore from '../store/MapStore';
import  { locationFromNodeNumberOptions, positionOfNode } from "../util.js";


export const useMapDataMutation = () => {
  // const queryClient = useQueryClient();
  const { mapLocation, setMapData } = useMapStore();

  const mapMutate = () => {
    return fetchMapData(mapLocation);
  };

  const findLatestHourData = (data) => {//가장 최근에 기록된 시간을 찾기
    let maxHour = -1;
    let latestDataKey = null;

    for( const key in data) {
        const hour = parseInt(key.slice(4,6));

        if(hour > maxHour){
            maxHour = hour;
            latestDataKey = key;
        }
    }

    console.log("🔑",latestDataKey);

    return latestDataKey;
  };


  const makeFormattedMapData = (responseJson) => {//
    const transformedData = [];
    const responseJsonData = responseJson.data;
    const latestDataKey = findLatestHourData(responseJsonData);

    // console.log("😆",responseJsonData[latestDataKey]);

    for(const [nodeKey,nodeValue] of Object.entries(responseJsonData[latestDataKey])){
        if(!nodeKey.includes("node")) continue;
       
        let id = parseInt(nodeKey.replace("node",""),10);
        let location = locationFromNodeNumberOptions[id];
        
        transformedData.push({
            id: id,
            label: location,
            position: positionOfNode[id],
            pm25: nodeValue["pm25-hourly-average"],
            pm10: nodeValue["pm10-hourly-average"],
            ch2o: nodeValue["ch2o-hourly-average"],
            wind_speed: nodeValue["wind-speed-hourly-average"],
            wind_direction: nodeValue["wind-direction-hourly-average"],
            temperature: nodeValue["temperature-hourly-average"],
            humidity: nodeValue["humidity-hourly-average"],
        });
    }
    console.log(transformedData);

    return transformedData;
  };

  const mutation = useMutation({
      mutationFn: mapMutate,
      onSuccess: async (data, variables, context) =>  {
        // const queryClient = useQueryClient(); // 캐시 데이터된 무효화 -> 다시 실행 -> 최신 데이터
        setMapData(makeFormattedMapData(data));
        console.log("✅  MapStore fetch success", data, new Date());
      },
      onError: (error, variables, context) => {
        console.log("🚨 MapStore fetch error", error);
      },
      onSettled: (data, error, variables, context) => {
        // console.log("🚀 Loading table ...");
      },
      //retry: 1,//오류 발생시, 1회 더 시도
  });

  return mutation;
}
/*!
  _   _  ___  ____  ___ ________  _   _   _   _ ___   
 | | | |/ _ \|  _ \|_ _|__  / _ \| \ | | | | | |_ _| 
 | |_| | | | | |_) || |  / / | | |  \| | | | | || | 
 |  _  | |_| |  _ < | | / /| |_| | |\  | | |_| || |
 |_| |_|\___/|_| \_\___/____\___/|_| \_|  \___/|___|
                                                                                                                                                                                                                                                                                                                                       
=========================================================
* Horizon UI - v1.1.0
=========================================================

* Product Page: https://www.horizon-ui.com/
* Copyright 2023 Horizon UI (https://www.horizon-ui.com/)

* Designed and Coded by Simmmple

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

// Chakra imports
import {
  Avatar,
  Box,
  Flex,
  FormLabel,
  Icon,
  Select,
  SimpleGrid,
  Spinner,
  useColorModeValue,
} from "@chakra-ui/react";
// Assets
import Usa from "assets/img/dashboards/usa.png";
import axios from "axios";
// Custom components
import MiniCalendar from "components/calendar/MiniCalendar";
import MiniStatistics from "components/card/MiniStatistics";
import IconBox from "components/icons/IconBox";
import React, { useEffect, useRef, useState } from "react";
import { CgLayoutGrid } from "react-icons/cg";
import {
  MdAddTask,
  MdAttachMoney,
  MdBarChart,
  MdFileCopy,
} from "react-icons/md";
import { BASE_API_URL } from "utils/Constants";
import { BASE_URL } from "utils/Constants";
import CheckTable from "views/admin/default/components/CheckTable";
import ComplexTable from "views/admin/default/components/ComplexTable";
import DailyTraffic from "views/admin/default/components/DailyTraffic";
import PieCard from "views/admin/default/components/PieCard";
import Tasks from "views/admin/default/components/Tasks";
import TotalSpent from "views/admin/default/components/TotalSpent";
import WeeklyRevenue from "views/admin/default/components/WeeklyRevenue";
import {
  columnsDataCheck,
  columnsDataComplex,
} from "views/admin/default/variables/columnsData";
import tableDataCheck from "views/admin/default/variables/tableDataCheck.json";
import tableDataComplex from "views/admin/default/variables/tableDataComplex.json";

export default function UserReports(props) {
  // Chakra Color Mode
  const brandColor = useColorModeValue("brand.500", "white");
  const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");

  const { search, isLoading, setIsLoading } = props;

  const getTimeRange = (type) => {
    const pad = (num) => (num < 10 ? "0" : "") + num;
    let currentDate = new Date();

    let hoursAgo = new Date(currentDate);
    hoursAgo.setHours(currentDate.getHours() - 5);
    hoursAgo.setMinutes(0);
    hoursAgo.setSeconds(0);
    hoursAgo.setMilliseconds(0);

    let hoursLater = new Date(currentDate);
    hoursLater.setMinutes(0);
    hoursLater.setSeconds(0);
    hoursLater.setMilliseconds(0);

    let date = type === "START" ? hoursAgo : hoursLater;

    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
        date.getDate()
    )}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(
        date.getSeconds()
    )}Z`;
  };

  const [data, setData] = useState(null);
  const [dataTrend, setDataTrend] = useState(null);
  const allEventsRef = useRef(null);

  useEffect(() => {
    const logTrendData = {
      startDate: getTimeRange("START"),
      endDate: getTimeRange("END"),
      deviceName: "All"
    }

    axios
      .post(BASE_API_URL + "/syslog", search)
      .then((response) => {
        setData(response.data.data.logs);
      })
      .catch((error) => {
        console.error(error);
      });

    axios
      .post(BASE_API_URL + "/syslog", logTrendData)
      .then((response) => {
        setDataTrend(response.data.data.logs);
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
        console.error(error);
      });
  }, []);

  useEffect(() => {
    const mySearch = {
      ...search,
      deviceName: "All"
    }

    axios
      .post(BASE_API_URL + "/syslog", mySearch)
      .then((response) => {
        setData(response.data.data.logs);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [search]);

  useEffect(() => {
    if (data && allEventsRef.current === null) {
      allEventsRef.current = data.total;
    }
  }, [data]);


  if (data != null && dataTrend != null) {
    const getDistinctDevice = () => {
      const logLines = data.lines;
      const distinctDeviceNames = new Set();
      logLines.forEach((log) => {
        if (log.deviceName != null) {
          distinctDeviceNames.add(log.deviceName)
        }
        else {
          distinctDeviceNames.add(log.exporterSrcAddr)
        }
      });

      let keysArrayFromMap = Array.from(distinctDeviceNames);

      localStorage.setItem("DEVICES", JSON.stringify(keysArrayFromMap));

      return distinctDeviceNames;
    };

    const transformedData = data.lines.map((dataItem) => {
      let date = new Date(dataItem.eventTs);
      date = new Date(date.setHours(date.getHours() + 7));

      return {
        message: dataItem.message,
        time: date.toISOString(),
        status: dataItem.severity,
        deviceName: dataItem.deviceName
      };
    });

    let newData = [];

    console.log(search);
    console.log(data.lines);

    if (search.deviceName == "All" || typeof search.deviceName === 'undefined' || search.deviceName == null) {
      newData = data.lines; 
    }
    else {
      newData = data.lines.filter((ele) => ele.deviceName == search.deviceName);
    }

    if (search.deviceName == "All" || search.deviceName == null) {
        return (
          <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
          <SimpleGrid
            columns={{ base: 1, md: 2, lg: 3, "2xl": 3 }}
            gap="20px"
            mb="20px"
          >
            <MiniStatistics
              startContent={
                <IconBox
                  w="56px"
                  h="56px"
                  bg={boxBg}
                  icon={
                    <Icon w="32px" h="32px" as={MdBarChart} color={brandColor} />
                  }
                />
              }
              name="All Syslog Events"
              value={data.total}
            />
            <MiniStatistics
              startContent={
                <IconBox
                  w="56px"
                  h="56px"
                  bg={boxBg}
                  icon={
                    <Icon w="32px" h="32px" as={MdBarChart} color={brandColor} />
                  }
                />
              }
              name={`Syslog Events: All`}
              value={data.total}
            />
            <MiniStatistics
              startContent={
                <IconBox
                  w="56px"
                  h="56px"
                  bg={boxBg}
                  icon={
                    <Icon w="32px" h="32px" as={MdBarChart} color={brandColor} />
                  }
                />
              }
              name={`All Devices`}
              value={getDistinctDevice().size}
            />
          </SimpleGrid>
  
          <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap="20px" mb="20px">
            <TotalSpent data={dataTrend} />
            <DailyTraffic data={newData} setIsLoading={setIsLoading} />
          </SimpleGrid>
          <SimpleGrid columns={{ base: 1, md: 1, xl: 2 }} gap="20px" mb="20px">
          <ComplexTable
              columnsData={columnsDataComplex}
              tableData={transformedData}
              search={search}
            />
            <SimpleGrid columns={{ base: 1, md: 1, xl: 1 }} gap="20px">
              <PieCard data={data} />
            </SimpleGrid>
          </SimpleGrid>
        </Box>
        )
    }
    else {
      function getDataByDeviceName(data) {
        const logs = data || [];

        const filteredData = logs.lines.filter(log => log.deviceName == search.deviceName);
      
        return {
          ...logs,
          lines: filteredData
        };
      }

      const dataForDevice = getDataByDeviceName(data);

      return (
        <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
          <SimpleGrid
            columns={{ base: 1, md: 2, lg: 3, "2xl": 3 }}
            gap="20px"
            mb="20px"
          >
            <MiniStatistics
              startContent={
                <IconBox
                  w="56px"
                  h="56px"
                  bg={boxBg}
                  icon={
                    <Icon w="32px" h="32px" as={MdBarChart} color={brandColor} />
                  }
                />
              }
              name="All Events"
              value={allEventsRef.current}
            />
            <MiniStatistics
              startContent={
                <IconBox
                  w="56px"
                  h="56px"
                  bg={boxBg}
                  icon={
                    <Icon w="32px" h="32px" as={MdBarChart} color={brandColor} />
                  }
                />
              }
              name={`Syslog Events: ${typeof search.deviceName === 'undefined' ? "All" : search.deviceName}`}
              value={dataForDevice.lines.length}
            />
            <MiniStatistics
              startContent={
                <IconBox
                  w="56px"
                  h="56px"
                  bg={boxBg}
                  icon={
                    <Icon w="32px" h="32px" as={MdBarChart} color={brandColor} />
                  }
                />
              }
              name="All Devices"
              value={getDistinctDevice().size}
            />
          </SimpleGrid>
  
          <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap="20px" mb="20px">
            <TotalSpent data={dataTrend} />
            <DailyTraffic data={newData} search={search}/>
          </SimpleGrid>
          <SimpleGrid height='415px !important' minHeight='415px !important' maxHeight='415px !important' columns={{ base: 1, md: 1, xl: 2 }} gap="20px" mb="20px">
          <ComplexTable
              height='415px !important' minHeight='415px !important' maxHeight='415px !important'
              columnsData={columnsDataComplex}
              tableData={transformedData}
              search={search}
            />
            <SimpleGrid height='415px !important' minHeight='415px !important' maxHeight='415px !important' columns={{ base: 1, md: 1, xl: 1 }} gap="20px">
              <PieCard height='415px !important' minHeight='415px !important' maxHeight='415px !important' data={data} />
            </SimpleGrid>
          </SimpleGrid>
          {/* <SimpleGrid columns={{ base: 1, md: 1, xl: 2 }} gap="20px" mb="20px">
            <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap="20px">
              <Tasks />
              <MiniCalendar h="100%" minW="100%" selectRange={false} />
            </SimpleGrid>
          </SimpleGrid> */}
        </Box>
      );
    }

    
  } else {
    return <></>;
  }
}

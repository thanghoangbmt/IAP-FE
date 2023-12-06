// Chakra imports
import {
  Box,
  Button,
  Flex,
  Icon,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
// Custom components
import Card from "components/card/Card.js";
import LineChart from "components/charts/LineChart";
import React, { useEffect, useState } from "react";
import { IoCheckmarkCircle } from "react-icons/io5";
import { MdBarChart, MdOutlineCalendarToday } from "react-icons/md";
// Assets
import { RiArrowUpSFill } from "react-icons/ri";
import {
  lineChartDataTotalSpent,
  lineChartOptionsTotalSpent,
} from "variables/charts";

export default function TotalSpent(props) {
  const { ...rest } = props;
  const { data } = props;

  const [myData, setMyData] = useState(null);

  useEffect(() => {
    setMyData(data);
  }, [data])

  // Chakra Color Mode

  const textColor = useColorModeValue("secondaryGray.900", "white");
  const textColorSecondary = useColorModeValue("secondaryGray.600", "white");
  const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
  const iconColor = useColorModeValue("brand.500", "white");
  const bgButton = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
  const bgHover = useColorModeValue(
    { bg: "secondaryGray.400" },
    { bg: "whiteAlpha.50" }
  );
  const bgFocus = useColorModeValue(
    { bg: "secondaryGray.300" },
    { bg: "whiteAlpha.100" }
  );
  
  if (myData != null) {

    const countDataByDay = () => {
      const countsByHour = {};
  
    myData.lines.forEach((log) => {
      const [day, hour] = log.eventTs.split("T"); 
      const key = `${day} ${hour.split(":")[0]}`; // Use only the hour part
  
      if (!countsByHour[key]) {
        countsByHour[key] = 0;
      }
  
      countsByHour[key]++;
    });
  
    const countsArray = Object.entries(countsByHour).map(([hour, count]) => ({
      hour,
      count,
    }));
  
      return countsArray.sort((a, b) => a.hour.localeCompare(b.hour));
    };

    const dataChart = [
      {
        name: "Logs Trend",
        data: countDataByDay().map(ele => ele.count),
      },
    ];
  
    let lineOptions = {
      ...lineChartOptionsTotalSpent,
      xaxis: {
        ...lineChartOptionsTotalSpent.xaxis,
        categories: countDataByDay().map(ele => {
          let date = new Date(`${ele.hour}:00:00`);
          date.setUTCHours(date.getHours() + 7);

          return date.toISOString();
        })
      }
  
    }

    return (
      <Card
        justifyContent="center"
        align="center"
        direction="column"
        w="100%"
        mb="0px"
        {...rest}
      >
        <Flex justify="space-between" ps="0px" pe="20px" pt="5px">
          <Flex align="center" w="100%">
            <Text
              me="auto"
              color={textColor}
              fontSize="xl"
              fontWeight="700"
              lineHeight="100%"
            >
              Logs Trend In Past 5 Hours
            </Text>
          </Flex>
        </Flex>
        <Flex w="100%" flexDirection={{ base: "column", lg: "row" }}>
          <Box minH="260px" minW="100%" mt="auto">
            <LineChart
              chartData={dataChart}
              chartOptions={lineOptions}
            />
          </Box>
        </Flex>
      </Card>
    );
  }
  else {
    return (<></>)
  }
}

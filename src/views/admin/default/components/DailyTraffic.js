import React, { useEffect, useState } from "react";

// Chakra imports
import { Box, Flex, Icon, Text, useColorModeValue } from "@chakra-ui/react";
import BarChart from "components/charts/BarChart";

// Custom components
import Card from "components/card/Card.js";
import {
  barChartDataDailyTraffic,
  barChartOptionsDailyTraffic,
} from "variables/charts";

// Assets
import { RiArrowUpSFill } from "react-icons/ri";
import { SEVERITY_MAP } from "utils/Constants";

export default function DailyTraffic(props) {
  const { ...rest } = props;
  const { data, search, setIsLoading } = props;

  const [detailData, setDetailData] = useState(null);
  const [mySearch, setMySearch] = useState("All");
  const [allData, setAllData] = useState([]);

  useEffect(() => {
    setDetailData(data);
  }, [data, search, mySearch]);

  useEffect(() => {
    setMySearch(mySearch);
  }, [search]);

  // Chakra Color Mode
  const textColor = useColorModeValue("secondaryGray.900", "white");

  if (detailData != null) {

    const severityCounts = SEVERITY_MAP.map(severity => {
      const count = detailData.reduce((acc, log) => (log.severity === severity.id ? acc + 1 : acc), 0);
      return { ...severity, count };
    });
  
    const severityCountsTransformed = severityCounts.map(severity => ({
      id: severity.id,
      name: severity.text,
      data: [severity.count],
    })).sort((a, b) => a.id - b.id);
  
  
    const allData = severityCountsTransformed.reduce((accumulator, current) => {
      accumulator.push(...current.data);
      return accumulator;
    }, []);

    let chartLines = [
      {
        name: "Logs",
        data: allData
      }
    ]

    let lineOptions = {
      ...barChartOptionsDailyTraffic,
      xaxis: {
        ...barChartOptionsDailyTraffic.xaxis,
        categories: severityCountsTransformed.map(ele => ele.name)
      }
  
    }
    return (
      <Card align='center' direction='column' w='100%' {...rest} key={detailData}>
        <Flex justify='space-between' align='start' px='10px' pt='5px'>
          <Flex flexDirection='column' align='start' me='20px'>
            <Flex w='100%'>
            <Text
              me="auto"
              color={textColor}
              fontSize="xl"
              fontWeight="700"
              lineHeight="100%"
            >
              Syslog Severity Events
            </Text>
            </Flex>
          </Flex>
        </Flex>
        <Box h='240px' mt='auto'>
          <BarChart
            chartData={chartLines}
            chartOptions={lineOptions}
          />
        </Box>
      </Card>
    );
  }
  else {
    return (<></>)
  }
}

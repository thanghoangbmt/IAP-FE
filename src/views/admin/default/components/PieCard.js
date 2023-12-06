// Chakra imports
import { Box, Flex, Text, Select, useColorModeValue } from "@chakra-ui/react";
// Custom components
import Card from "components/card/Card.js";
import PieChart from "components/charts/PieChart";
import { pieChartData, pieChartOptions } from "variables/charts";
import { VSeparator } from "components/separator/Separator";
import React from "react";
import { generateRandomColorsArray } from "utils/Constants";

export default function Conversion(props) {
  const { ...rest } = props;
  const {data} = props;

  function getDistinctDevices(logs) {
    const deviceCounts = {};
  
    logs.forEach(log => {
      let device = log.deviceName;

      if (device == null) {
        device = log.exporterSrcAddr;
      }

      // console.log(log)
      // console.log(device);

      if (!deviceCounts[device]) {
        deviceCounts[device] = 0;
      }
  
      deviceCounts[device]++;
    });
  
    const distinctDevices = Object.entries(deviceCounts)
    .sort((a, b) => b[1] - a[1]) 
    .slice(0, 3) 
    .map(([device, count]) => ({
      device,
      count,
    }));
  
    return distinctDevices;
  }

  const pieChartDataMap = getDistinctDevices(data.lines).map((ele) => ele.count);

  const colors = generateRandomColorsArray(getDistinctDevices(data.lines).length, 6);

  const pieChartOptionsMap = {
    ...pieChartOptions,
    labels: getDistinctDevices(data.lines).map((ele) => ele.device),
    colors: colors,
    fill: {
      colors: colors
    }
  }

  // Chakra Color Mode
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const cardColor = useColorModeValue("white", "navy.700");
  const cardShadow = useColorModeValue(
    "0px 18px 40px rgba(112, 144, 176, 0.12)",
    "unset"
  );
  return (
    <Card p='20px' align='center' direction='column' w='100%' {...rest}>
      <Flex
        px={{ base: "0px", "2xl": "10px" }}
        justifyContent='space-between'
        alignItems='center'
        w='100%'
        mb='8px'>
       <Text
          color={textColor}
          fontSize='22px'
          fontWeight='700'
          lineHeight='100%'>
          Top 3 Devices
        </Text>
        {/* <Select
          fontSize='sm'
          variant='subtle'
          defaultValue='monthly'
          width='unset'
          fontWeight='700'>
          <option value='daily'>Daily</option>
          <option value='monthly'>Monthly</option>
          <option value='yearly'>Yearly</option>
        </Select> */}
      </Flex>

      <PieChart
        h='100%'
        w='100%'
        chartData={pieChartDataMap}
        chartOptions={pieChartOptionsMap}
      />
      <Card
        bg={cardColor}
        flexDirection='row'
        boxShadow={cardShadow}
        w='100%'
        p='15px'
        px='20px'
        mt='15px'
        mx='auto'>

          {
              getDistinctDevices(data.lines).map((ele) => (
                <>
                  <Flex direction='column' py='5px' marginRight='30px'>
                    <Flex align='center'>
                      <Box h='8px' w='8px' bg='brand.500' borderRadius='50%' me='4px' />
                      <Text
                        fontSize='xs'
                        color='secondaryGray.600'
                        fontWeight='700'
                        mb='5px'>
                        {ele.device}
                      </Text>
                    </Flex>
                    <Text fontSize='lg' color={textColor} fontWeight='700'>
                    {ele.count}
                    </Text>
                  </Flex>
                </>
              ))
          }
      </Card>
    </Card>
  );
}

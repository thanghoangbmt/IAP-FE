import {
  Flex,
  Table,
  Progress,
  Icon,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  TableContainer,
  Select,
  Input,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";
import React, { useEffect, useMemo, useState } from "react";
import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";

// Custom components
import Card from "components/card/Card";
import Menu from "components/menu/MainMenu";

// Assets
import { MdCheckCircle, MdCancel, MdOutlineError } from "react-icons/md";
import { SEVERITY_MAP } from "utils/Constants";
export default function ColumnsTable(props) {
  const { columnsData, tableData, search } = props;

  const [data, setData] = useState(null);
  const [select, setSelect] = useState("All");
  const [searchText, setSearchText] = useState("");
  const [mySearch, setMySearch] = useState({
    deviceName: "All"
  });
  const { isOpen, onOpen, onClose } = useDisclosure()

  const [modal, setModal] = useState({
    message: "",
    isOpened: false,
  })

  useEffect(() => {
    setData(tableData);
  }, [tableData, select])

  useEffect(() => {
    setMySearch(search);
  }, [search])

  const textColor = useColorModeValue("secondaryGray.900", "white");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");

    if (data != null) {
      let newData = [];

      if (mySearch.deviceName == "All") {
        newData = data; 
      }
      else {
        newData = data.filter((ele) => ele.deviceName == mySearch.deviceName);
      }

      let newDataMap = [];

      if (select == "All") {
        newDataMap = newData.filter((ele) => {
          return ele.message.includes(searchText);
        })
      }
      else{
        newDataMap = newData.filter((ele) => {
          let status = SEVERITY_MAP.filter(ele => ele.text == select)[0].id;
          return ele.status == status && ele.message.includes(searchText);
        })
      }

      const setClose = () => {
        onClose();
        setModal({
          message: "",
          isOpened: false,
        })
      }

      const setOpen = (message) => {
        onOpen();
        setModal({
          message: message,
          isOpened: true,
        })
      }

      return (
        <Card
          key={data}
          direction='column'
          w='100%'
          px='0px'
          height='415px'
          overflowX={{ sm: "scroll", lg: "hidden" }}>
          <Flex px='25px' justify='space-between' mb='10px' align='center'>
            <Text
              color={textColor}
              fontSize='22px'
              fontWeight='700'
              lineHeight='100%'>
              Severity Log Messages
            </Text>
            <Input placeholder="Search..." maxWidth='170px' transform='translateX(30px)' onChange={(e) => {
              setSearchText(e.target.value)
            }}/>
            <Select onChange={(e) => {
                      setSelect(e.target.value)
                    }} maxWidth='150px'>
                <option >All</option>
              {
                SEVERITY_MAP.map((ele) => {
                  return (
                    <option>{ele.text}</option>
                  )
                })
              }
            </Select>
          </Flex>
          <TableContainer overflowY='scroll' maxHeight='325px'>
          <Table variant='striped' colorScheme='gray' overflowY='scroll' color='gray.500' mb='24px'>
            <Thead>
              <Tr>
                <Th
                  pe='10px'
                  borderColor={borderColor}
                  maxWidth='300px'
                  >
                  <Flex
                    justify='space-between'
                    align='center'
                    fontSize={{ sm: "10px", lg: "12px" }}
                    color='gray.400'>
                    {"Message"}
                  </Flex>
                </Th>
                <Th
                  pe='10px'
                  borderColor={borderColor}>
                  <Flex
                    justify='space-between'
                    align='center'
                    fontSize={{ sm: "10px", lg: "12px" }}
                    color='gray.400'>
                    {"Status"}
                  </Flex>
                </Th>
                <Th
                  pe='10px'
                  borderColor={borderColor}>
                  <Flex
                    justify='space-between'
                    align='center'
                    fontSize={{ sm: "10px", lg: "12px" }}
                    color='gray.400'>
                    {"Time"}
                  </Flex>
                </Th>
              </Tr>
            </Thead>
            <Tbody >
              {newDataMap.map((row, index) => {
                return (
                  <Tr
                  onClick={() => setOpen(row.message)}
                  key={index}>
                    <Td
                    className="text-wrap"
                          fontSize={{ sm: "14px" }}
                          maxH='30px !important'
                          py='8px'
                          minW={{ sm: "150px", md: "200px", lg: "auto" }}
                          maxW='300px'
                          textWrap='wrap'
                          borderColor='transparent'>
                          {row.message}
                    </Td>
                    <Td
                          fontSize={{ sm: "14px" }}
                          maxH='30px !important'
                          py='8px'
                          minW={{ sm: "150px", md: "200px", lg: "auto" }}
                          borderColor='transparent'>
                          {SEVERITY_MAP.filter(ele => ele.id === row.status)[0].text}
                    </Td>
                    <Td
                          fontSize={{ sm: "14px" }}
                          maxH='30px !important'
                          py='8px'
                          minW={{ sm: "150px", md: "200px", lg: "auto" }}
                          borderColor='transparent'>
                          {row.time}
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
          </TableContainer>
          <Modal isOpen={modal.isOpened} onClose={setClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Message Detail</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <>
                  {modal.message}
                </>
              </ModalBody>
            </ModalContent>
          </Modal>
        </Card>
      );
    }
    else {
      return (<></>)
    }
}

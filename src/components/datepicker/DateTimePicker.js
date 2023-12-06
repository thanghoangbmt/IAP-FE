import React from 'react';
import { Flex, Input, DatePicker } from '@chakra-ui/react';

const DateTimePicker = () => {
  const [date, setDate] = React.useState(new Date());

  return (
    <Flex direction="column" gap={4}>
      <DatePicker
        selected={date}
        onChange={setDate}
        format="MM/dd/yyyy"
      />
      <Flex gap={2}>
        <Input
          type="number"
          placeholder="Hour"
          value={date.getHours()}
          onChange={(e) => setDate(new Date(date.setHours(parseInt(e.target.value))))}
        />
        <Input
          type="number"
          placeholder="Minute"
          value={date.getMinutes()}
          onChange={(e) => setDate(new Date(date.setMinutes(parseInt(e.target.value))))}
        />
        <Input
          type="number"
          placeholder="Second"
          value={date.getSeconds()}
          onChange={(e) => setDate(new Date(date.setSeconds(parseInt(e.target.value))))}
        />
      </Flex>
    </Flex>
  );
};

export default DateTimePicker;
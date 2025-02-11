"use client";

import { DateRangePicker } from "@heroui/react";
import React from "react";
import { parseDate } from "@internationalized/date";
type Props = {};

const Calendar = (props: Props) => {
  return (
    <DateRangePicker
      isDisabled
      className="max-w-xs"
      defaultValue={{
        start: parseDate("2024-04-01"),
        end: parseDate("2024-04-08"),
      }}
      label="Stay duration"
    />
  );
};

export default Calendar;

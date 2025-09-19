import React from "react";
import DatePickerField from "./DatePickerField";
import type { ComponentProps } from "react";

const TimePickerField: React.FC<Omit<ComponentProps<typeof DatePickerField>, "mode">> = ({
  placeholder = "Select time",
  ...rest
}) => {
  return <DatePickerField mode="time" placeholder={placeholder} {...rest} />;
};

TimePickerField.displayName = "TimePickerField";

export default TimePickerField;

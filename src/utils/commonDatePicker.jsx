import React from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const CustomDatePicker = ({
  label,
  value,
  onChange,
  defaultValue,
  display = true,
  sx = {},
  minDate,
  maxDate,
  disablePast = false,
  disableFuture = false,
  disabled = false,
}) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div
        style={{
          display: display ? "block" : "none",
          paddingTop: "10px",
        }}
      >
        <DatePicker
          label={label}
          format="DD-MM-YYYY"
          disablePast={disablePast}
          disableFuture={disableFuture}
          disabled={disabled}
          minDate={minDate ? dayjs(minDate) : undefined}
          maxDate={maxDate ? dayjs(maxDate) : undefined}
          required
          defaultValue={dayjs(defaultValue)}
          value={dayjs(value)}
          onChange={onChange}
          slotProps={{
            textField: {
              size: "small",
              error: false,
              placeholder: "DD-MM-YYYY",
              InputProps: {
                sx: {
                  '& input[type="number"]::-webkit-inner-spin-button, & input[type="number"]::-webkit-outer-spin-button':
                    {
                      WebkitAppearance: "none",
                      margin: 0,
                    },
                  '& input[type="number"]': {
                    MozAppearance: "textfield",
                  },
                  "& input": {
                    MozAppearance: "textfield",
                  },
                },
              },
              inputProps: {
                inputMode: "text",
              },
            },
          }}
          sx={{ paddingRight: "1%", ...sx }}
        />
      </div>
    </LocalizationProvider>
  );
};

export default CustomDatePicker;

import React, {ChangeEvent, useEffect, useState} from "react";
import {styled} from "@mui/material/styles";
import {Autocomplete, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField} from "@mui/material";
import {SearchCity_searchCity} from "../../../graphql/model/SearchCity";

interface CustomTextInputProps {
    label: string,
    onTextInput: (e: string) => void
    options: SearchCity_searchCity[]
    enterKey: () => void
}

export const CustomAutocomplete = (props: CustomTextInputProps) => {
    const [options, setOptions] = useState<SearchCity_searchCity[]>([])


    const enter = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === "Enter") {
            props.enterKey()
        }
    }

    return (
        <FormControl size="small">
            <Autocomplete
                id={"tags-standard"}
                getOptionLabel={option => typeof option === "string" ? option : option.name}
                freeSolo
                options={props.options}

                renderInput={
                    (params) =>
                        <CssTextField
                            {...params}
                            label={props.label}
                            onKeyPress={(e) => enter(e)}
                        />}
            />
        </FormControl>
    )
}
export const CssTextField = styled(TextField)({
    width: "20vw",
    maxWidth: "350px",
    fontFamily: "font-family: 'Open Sans', sans-serif",
    color: "#333533",
    '& .MuiInput-underline:after': {
        borderBottomColor: '#D9E2E8',
    },
    '& .MuiOutlinedInput-root': {
        background: "#D9E2E8",
        '&:hover fieldset': {
            borderColor: '#333533',
        },
        '&.Mui-focused fieldset': {
            borderColor: '#38e4ae',
        },
    },
});
interface CustomSelectProps {
    label: string,
    onInput: (e: string | number) => void
    options: SelectItem[]
}

export class SelectItem {
    label: string;
    value: string | number;

    constructor(label: string, value: string | number) {
        this.label = label;
        this.value = value;
    }

}

export const CustomSelect = (props: CustomSelectProps) => {

    const elevateTextInput = (e: SelectChangeEvent<any>) => {
        props.onInput(e.target.value)

    }

    const CssSelect = styled(Select)({
        width: "15vw",
        maxWidth: "350px",
        fontFamily: "font-family: 'Open Sans', sans-serif",
        color: "#333533",
        '& .MuiSelect-outlined': {
            background: "#D9E2E8",
            '&:hover fieldset': {
                borderColor: '#333533',
            },
            '&.Mui-focused notchedOutline': {
                borderColor: '#38e4ae',
            },
        },
    });


    return (
        <FormControl size="small">
            <InputLabel>{props.label}</InputLabel>
            <CssSelect label={props.label} onChange={(e) => elevateTextInput(e)}>
                {props.options.map(item => (
                    <MenuItem value={item.value} key={item.value}>{item.label}</MenuItem>
                ))}
            </CssSelect>
        </FormControl>)
}

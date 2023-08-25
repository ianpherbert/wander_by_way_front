import {Autocomplete, AutocompleteProps, Skeleton, TextField} from "@mui/material";
import {CityOutput, SearchCityDocument, SearchCityQuery, SearchCityQueryVariables} from "../../../gql/graphql";
import React, {FormEvent, useCallback, useMemo, useState} from "react";
import {useQuery} from "@apollo/client";
import {debounce} from "lodash";
import getInputValue from "../../../utils/getInputValue";

type CitySearchInputProps = Omit<AutocompleteProps<CityOutput, false, boolean, false>, "renderInput" | "options"> & {
    label: string;
    exludeCities?: CityOutput[]
}

function CitySearchInput({label, exludeCities, ...props}: CitySearchInputProps) {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const {data, loading} = useQuery<SearchCityQuery, SearchCityQueryVariables>(SearchCityDocument, {
        variables: {
            query: searchTerm
        }
    });
    const changeSearchTerm = useCallback((e: FormEvent<HTMLDivElement>) => {
        debounce((term: string) => {
            setSearchTerm(term);
        }, 400)(getInputValue(e));
    }, [setSearchTerm]);

    const options = useMemo(() => {
        const allOptions = data?.searchCity as CityOutput[] || [];
        if (exludeCities) {
            const excludeIds = exludeCities.map(it => it.id);
            return allOptions.filter(it => !excludeIds.includes(it.id));
        }
        return allOptions;
    }, [data, loading]);

    return (
        <Autocomplete
            {...props}

            getOptionLabel={option => `${option?.name}, ${option?.country}`}
            options={options}
            onInput={(e) => changeSearchTerm(e)}
            noOptionsText={loading ? <Skeleton variant="text"/> : "No results"}
            filterOptions={(options, state) => {
                const regex = new RegExp(state.inputValue.replace(/[- ]/g, '[- ]'), 'i');
                return options.filter(string => regex.test(string.name));
            }}
            renderInput={(params) => (
                <TextField
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            background: "#D9E2E8",
                            '&:hover fieldset': {
                                borderColor: '#333533',
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: '#38e4ae',
                            },
                        }
                    }}
                    {...params}
                    label={label}
                    variant="outlined"
                />
            )}
        />);
}

export default CitySearchInput;
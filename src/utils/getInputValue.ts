import {FormEvent} from "react";

function getInputValue(e: FormEvent<HTMLDivElement | HTMLInputElement>) {
    return (e.target as HTMLInputElement).value;
}

export default getInputValue;
import {hello} from "../names/hello";

export function randomHello(): string {
    const randomIndex = Math.floor(Math.random() * hello.length);
    return hello[randomIndex].translation;
}
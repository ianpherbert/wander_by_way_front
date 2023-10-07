import {LinearProgress, LinearProgressProps, Stack, Typography} from "@mui/material";

type MapLoaderProps = LinearProgressProps & {
    loadingText?: string;
}

export default function MapLoader({loadingText, ...props}: MapLoaderProps) {
    return (
        <Stack sx={styles.container} direction="row">
            <Typography variant="caption">{loadingText}</Typography>
            <LinearProgress sx={loadingText ? styles.barWithLabel : styles.bar} {...props}/>
        </Stack>
    );
}

const styles = {
    container: {
        height: 15,
        alignItems: "center"
    },
    bar: {
        flex: 1
    },
    barWithLabel: {
        ml: 1,
        flex: 1
    }
};
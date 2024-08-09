import { View } from "react-native";
import React, { useMemo } from "react";
import Cell from "./Cell";

const VerticalPath = React.memo(({ cells, color }) => {
    const groupedCells = useMemo(() => {
        const grouped = [];
        for (let i = 0; i < cells.length; i += 3) {
            grouped.push(cells.slice(i, i + 3));
        }
        return grouped;
    }, [cells]);

    return (
        <View style={{ flexDirection: "row", alignItems: "center", width: "20%", height: "100%" }}>
            <View style={{ width: "100%", height: "100%", flexDirection: "column" }}>
                {groupedCells.map((group, groupIndex) => (
                    <View
                        key={groupIndex}
                        style={{ flexDirection: "row", width: "33.3%", height: "16.7%" }}
                    >
                        {group.map((cell, index) => (
                            <Cell
                                key={index + "" + groupIndex}
                                cell={true}
                                id={cell}
                                color={color}
                            />
                        ))}
                    </View>
                ))}
            </View>
        </View>
    );
});

export default VerticalPath;

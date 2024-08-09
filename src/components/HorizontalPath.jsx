import { View } from "react-native";
import React, { useMemo } from "react";
import Cell from "./Cell";

const HorizontalPath = ({ cells, color }) => {
    const groupedCells = useMemo(() => {
        const grouped = [];
        for (let i = 0; i < cells.length; i += 6) {
            grouped.push(cells.slice(i, i + 6));
        }
        return grouped;
    }, [cells]);
    return (
        <View style={{ flexDirection: "row", alignItems: "center", width: "40%", height: "100%" }}>
            <View style={{ width: "100%", height: "100%", flexDirection: "column" }}>
                {groupedCells.map((group, groupIndex) => (
                    <View
                        key={groupIndex}
                        style={{ flexDirection: "row", width: "16.7%", height: "33.3%" }}
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
};

export default HorizontalPath;

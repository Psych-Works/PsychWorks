interface VisualPercentageShift {
    Name: string;
    Start: number;
    End: number;
    ConversionFactor: number;
}

const VisualPercentageShift: VisualPercentageShift[] = [
    {
        Name: "First Threshold",
        Start: 0,
        End: 8,
        ConversionFactor: 3,
    },
    {
        Name: "Second Threshold",
        Start: 9,
        End: 24,
        ConversionFactor: 1.5625,
    },
    {
        Name: "Third Threshold",
        Start: 25,
        End: 74,
        ConversionFactor: 0.6,
    },
    {
        Name: "Fourth Threshold",
        Start: 75,
        End: 100,
        ConversionFactor: 0.8,
    },
]

export function convertToVisualPercentage(actualPercentage: number): number {
    const threshold = VisualPercentageShift.find(shift => actualPercentage >= shift.Start && actualPercentage <= shift.End);
    if (!threshold) {
        return 0;
    }
    let result: number = 0;
    if (threshold.Name === "First Threshold") {
        result = actualPercentage * threshold.ConversionFactor;
    } else if (threshold.Name === "Second Threshold") {
        result = threshold.End + ((actualPercentage - threshold.Start) * threshold.ConversionFactor);
    } else if (threshold.Name === "Third Threshold") {
        result = 50 + ((actualPercentage - threshold.Start) * threshold.ConversionFactor);
    } else if (threshold.Name === "Fourth Threshold") {
        result = 80 + ((actualPercentage - threshold.Start) * threshold.ConversionFactor);
    }
    return result;
}


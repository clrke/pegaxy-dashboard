import RawRace from "../rawmodels/RawRace";

export default function mergeRaces(rawRaces1: RawRace[], rawRaces2: RawRace[]): RawRace[] {
    const mergedRaces: RawRace[] = [];

    rawRaces1.forEach(rawRace1 => {
        const race2 = rawRaces2.find(rawRace2 => rawRace1.id === rawRace2.id);
        if (race2) {
            mergedRaces.push({
                ...rawRace1,
                ...race2
            });
        } else {
            mergedRaces.push(rawRace1);
        }
    });

    rawRaces2.forEach(rawRace2 => {
        const race1 = rawRaces1.find(rawRace1 => rawRace1.id === rawRace2.id);
        if (!race1) {
            mergedRaces.push(rawRace2);
        }
    });

    return mergedRaces;
}

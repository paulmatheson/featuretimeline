import { TeamSettingsIteration, TimeFrame } from "TFS/Work/Contracts";

export function compareIteration(i1: TeamSettingsIteration, i2: TeamSettingsIteration): number {
    if (hasDates(i1) && !hasDates(i2)) {
        return -1;
    }

    if (hasDates(i2) && !hasDates(i1)) {
        return 1;
    }

    if (!hasDates(i1) && !hasDates(i2)) {
        return comparePath(i1, i2);
    }

    if (getStartTime(i1) === getStartTime(i2)) {
        return getFinishTime(i1) - getFinishTime(i2);
    }

    return getStartTime(i1) - getStartTime(i2);
}


export function getCurrentIterationIndex(iterations: TeamSettingsIteration[]): number {
    if (TimeFrame) {
        return iterations.findIndex(i => i.attributes.timeFrame === TimeFrame.Current);
    }

    return iterations.findIndex(isCurrentIteration);
}

export function isCurrentIteration(iteration: TeamSettingsIteration): boolean {

    if (TimeFrame) {
        return iteration.attributes.timeFrame === TimeFrame.Current;
    }

    const today = new Date(Date.now());
    const currentTimeStamp = (new Date(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate())).getTime();

    if (!hasDates(iteration)
        || (iteration.attributes.startDate.getTime() <= currentTimeStamp
            && iteration.attributes.finishDate.getTime() >= currentTimeStamp)) {
        return true;
    }

    return false;
}

function hasDates(iteration: TeamSettingsIteration): boolean {
    return !!iteration.attributes.startDate && !!iteration.attributes.finishDate;
}

function comparePath(i1: TeamSettingsIteration, i2: TeamSettingsIteration): number {
    return i1.path.localeCompare(i2.path);
}

function getStartTime(iteration: TeamSettingsIteration): number {
    return iteration.attributes.startDate.getTime();
}

function getFinishTime(iteration: TeamSettingsIteration): number {
    return iteration.attributes.finishDate.getTime();
}